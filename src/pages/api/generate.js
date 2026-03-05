import dbConnect from '../../lib/dbConnect';
import QRCodeModel from '../../models/QRCode'; 
import QRCode from 'qrcode';
import jwt from 'jsonwebtoken';

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
      const { content, label, color, bgColor, logo, size } = req.body;

      if (!content) {
        return res.status(400).json({ success: false, message: 'Content is required' });
      }

      // Generate QR Code with colors
      const qrOptions = {
        color: {
          dark: color || '#000000',
          light: bgColor || '#ffffff'
        },
        width: size ? parseInt(size) : 300
      };
      
      const qrImage = await QRCode.toDataURL(content, qrOptions);

      // Save to database
      const newQR = await QRCodeModel.create({
        userId,
        content,
        label: label || content.substring(0, 20),
        qrImage,
        color: color || '#000000',
        bgColor: bgColor || '#ffffff',
        logo,
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
