const { Schema, model } = require('mongoose');

const vehicleSchema = new Schema(
  {
    ownerId: { type: Schema.Types.ObjectId, ref: 'Owner', required: true },
    brand: { type: String, required: true },
    model: { type: String, required: true },
    type: { type: String, enum: ['Car', 'Bike', 'Scooter', 'Van', 'SUV', 'Truck'], required: true },
    year: { type: Number, required: true },
    color: { type: String, required: true },
    vehicleNumber: { type: String, required: true },
    fuelType: { type: String, required: true },
    transmission: { type: String, default: 'Manual' },
    mileage: { type: Number, required: true },
    rentPerHour: { type: Number, required: true },
    rentPerDay: { type: Number },
    securityDeposit: { type: Number, required: true },
    availableFrom: { type: Date, required: true },
    maxDistance: { type: Number, required: true },
    pickupLocation: { type: String, required: true },
    returnLocation: { type: String, required: true },
    features: [{ type: String }],
    photo: { type: String },
    images: [{ type: String }],
    documents: {
      rc: { type: String },
      insurance: { type: String },
      pollution: { type: String, required: true }
    },
    notes: String,
    isAvailable: { type: Boolean, default: true },
    status: { type: String, enum: ['active', 'inactive', 'maintenance'], default: 'active' }
  },
  { timestamps: true }
);

module.exports = model('Vehicle', vehicleSchema);


