// client/src/components/ReportResourceModel.jsx - UPDATED WITH GEOLOCATION

import { useState } from 'react';
import axios from 'axios';
import './ReportResourceModel.css'; // You can reuse the CSS

export const ReportResourceModel = ({ show, onClose }) => {
  // --- We no longer need state for latitude and longitude ---
  const [resourceType, setResourceType] = useState('Shelter');
  const [description, setDescription] = useState('');
  const [contact, setContact] = useState('');
  const [message, setMessage] = useState('');

  // This API call does not need authentication headers, as it's a public contribution
  // We'll need a new, public endpoint for this.

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('Getting your location and submitting...');

    // 1. Get the user's current location from the browser's Geolocation API
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        // If getting location is successful:
        const { latitude, longitude } = position.coords;

        // 2. Structure the data payload
        const resourceData = {
          resourceType,
          description,
          contact,
          // We now have the coordinates to send
          latitude: latitude,
          longitude: longitude,
        };

        try {
          // 3. Send the data to a NEW PUBLIC backend endpoint
          // IMPORTANT: This should be a public, unauthenticated route
          await axios.post('https://relief-net-api.onrender.com/api/resources', resourceData);
          
          setMessage('✅ Resource reported successfully! It will be reviewed by an admin.');
          
          setTimeout(() => {
            onClose();
            setMessage('');
          }, 2500);

        } catch (error) {
          console.error('Error submitting resource:', error);
          setMessage(`❌ Error: ${error.response?.data?.message || 'Could not submit report.'}`);
        }
      },
      (error) => {
        // If getting location fails (e.g., user denies permission)
        console.error("Geolocation error:", error);
        setMessage('❌ Error: Please enable location access to report a resource.');
      }
    );
  };

  if (!show) {
    return null;
  }

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>Report a New Resource</h2>
        <p className="modal-subtitle">Help others by reporting available resources near you.</p>
        <form onSubmit={handleSubmit}>
          {/* ... Resource Type, Description, Contact fields remain the same ... */}
          <div className="form-group">
            <label htmlFor="resourceType">Type of Resource</label>
            <select id="resourceType" value={resourceType} onChange={(e) => setResourceType(e.target.value)} required>
              <option value="Shelter">Shelter</option>
              <option value="Medical Aid">Medical Aid</option>
              <option value="Food">Food</option>
              <option value="Ambulance">Ambulance</option>
              <option value="Other">Other</option>
            </select>
          </div>
          
          <div className="form-group">
            <label htmlFor="description">Description</label>
            <textarea id="description" value={description} onChange={(e) => setDescription(e.target.value)} required placeholder="e.g., 'Water bottles available at the community center'"/>
          </div>

          <div className="form-group">
            <label htmlFor="contact">Contact Info (Optional)</label>
            <input type="text" id="contact" value={contact} onChange={(e) => setContact(e.target.value)} />
          </div>
          <div className="modal-actions">
            <button type="button" className="btn-secondary" onClick={onClose}>Cancel</button>
            <button type="submit" className="btn-primary">Submit Report</button>
          </div>
        </form>
        {message && <p className="submission-message">{message}</p>}
      </div>
    </div>
  );
};