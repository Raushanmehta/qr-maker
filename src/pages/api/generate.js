import dbConnect from '../../lib/dbConnect';
import QRCodeModel from '../../models/QRCode'; 
import QRCode from 'qrcode';
import jwt from 'jsonwebtoken';

// Unique code generator (Alternative to nanoid)
const generateShortCode = (length = 8) => {
  const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
};

export default async function handler(req, res) {
  const { method } = req;

  await dbConnect();

  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ success: false, message: 'Not authenticated' });
  }

  const token = authHeader.split(' ')[1];
  let decoded;
  try {
    decoded = jwt.verify(token, process.env.JWT_SECRET);
  } catch (err) {
    return res.status(401).json({ success: false, message: 'Invalid token' });
  }

  const userId = decoded.userId;

  if (method === 'POST') {
    try {
      const { content, label, color, bgColor, logo, size, isDynamic = true } = req.body;

      if (!content) {
        return res.status(400).json({ success: false, message: 'Content is required' });
      }

      // Generate a unique short code
      let shortCode = generateShortCode(8);
      let existing = await QRCodeModel.findOne({ shortCode });
      while(existing) {
        shortCode = generateShortCode(8);
        existing = await QRCodeModel.findOne({ shortCode });
      }

      // Determin the content to be encoded in the QR
      let qrContent = content;
      if (isDynamic) {
        // Construct the tracking URL
        const protocol = req.headers['x-forwarded-proto'] || 'http';
        const host = req.headers.host;
        qrContent = `${protocol}://${host}/q/${shortCode}`;
      }

      // Generate QR Code with colors
      const qrOptions = {
        color: {
          dark: color || '#000000',
          light: bgColor || '#ffffff'
        },
        width: size ? parseInt(size) : 300,
        margin: 2,
        errorCorrectionLevel: 'H' // High error correction for logo support
      };
      
      const qrImage = await QRCode.toDataURL(qrContent, qrOptions);

      // Save to database
      const newQR = await QRCodeModel.create({
        userId,
        content, // The target URL/Text
        label: label || content.substring(0, 20),
        qrImage,
        color: color || '#000000',
        bgColor: bgColor || '#ffffff',
        logo,
        shortCode,
        isDynamic,
      });

      res.status(201).json({ success: true, data: newQR });
    } catch (error) {
      console.error(error);
      res.status(400).json({ success: false, message: error.message });
    }
  } else if (method === 'GET') {
    try {
      // Add .limit() and .lean() for high query performance and memory optimization to scale for massive user limits.
      const qrs = await QRCodeModel.find({ userId })
        .sort({ createdAt: -1 })
        .limit(100)
        .lean();
      res.status(200).json({ success: true, data: qrs });
    } catch (error) {
      res.status(400).json({ success: false, message: error.message });
    }
  } else if (method === 'PATCH') {
     try {
       const { id, isActive } = req.body;
       const updated = await QRCodeModel.findOneAndUpdate(
         { _id: id, userId },
         { isActive: Boolean(isActive) },
         { new: true }
       );
       if (!updated) {
          return res.status(404).json({ success: false, message: 'QR not found or unauthorized' });
       }
       res.status(200).json({ success: true, data: updated });
     } catch (error) {
       res.status(400).json({ success: false, message: error.message });
     }
  } else if (method === 'DELETE') {
     try {
       const { id } = req.body;
       const deleted = await QRCodeModel.findOneAndDelete({ _id: id, userId });
       if (!deleted) {
          return res.status(404).json({ success: false, message: 'QR not found or unauthorized' });
       }
       res.status(200).json({ success: true, message: 'QR deleted' });
     } catch (error) {
       res.status(400).json({ success: false, message: error.message });
     }
  } else {
    res.setHeader('Allow', ['POST', 'GET', 'DELETE']);
    res.status(405).end(`Method ${method} Not Allowed`);
  }
}
