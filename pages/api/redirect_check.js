import dbConnect from '../../lib/dbConnect';
import QRCodeModel from '../../models/QRCode';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).end();
  }

  const { shortCode, password } = req.body;
  await dbConnect();

  try {
    const qr = await QRCodeModel.findOne({ shortCode });
    if (!qr) return res.status(404).json({ success: false, message: 'Not found' });

    if (qr.password === password) {
       // Increment count here for password protected ones
       qr.scanCount = (qr.scanCount || 0) + 1;
       await qr.save();
       return res.status(200).json({ success: true, url: qr.content });
    } else {
       return res.status(401).json({ success: false, message: 'Incorrect password' });
    }
  } catch (e) {
    return res.status(500).json({ success: false, message: 'Error' });
  }
}
