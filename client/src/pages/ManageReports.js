import React, { useState, useEffect } from 'react';
import './ManageReports.css'; 
const API_URL = process.env.NODE_ENV === 'production' ? 'https://your-production-site.com' : 'http://localhost:3002'; 


export const getAllReports = async () => {
  const response = await fetch(`${API_URL}/Reports`);
  return await response.json();
};
export const updateRep= async (id, RepData) => {
  const response = await fetch(`${API_URL}/Reports/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(RepData),
  });


 if (!response.ok) {
    throw new Error('Failed to update report');
  }
  return response.json();

};

export const getReportByType = async (reportType) => {
  const response = await fetch(`${API_URL}/Reports/type/${reportType}`);
  return await response.json();
};


function Reports() {
  const [reports, setReports] = useState([]);
  const [allReports, setAllReports] = useState([]); 
  const [activeTab, setActiveTab] = useState('Pending');
  const [selectedReportType, setSelectedReportType] = useState(''); // Store selected report type
  const [editingLogId, setEditingLogId] = useState(null); // Track which report's resolution log is being edited
  const [newResolutionLog, setNewResolutionLog] = useState(''); // Track the new resolution log

  // Fetch all reports initially
  useEffect(() => {
    const fetchAllReports = async () => {
      try {
        const response = await getAllReports();
        console.log("API Response:", response); 
        const reportData = Array.isArray(response.rep) ? response.rep : [];
        setReports(reportData);
        setAllReports(reportData); 
      } catch (error) {
        console.error("Error fetching all reports:", error);
        setReports([]); // Set to an empty array in case of an error
      }
    };

    fetchAllReports();
  }, []);

  // Fetch reports by selected report type
  useEffect(() => {
    const fetchReportsByType = async () => {
      if (selectedReportType === "") {
        setReports(allReports); // If no type is selected, reset to all reports
      } else {
        try {
          const response = await getReportByType(selectedReportType);
          console.log("API Response:", response); // Log the API response to inspect
          setReports(Array.isArray(response.filteredReports) ? response.filteredReports : []); // Ensure it's an array
        } catch (error) {
          console.error("Error fetching reports by type:", error);
          setReports([]); // Set to an empty array in case of an error
        }
      }
    };

    fetchReportsByType();
  }, [selectedReportType, allReports]); // Re-fetch reports every time the selected report type changes

  // Handle marking the report as resolved with optimistic UI update
  const handleResolveClick = async (reportId) => {
    // Optimistic UI update
    const updatedReports = reports.map(report =>
      report.id === reportId ? { ...report, reportStatus: "Resolved" } : report
    );
    setReports(updatedReports);

    
    try {
      await updateRep(reportId, { reportStatus: "Resolved" });
      console.log(`Report ${reportId} marked as Resolved`);
    } catch (error) {
      console.error("Error updating report status:", error);
    }
  };

  // Handle marking the report as 'In Progress'
  const handleInProgressClick = async (reportId) => {
    // Optimistic UI update
    const updatedReports = reports.map(report =>
      report.id === reportId ? { ...report, reportStatus: "In Progress" } : report
    );
    setReports(updatedReports);

    
    try {
      await updateRep(reportId, { reportStatus: "In Progress" });
      console.log(`Report ${reportId} marked as In Progress`);
    } catch (error) {
      console.error("Error updating report status:", error);
    }
  };

  // Start editing the resolution log
  const handleEditLogClick = (reportId, currentLog) => {
    setEditingLogId(reportId);
    setNewResolutionLog(currentLog || ''); 
  };

  // Save the updated resolution log
  const handleSaveLogClick = async (reportId) => {
    const updatedReports = reports.map(report =>
      report.id === reportId ? { ...report, resolutionLog: newResolutionLog } : report
    );
    setReports(updatedReports);
    setEditingLogId(null); // Exit edit mode

    // API call to save the updated resolution log
    try {
      await updateRep(reportId, { resolutionLog: newResolutionLog });
      console.log(`Resolution log updated for report ${reportId}`);
    } catch (error) {
      console.error("Error updating resolution log:", error);
    }
  };

  return (
    <div className="reports-container">
      <h1>Admin Reports Management</h1>

      {/* Tabs */}
      <div className="tabs">
        <button
          className={activeTab === 'Pending' ? 'active' : ''}
          onClick={() => setActiveTab('Pending')}
        >
          Pending Reports
        </button>
        <button
          className={activeTab === 'In Progress' ? 'active' : ''}
          onClick={() => setActiveTab('In Progress')}
        >
          In Progress Reports
        </button>
        <button
          className={activeTab === 'Resolved' ? 'active' : ''}
          onClick={() => setActiveTab('Resolved')}
        >
          Resolved Reports
        </button>
      </div>

      {/* Report Type Dropdown */}
      <div className="report-type-container">
        <label>Select Report Type:</label>
        <select
          value={selectedReportType}
          onChange={(e) => setSelectedReportType(e.target.value)} // Update selected report type
          className="report-type-dropdown"
        >
          <option value="">-- Select Report Type --</option>
          <option value="Maintenance Issue">Maintenance Issue</option>
          <option value="Equipment Issue">Equipment Issue</option>
          <option value="Health Issue">Health Issue</option>
          <option value="Incorrect Venue Details">Incorrect Venue Details</option>
          <option value="Other">Other</option>
        </select>
      </div>

      {/* Report List */}
      {reports.length > 0 ? (
        <div className="reports-list">
          {reports
            .filter(report => report.reportStatus.toLowerCase() === activeTab.toLowerCase()) // Filter by tab
            .map(report => (
              <div key={report.id} className={`report-card ${report.reportStatus}`}>
                <h3>{report.reportText}</h3>
                <p><strong>Venue:</strong> {report.venueID}</p>
                <p><strong>Type:</strong> {report.reportType}</p>
                <p><strong>Status:</strong> {report.reportStatus}</p>

                {/* Resolution Log Editing */}
                {editingLogId === report.id ? (
                  <>
                    <textarea
                      value={newResolutionLog}
                      onChange={(e) => setNewResolutionLog(e.target.value)}
                    />
                    <button onClick={() => handleSaveLogClick(report.id)}>
                      Save
                    </button>
                    <button onClick={() => setEditingLogId(null)}>
                      Cancel
                    </button>
                  </>
                ) : (
                  <>
                    <p><strong>Resolution Log:</strong> {report.resolutionLog || 'No resolution log available'}</p>
                    <button onClick={() => handleEditLogClick(report.id, report.resolutionLog)}>
                      Edit Resolution Log
                    </button>
                  </>
                )}

                {/* Show buttons depending on report status */}
                {report.reportStatus === "Pending" && (
                  <>
                    <button className="progress-btn" onClick={() => handleInProgressClick(report.id)}>
                      Mark as In Progress
                    </button>
                    <button className="resolve-btn" onClick={() => handleResolveClick(report.id)}>
                      Mark as Resolved
                    </button>
                  </>
                )}

                {report.reportStatus === "In Progress" && (
                  <button className="resolve-btn" onClick={() => handleResolveClick(report.id)}>
                    Mark as Resolved
                  </button>
                )}
              </div>
            ))}
        </div>
      ) : (
        <p>No {activeTab} reports available for "{selectedReportType || "All"}"</p>
      )}
    </div>
  );
}

export default Reports;
