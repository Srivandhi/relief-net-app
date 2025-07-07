
import './ReportIncident.css'; 
export const   ReportIncident = ({ onClick }) => {
  return (
    <button className="report-button" onClick={onClick}>
      Report an Incident
    </button>
  );
};

