import dbConnect from '../../lib/dbConnect';
import QRCodeModel from '../../models/QRCode';
import ScanModel from '../../models/Scan';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).end();
  }

  const { shortCode, password } = req.body;
  await dbConnect();

  try {
    const qr = await QRCodeModel.findOne({ shortCode }).lean();
    if (!qr) return res.status(404).json({ success: false, message: 'Not found' });

    if (qr.isActive === false) return res.status(403).json({ success: false, message: 'QR Code is inactive' });

    if (qr.password === password) {
       // Capture scan details
       const userAgent = req.headers['user-agent'] || '';
       const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress || '';
       
       let device = 'Desktop';
       if (/Mobi|Android/i.test(userAgent)) device = 'Mobile';
       else if (/Tablet|iPad/i.test(userAgent)) device = 'Tablet';

       // Log the scan
       const scanPromise = ScanModel.create({
         qrId: qr._id,
         ip,
         userAgent,
         device,
       });

       // Increment count atomically for password protected ones
       const updatePromise = QRCodeModel.updateOne({ _id: qr._id }, { $inc: { scanCount: 1 } });
       
       await Promise.all([scanPromise, updatePromise]);

       return res.status(200).json({ success: true, url: qr.content });
    } else {
       return res.status(401).json({ success: false, message: 'Incorrect password' });
    }
  } catch (e) {
    console.error('Redirect check error:', e);
    return res.status(500).json({ success: false, message: 'Error' });
  }
}
