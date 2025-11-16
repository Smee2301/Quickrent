const { Schema, model } = require('mongoose');

const bookingSchema = new Schema(
  {
    vehicleId: { 
      type: Schema.Types.ObjectId, 
      ref: 'Vehicle', 
      required: true 
    },
    ownerId: { 
      type: Schema.Types.ObjectId, 
      ref: 'Owner', 
      required: true 
    },
    renterId: { 
      type: Schema.Types.ObjectId, 
      ref: 'Renter', 
      required: true 
    },
    pickupDate: { 
      type: Date, 
      required: true 
    },
    returnDate: { 
      type: Date, 
      required: true 
    },
    pickupTime: { 
      type: String, 
      required: true 
    },
    returnTime: { 
      type: String, 
      required: true 
    },
    pickupLocation: { 
      type: String, 
      required: true 
    },
    returnLocation: { 
      type: String, 
      required: true 
    },
    totalHours: { 
      type: Number, 
      required: true 
    },
    hourlyRate: { 
      type: Number, 
      required: true 
    },
    totalAmount: { 
      type: Number, 
      required: true 
    },
    securityDeposit: { 
      type: Number, 
      required: true 
    },
    status: { 
      type: String, 
      enum: ['pending', 'approved', 'rejected', 'cancelled', 'completed', 'ongoing'], 
      default: 'pending' 
    },
    renterNotes: { 
      type: String 
    },
    ownerNotes: { 
      type: String 
    },
    rejectionReason: { 
      type: String 
    },
    cancellationReason: {
      type: String
    },
    cancelledAt: {
      type: Date
    }
  },
  { 
    timestamps: true 
  }
);

// Add indexes for efficient queries
bookingSchema.index({ ownerId: 1, status: 1 });
bookingSchema.index({ renterId: 1, status: 1 });
bookingSchema.index({ vehicleId: 1 });

module.exports = model('Booking', bookingSchema);
