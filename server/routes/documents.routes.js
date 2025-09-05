const express = require('express');
const router = express.Router();
const { authRequired } = require('../middleware/auth');
const upload = require('../middleware/upload');

// Upload documents
router.post('/upload', authRequired, upload.fields([
  { name: 'idProof', maxCount: 1 },
  { name: 'license', maxCount: 1 },
  { name: 'rc', maxCount: 1 },
  { name: 'insurance', maxCount: 1 },
  { name: 'pollution', maxCount: 1 }
]), async (req, res) => {
  try {
    const uploadedFiles = {};
    
    if (req.files) {
      Object.keys(req.files).forEach(fieldName => {
        if (req.files[fieldName] && req.files[fieldName][0]) {
          uploadedFiles[fieldName] = req.files[fieldName][0].filename;
        }
      });
    }

    res.status(200).json({
      message: 'Documents uploaded successfully',
      files: uploadedFiles
    });
  } catch (error) {
    console.error('Error uploading documents:', error);
    res.status(500).json({ message: 'Failed to upload documents' });
  }
});

module.exports = router;
