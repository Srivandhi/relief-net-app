
import './ReportResourceButton.css'; 
export const   ReportResourceButton = ({ onClick }) => {
  return (
    <button className="report-button-resource" onClick={onClick}>
      Add a Resource
    </button>
  );
};

