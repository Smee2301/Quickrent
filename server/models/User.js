const { Schema, model } = require('mongoose');

const userSchema = new Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    phone: { type: String },
    city: { type: String },
    role: { type: String, enum: ['owner', 'renter'], required: true },
    passwordHash: { type: String, required: true },
    profileImage: { type: String },
    twoFactorEnabled: { type: Boolean, default: false },
    totalVehicles: { type: Number, default: 0 },
    totalBookings: { type: Number, default: 0 },
    totalEarnings: { type: Number, default: 0 }
  },
  { timestamps: true }
);

module.exports = model('User', userSchema);


