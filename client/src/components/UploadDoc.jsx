import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/UploadDoc.css";

export default function UploadDoc() {
  const [files, setFiles] = useState({
    idProof: null,
    license: null,
    rc: null,
    insurance: null,
    pollution: null
  });
  const [uploadedFiles, setUploadedFiles] = useState({});
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const navigate = useNavigate();

  const handleFileChange = (field) => (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file type
      const allowedTypes = [
        "application/pdf",
        "image/jpeg",
        "image/jpg", 
        "image/png"
      ];

      if (!allowedTypes.includes(file.type)) {
        setMessage("❌ Invalid file type. Only PDF, JPG, JPEG, and PNG files are allowed.");
        e.target.value = "";
        return;
      }

      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        setMessage("❌ File size too large. Maximum size is 5MB.");
        e.target.value = "";
        return;
      }

      setFiles(prev => ({ ...prev, [field]: file }));
      setMessage("✅ File selected successfully!");
      
      // Show popup for file details
      setSelectedFile({
        name: file.name,
        size: (file.size / 1024 / 1024).toFixed(2),
        type: file.type,
        field
      });
      setShowPopup(true);
    }
  };

  const closePopup = () => {
    setShowPopup(false);
    setSelectedFile(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage("");

    try {
      const token = localStorage.getItem("qr_token");
      if (!token) {
        setMessage("❌ Please login to upload documents");
        return;
      }

      const formData = new FormData();
      Object.entries(files).forEach(([key, file]) => {
        if (file) {
          formData.append(key, file);
        }
      });

      const response = await fetch("http://localhost:4000/api/documents/upload", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`
        },
        body: formData
      });

      let data;
      try {
        data = await response.json();
      } catch (_) {
        data = { message: "Unexpected server response" };
      }

      if (!response.ok) {
        throw new Error(data.message || "Failed to upload documents");
      }

      // Store uploaded files for display
      if (data.files) {
        setUploadedFiles(data.files);
      }

      setMessage("✅ Documents uploaded successfully!");
      
      // Show uploaded files popup
      setSelectedFile({
        name: "Uploaded Documents",
        files: data.files || {},
        message: "Documents uploaded successfully!"
      });
      setShowPopup(true);
      
      setTimeout(() => {
        navigate("/owner/dashboard");
      }, 1500);
    } catch (error) {
      const friendly =
        error.message.includes('File too large') ?
          '❌ File too large. Maximum size is 5MB.' :
        error.message.includes('Only images and PDF files are allowed') ?
          '❌ Invalid file type. Only PDF, JPG, JPEG, and PNG are allowed.' :
          '❌ ' + (error.message || 'Failed to upload documents');
      setMessage(friendly);
    } finally {
      setIsLoading(false);
    }
  };

  const openLocalPreview = (file) => {
    if (!file) return;
    const url = URL.createObjectURL(file);
    window.open(url, "_blank");
    // Revoke after a short delay to allow open
    setTimeout(() => URL.revokeObjectURL(url), 10000);
  };

  return (
    <div className="UPD">
      {/* Navbar */}
      <div className="navbarr">
        <img src="/logo1.png" alt="QuickRent Logo" className="logoo" />
        <h2>QuickRent - Upload Documents</h2>
      </div>

      {/* Upload Form */}
      <div className="contaainer">
        <h2>
          <i className="fas fa-upload"></i> Required Documents
        </h2>
        <p className="upload-info">
          Please upload all required documents. Only PDF and image files (JPG, JPEG, PNG) are allowed with maximum size of 5MB.
        </p>
        
        <div className="form-card">
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="idProof">
                <i className="fas fa-id-card"></i> Owner ID Proof *
              </label>
              <input 
                type="file" 
                id="idProof" 
                accept=".pdf,.jpg,.jpeg,.png"
                onChange={handleFileChange("idProof")}
                required
              />
              <small>Upload Aadhar Card, PAN Card, or Passport</small>
              {files.idProof && (
                <button type="button" className="file-view-btn" onClick={() => openLocalPreview(files.idProof)}>
                  <i className="fas fa-eye"></i> View Selected
                </button>
              )}
            </div>

            <div className="form-group">
              <label htmlFor="license">
                <i className="fas fa-car"></i> Driving License *
              </label>
              <input 
                type="file" 
                id="license" 
                accept=".pdf,.jpg,.jpeg,.png"
                onChange={handleFileChange("license")}
                required
              />
              <small>Upload your valid driving license</small>
              {files.license && (
                <button type="button" className="file-view-btn" onClick={() => openLocalPreview(files.license)}>
                  <i className="fas fa-eye"></i> View Selected
                </button>
              )}
            </div>

            <div className="form-group">
              <label htmlFor="rc">
                <i className="fas fa-file-alt"></i> Vehicle RC *
              </label>
              <input 
                type="file" 
                id="rc" 
                accept=".pdf,.jpg,.jpeg,.png"
                onChange={handleFileChange("rc")}
                required
              />
              <small>Upload vehicle registration certificate</small>
              {files.rc && (
                <button type="button" className="file-view-btn" onClick={() => openLocalPreview(files.rc)}>
                  <i className="fas fa-eye"></i> View Selected
                </button>
              )}
            </div>

            <div className="form-group">
              <label htmlFor="insurance">
                <i className="fas fa-shield-alt"></i> Insurance Document *
              </label>
              <input 
                type="file" 
                id="insurance" 
                accept=".pdf,.jpg,.jpeg,.png"
                onChange={handleFileChange("insurance")}
                required
              />
              <small>Upload vehicle insurance certificate</small>
              {files.insurance && (
                <button type="button" className="file-view-btn" onClick={() => openLocalPreview(files.insurance)}>
                  <i className="fas fa-eye"></i> View Selected
                </button>
              )}
            </div>

            <div className="form-group">
              <label htmlFor="pollution">
                <i className="fas fa-leaf"></i> Pollution Certificate
              </label>
              <input 
                type="file" 
                id="pollution" 
                accept=".pdf,.jpg,.jpeg,.png"
                onChange={handleFileChange("pollution")}
              />
              <small>Upload pollution under control certificate (optional)</small>
              {files.pollution && (
                <button type="button" className="file-view-btn" onClick={() => openLocalPreview(files.pollution)}>
                  <i className="fas fa-eye"></i> View Selected
                </button>
              )}
            </div>
            <br></br>
            <div className="form-actions">
        
              <button 
                type="submit" 
                className="submit-btn"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <i className="fas fa-spinner fa-spin"></i> Uploading...
                  </>
                ) : (
                  <>
                  <i className="fas fa-upload"></i> Submit All Documents
                  </>
                )}
              </button>
            </div>
          </form>
        </div>

        {message && (
          <div className={`message ${message.includes('❌') ? 'error' : 'success'}`}>
            {message}
          </div>
        )}
      </div>

      {/* File Upload Popup */}
      {showPopup && selectedFile && (
        <div className="popup-overlay" onClick={closePopup}>
          <div className="popup-content" onClick={(e) => e.stopPropagation()}>
            <div className="popup-header">
              <h3><i className="fas fa-file-upload"></i> {selectedFile.name}</h3>
              <button className="popup-close" onClick={closePopup}>
                <i className="fas fa-times"></i>
              </button>
            </div>
            <div className="popup-body">
              {selectedFile.files ? (
                // Show uploaded files with links
                <div className="uploaded-files">
                  <p className="success-message">{selectedFile.message}</p>
                  <div className="files-list">
                    {Object.entries(selectedFile.files).map(([field, filename]) => (
                      <div key={field} className="file-item">
                        <div className="file-icon">
                          <i className="fas fa-file"></i>
                        </div>
                        <div className="file-info">
                          <h4>{field.charAt(0).toUpperCase() + field.slice(1)} Document</h4>
                          <p>File: {filename}</p>
                          <a 
                            href={`http://localhost:4000/uploads/${filename}`} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="file-link"
                          >
                            <i className="fas fa-eye"></i> View Document
                          </a>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                // Show single file info
                <div className="file-info">
                  <div className="file-icon">
                    <i className={`fas ${selectedFile.type === 'application/pdf' ? 'fa-file-pdf' : 'fa-file-image'}`}></i>
                  </div>
                  <div className="file-details">
                    <h4>{selectedFile.name}</h4>
                    <p>Size: {selectedFile.size} MB</p>
                    <p>Type: {selectedFile.type}</p>
                    <p>Field: {selectedFile.field}</p>
                  </div>
                </div>
              )}
            </div>
            <div className="popup-footer">
              <button className="btn-primary" onClick={closePopup}>
                <i className="fas fa-check"></i> OK
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
