const { Schema, model } = require('mongoose');

const maintenanceSchema = new Schema(
  {
    ownerId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    vehicleId: { type: Schema.Types.ObjectId, ref: 'Vehicle', required: true },
    serviceType: { type: String, required: true },
    date: { type: Date, required: true },
    cost: { type: Number, required: true },
    notes: String,
    documents: [String], // Array of document file paths
    serviceCenter: String,
    technician: String,
    nextServiceDate: Date,
    status: { type: String, enum: ['completed', 'pending', 'cancelled'], default: 'completed' }
  },
  { timestamps: true }
);

module.exports = model('Maintenance', maintenanceSchema);
