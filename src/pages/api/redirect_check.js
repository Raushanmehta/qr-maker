import dbConnect from '../../lib/dbConnect';
import QRCodeModel from '../../models/QRCode';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).end();
  }

  const { shortCode, password } = req.body;
  await dbConnect();

  try {
    // Use .lean() for rapid querying
    const qr = await QRCodeModel.findOne({ shortCode }).lean();
    if (!qr) return res.status(404).json({ success: false, message: 'Not found' });

    if (qr.isActive === false) return res.status(403).json({ success: false, message: 'QR Code is inactive' });

    if (qr.password === password) {
       // Increment count atomically for password protected ones
       await QRCodeModel.updateOne({ _id: qr._id }, { $inc: { scanCount: 1 } });
       return res.status(200).json({ success: true, url: qr.content });
    } else {
       return res.status(401).json({ success: false, message: 'Incorrect password' });
    }
  } catch (e) {
    return res.status(500).json({ success: false, message: 'Error' });
  }
}
