const router = require('express').Router();
const Vehicle = require('../models/Vehicle');
const { authRequired } = require('../middleware/auth');
const upload = require('../middleware/upload');
const fs = require('fs');
const path = require('path');

router.get('/', async (req, res) => {
  try {
    const { ownerId } = req.query;
    let query = {};
    
    if (ownerId) {
      query.ownerId = ownerId;
    }
    
    const vehicles = await Vehicle.find(query).sort({ createdAt: -1 });
    res.json(vehicles);
  } catch (error) {
    console.error('Error fetching vehicles:', error);
    res.status(500).json({ message: 'Error fetching vehicles' });
  }
});

// Get vehicles by owner ID
router.get('/owner/:ownerId', authRequired, async (req, res) => {
  try {
    // Check if the authenticated user is requesting their own vehicles
    if (req.userId !== req.params.ownerId) {
      return res.status(403).json({ message: 'Unauthorized' });
    }
    
    const vehicles = await Vehicle.find({ ownerId: req.params.ownerId }).sort({ createdAt: -1 });
    res.json(vehicles);
  } catch (err) {
    console.error('Error fetching owner vehicles:', err);
    res.status(500).json({ message: 'Error fetching vehicles' });
  }
});

// Add vehicle with file upload
router.post('/', authRequired, upload.fields([
  { name: 'photo', maxCount: 1 },
  { name: 'documents.rc', maxCount: 1 },
  { name: 'documents.insurance', maxCount: 1 },
  { name: 'documents.pollution', maxCount: 1 }
]), async (req, res) => {
  try {
    const payload = { ...req.body, ownerId: req.userId };
    
    // Handle file uploads
    if (req.files) {
      if (req.files.photo && req.files.photo[0]) {
        payload.photo = req.files.photo[0].filename;
      }
      
      if (req.files['documents.rc'] && req.files['documents.rc'][0]) {
        payload.documents = payload.documents || {};
        payload.documents.rc = req.files['documents.rc'][0].filename;
      }
      
      if (req.files['documents.insurance'] && req.files['documents.insurance'][0]) {
        payload.documents = payload.documents || {};
        payload.documents.insurance = req.files['documents.insurance'][0].filename;
      }
      
      if (req.files['documents.pollution'] && req.files['documents.pollution'][0]) {
        payload.documents = payload.documents || {};
        payload.documents.pollution = req.files['documents.pollution'][0].filename;
      }
    }
    
    // Parse features if it's a string
    if (payload.features && typeof payload.features === 'string') {
      try {
        payload.features = JSON.parse(payload.features);
      } catch (e) {
        payload.features = [payload.features];
      }
    }
    
    // Convert numeric fields
    if (payload.year) payload.year = parseInt(payload.year);
    if (payload.mileage) payload.mileage = parseInt(payload.mileage);
    if (payload.rentPerHour) payload.rentPerHour = parseFloat(payload.rentPerHour);
    if (payload.rentPerDay) payload.rentPerDay = parseFloat(payload.rentPerDay);
    if (payload.securityDeposit) payload.securityDeposit = parseFloat(payload.securityDeposit);
    if (payload.maxDistance) payload.maxDistance = parseInt(payload.maxDistance);
    
    console.log('Creating vehicle with payload:', payload);
    
    const vehicle = await Vehicle.create(payload);
    res.status(201).json(vehicle);
  } catch (err) {
    console.error('Error creating vehicle:', err);
    res.status(400).json({ message: err.message || 'Invalid vehicle data' });
  }
});

// Get vehicle by ID
router.get('/vehicle/:id', async (req, res) => {
  try {
    const v = await Vehicle.findById(req.params.id);
    if (!v) return res.status(404).json({ message: 'Vehicle not found' });
    res.json(v);
  } catch (error) {
    console.error('Error fetching vehicle:', error);
    res.status(500).json({ message: 'Error fetching vehicle' });
  }
});

// Delete vehicle (owner only)
router.delete('/vehicle/:id', authRequired, async (req, res) => {
  try {
    const vehicle = await Vehicle.findById(req.params.id);
    if (!vehicle) {
      return res.status(404).json({ message: 'Vehicle not found' });
    }
    
    // Check if the authenticated user owns this vehicle
    if (vehicle.ownerId.toString() !== req.userId) {
      return res.status(403).json({ message: 'Unauthorized to delete this vehicle' });
    }
    
    await Vehicle.findByIdAndDelete(req.params.id);
    res.json({ message: 'Vehicle deleted successfully' });
  } catch (err) {
    console.error('Error deleting vehicle:', err);
    res.status(500).json({ message: 'Error deleting vehicle' });
  }
});

// Update vehicle (owner only)
router.put('/vehicle/:id', authRequired, upload.fields([
  { name: 'photo', maxCount: 1 },
  { name: 'documents.rc', maxCount: 1 },
  { name: 'documents.insurance', maxCount: 1 },
  { name: 'documents.pollution', maxCount: 1 }
]), async (req, res) => {
  try {
    const vehicle = await Vehicle.findById(req.params.id);
    if (!vehicle) {
      return res.status(404).json({ message: 'Vehicle not found' });
    }
    
    // Check if the authenticated user owns this vehicle
    if (vehicle.ownerId.toString() !== req.userId) {
      return res.status(403).json({ message: 'Unauthorized to update this vehicle' });
    }

    const updateData = { ...req.body };
    
    // Handle file uploads
    if (req.files) {
      if (req.files.photo && req.files.photo[0]) {
        updateData.photo = req.files.photo[0].filename;
      }
      
      if (req.files['documents.rc'] && req.files['documents.rc'][0]) {
        updateData.documents = updateData.documents || {};
        updateData.documents.rc = req.files['documents.rc'][0].filename;
      }
      
      if (req.files['documents.insurance'] && req.files['documents.insurance'][0]) {
        updateData.documents = updateData.documents || {};
        updateData.documents.insurance = req.files['documents.insurance'][0].filename;
      }
      
      if (req.files['documents.pollution'] && req.files['documents.pollution'][0]) {
        updateData.documents = updateData.documents || {};
        updateData.documents.pollution = req.files['documents.pollution'][0].filename;
      }
    }
    
    // Parse features if it's a string
    if (updateData.features && typeof updateData.features === 'string') {
      try {
        updateData.features = JSON.parse(updateData.features);
      } catch (e) {
        updateData.features = [updateData.features];
      }
    }
    
    // Convert numeric fields
    if (updateData.year) updateData.year = parseInt(updateData.year);
    if (updateData.mileage) updateData.mileage = parseInt(updateData.mileage);
    if (updateData.rentPerHour) updateData.rentPerHour = parseFloat(updateData.rentPerHour);
    if (updateData.rentPerDay) updateData.rentPerDay = parseFloat(updateData.rentPerDay);
    if (updateData.securityDeposit) updateData.securityDeposit = parseFloat(updateData.securityDeposit);
    if (updateData.maxDistance) updateData.maxDistance = parseInt(updateData.maxDistance);
    
    console.log('Updating vehicle with data:', updateData);
    
    const updatedVehicle = await Vehicle.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true }
    );
    
    res.json(updatedVehicle);
  } catch (err) {
    console.error('Error updating vehicle:', err);
    res.status(400).json({ message: err.message || 'Invalid vehicle data' });
  }
});

module.exports = router;


