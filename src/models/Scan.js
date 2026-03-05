import mongoose from 'mongoose';

const ScanSchema = new mongoose.Schema({
  qrId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'QRCode',
    required: true,
    index: true,
  },
  scannedAt: {
    type: Date,
    default: Date.now,
  },
  ip: {
    type: String,
  },
  userAgent: {
    type: String,
  },
  device: {
    type: String, // Mobile, Desktop, Tablet
  },
  browser: {
    type: String,
  },
  os: {
    type: String,
  },
  city: {
    type: String,
  },
  country: {
    type: String,
  }
}, { timestamps: true });

export default mongoose.models.Scan || mongoose.model('Scan', ScanSchema);
