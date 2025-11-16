const { Schema, model } = require('mongoose');

const notificationSchema = new Schema(
  {
    userId: { 
      type: Schema.Types.ObjectId, 
      required: true,
      refPath: 'userType'
    },
    userType: {
      type: String,
      required: true,
      enum: ['Owner', 'Renter']
    },
    type: { 
      type: String, 
      required: true,
      enum: ['booking_request', 'booking_approved', 'booking_rejected', 'booking_cancelled', 'new_vehicle', 'vehicle_updated']
    },
    title: { 
      type: String, 
      required: true 
    },
    message: { 
      type: String, 
      required: true 
    },
    relatedId: { 
      type: Schema.Types.ObjectId 
    },
    relatedType: {
      type: String,
      enum: ['Booking', 'Vehicle']
    },
    read: { 
      type: Boolean, 
      default: false 
    },
    metadata: {
      type: Schema.Types.Mixed
    }
  },
  { 
    timestamps: true 
  }
);

// Add indexes for efficient queries
notificationSchema.index({ userId: 1, read: 1, createdAt: -1 });

module.exports = model('Notification', notificationSchema);
