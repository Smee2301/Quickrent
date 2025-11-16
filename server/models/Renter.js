const { Schema, model } = require('mongoose');

const renterSchema = new Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    phone: { type: String, required: true },
    city: { type: String },
    passwordHash: { type: String, required: true },
    profileImage: { type: String },
    twoFactorEnabled: { type: Boolean, default: false },
    totalBookings: { type: Number, default: 0 },
    // Renter-specific fields can be added here
    address: { type: String },
    dateOfBirth: { type: Date },
    emergencyContact: { type: String },
    identityDocument: { type: String },
    isVerified: { type: Boolean, default: false },
    averageRating: { type: Number, default: 0 },
    referralCode: { type: String, default: null, sparse: true, unique: true },
    gender: { type: String, enum: ['Male', 'Female', 'Other', ''] },
    pincode: { type: String }
  },
  { timestamps: true, collection: 'renters' }
);

module.exports = model('Renter', renterSchema);

