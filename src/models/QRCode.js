import mongoose from 'mongoose';

const QRCodeSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true,
  },
  content: {
    type: String,
    required: true,
  },
  label: {
    type: String,
    default: 'Untitled',
  },
  qrImage: {
    type: String, // Store Base64 data URI
    required: true,
  },
  isDynamic: {
    type: Boolean,
    default: false,
  },
  shortCode: {
    type: String,
    unique: true,
    sparse: true,
  },
  scanCount: {
    type: Number,
    default: 0,
  },
  expiresAt: {
    type: Date,
  },
  password: {
    type: String, // Simple password for link protection
  },
  isActive: {
    type: Boolean,
    default: true,
  },
  color: {
    type: String,
    default: '#000000',
  },
  bgColor: {
    type: String,
    default: '#ffffff',
  },
  logo: {
    type: String, // URL to logo
  },
}, { timestamps: true });

export default mongoose.models.QRCode || mongoose.model('QRCode', QRCodeSchema);
