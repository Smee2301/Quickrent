const express = require('express');
const router = express.Router();
const { authRequired } = require('../middleware/auth');
const Maintenance = require('../models/Maintenance');
const upload = require('../middleware/upload'); // Added missing import

// Get maintenance records for an owner
router.get('/owner/:ownerId', authRequired, async (req, res) => {
  try {
    const { ownerId } = req.params;
    
    // Check if the authenticated user is requesting their own records
    if (req.userId !== ownerId) {
      return res.status(403).json({ message: 'Unauthorized' });
    }
    
    const records = await Maintenance.find({ ownerId })
      .populate('vehicleId', 'brand model vehicleNumber')
      .sort({ date: -1 });
    
    res.json(records);
  } catch (error) {
    console.error('Error fetching maintenance records:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Add new maintenance record with file upload
router.post('/', authRequired, upload.single('documents'), async (req, res) => {
  try {
    const {
      ownerId,
      vehicleId,
      serviceType,
      date,
      cost,
      notes
    } = req.body;

    // Check if the authenticated user is the owner
    if (req.userId !== ownerId) {
      return res.status(403).json({ message: 'Unauthorized' });
    }

    const maintenanceData = {
      ownerId,
      vehicleId,
      serviceType,
      date,
      cost: parseFloat(cost),
      notes
    };

    // Add document file if uploaded
    if (req.file) {
      maintenanceData.documents = [req.file.filename];
    }

    const maintenance = new Maintenance(maintenanceData);
    await maintenance.save();
    
    res.status(201).json(maintenance);
  } catch (error) {
    console.error('Error adding maintenance record:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Get maintenance record by ID
router.get('/record/:id', authRequired, async (req, res) => {
  try {
    const record = await Maintenance.findById(req.params.id)
      .populate('vehicleId', 'brand model vehicleNumber');
    
    if (!record) {
      return res.status(404).json({ message: 'Maintenance record not found' });
    }
    
    // Check if the authenticated user owns this record
    if (record.ownerId.toString() !== req.userId) {
      return res.status(403).json({ message: 'Unauthorized' });
    }
    
    res.json(record);
  } catch (error) {
    console.error('Error fetching maintenance record:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Update maintenance record
router.put('/record/:id', authRequired, async (req, res) => {
  try {
    const record = await Maintenance.findById(req.params.id);
    
    if (!record) {
      return res.status(404).json({ message: 'Maintenance record not found' });
    }
    
    // Check if the authenticated user owns this record
    if (record.ownerId.toString() !== req.userId) {
      return res.status(403).json({ message: 'Unauthorized' });
    }
    
    const updatedRecord = await Maintenance.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    
    res.json(updatedRecord);
  } catch (error) {
    console.error('Error updating maintenance record:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Delete maintenance record
router.delete('/record/:id', authRequired, async (req, res) => {
  try {
    const record = await Maintenance.findById(req.params.id);
    
    if (!record) {
      return res.status(404).json({ message: 'Maintenance record not found' });
    }
    
    // Check if the authenticated user owns this record
    if (record.ownerId.toString() !== req.userId) {
      return res.status(403).json({ message: 'Unauthorized' });
    }
    
    await Maintenance.findByIdAndDelete(req.params.id);
    res.json({ message: 'Maintenance record deleted successfully' });
  } catch (error) {
    console.error('Error deleting maintenance record:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

module.exports = router;
