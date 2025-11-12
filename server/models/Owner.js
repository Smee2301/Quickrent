const { Schema, model } = require('mongoose');

const ownerSchema = new Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    phone: { type: String, required: true },
    city: { type: String },
    passwordHash: { type: String, required: true },
    profileImage: { type: String },
    twoFactorEnabled: { type: Boolean, default: false },
    totalVehicles: { type: Number, default: 0 },
    totalBookings: { type: Number, default: 0 },
    totalEarnings: { type: Number, default: 0 },
    // Owner-specific fields
    businessName: { type: String },
    businessType: { type: String },
    businessRegistrationNumber: { type: String },
    taxId: { type: String },
    address: { type: String },
    dateOfBirth: { type: Date },
    emergencyContact: { type: String },
    identityDocument: { type: String },
    businessDocument: { type: String },
    bankAccountDetails: { type: Object },
    isFullyVerified: { type: Boolean, default: false },
    averageRating: { type: Number, default: 0 }
  },
  { timestamps: true, collection: 'owners' }
);

module.exports = model('Owner', ownerSchema);

