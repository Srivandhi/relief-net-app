
import  { useState } from 'react';
import axios from 'axios';
import './ReportIncidentModel.css';


export const ReportIncidentModel = ({ show, onClose }) => {
  const [incidentType, setIncidentType] = useState('Flooding'); 
  const [description, setDescription] = useState('');
  const [message, setMessage] = useState(''); 

  const handleSubmit = async (e) => {
    e.preventDefault(); 
    setMessage('Submitting...');

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;

        const incidentData = {
          incidentType,
          description,
          latitude,
          longitude,
        };

        try {
          const response = await axios.post('http://localhost:3000/api/incidents', incidentData);
          setMessage('✅ Report submitted successfully!');
          
         
          setTimeout(() => {
            onClose(); 
            setMessage(''); 
            setDescription(''); 
          }, 2000);

        } catch (error) {
          console.error('Error submitting incident:', error);
          setMessage(`❌ Error: ${error.response?.data?.message || 'Could not submit report.'}`);
        }
      },
      (error) => {
        console.error("Error getting location:", error);
        setMessage('❌ Error: Please enable location access to submit a report.');
      }
    );
  };

  if (!show) {
    return null;
  }

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>Report a New Incident</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="incidentType">Type of Incident</label>
            <select
              id="incidentType"
              value={incidentType}
              onChange={(e) => setIncidentType(e.target.value)}
              required
            >
              <option value="Flooding">Flooding</option>
              <option value="Fire">Fire</option>
              <option value="Road Blockage">Road Blockage</option>
              <option value="Structural Damage">Structural Damage</option>
              <option value="Earthquake">Earthquake</option>
              <option value="Landslide">Landslide</option>
              <option value="Cyclone">Cyclone</option>
              <option value="Accident">Accident</option>
              <option value="Other">Other</option>
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="description">Description</label>
            <textarea
              id="description"
              rows="4"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Provide a brief description of the situation..."
            ></textarea>
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

