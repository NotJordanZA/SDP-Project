import React, { useState, useEffect } from 'react';
import '../styles/ManageReports.css'; 

const API_URL = process.env.NODE_ENV === 'production' ? 'https://your-production-site.com' : 'http://localhost:3001'; 

// Fetch all the reports
export const getAllReports = async () => {
  const response = await fetch(`${API_URL}/Reports`);
  return await response.json();
};

// Update a report
export const updateRep = async (id, RepData) => {
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

function Reports() {
  const [reports, setReports] = useState([]); 
  const [activeTab, setActiveTab] = useState('Pending');
  const [editingLogId, setEditingLogId] = useState(null); 
  const [newResolutionLog, setNewResolutionLog] = useState(''); 
  const [selectedType, setSelectedType] = useState(''); // For filtering by report type
  const [searchText, setSearchText] = useState(''); // For searching by email or venue
  const [errorMessage, setErrorMessage] = useState(''); // Error message

  // Fetch all reports on component mount
  useEffect(() => {
    const fetchAllReports = async () => {
      try {
        const response = await getAllReports();
        console.log('Fetched Reports:', response);  // Log all fetched reports
        setReports(response); // Directly set the reports from API
      } catch (error) {
        console.error("Error fetching all reports:", error);
        setReports([]); 
        setErrorMessage("Failed to fetch reports");
      }
    };
  
    fetchAllReports();
  }, []);

  const handleResolveClick = async (reportId) => {
    const updatedReports = reports.map(report =>
      report.id === reportId ? { ...report, reportStatus: "Resolved" } : report
    );
    setReports(updatedReports);

    try {
      await updateRep(reportId, { reportStatus: "Resolved" });
    } catch (error) {
      console.error("Error updating report status:", error);
    }
  };

  const handleInProgressClick = async (reportId) => {
    const updatedReports = reports.map(report =>
      report.id === reportId ? { ...report, reportStatus: "In Progress" } : report
    );
    setReports(updatedReports);

    try {
      await updateRep(reportId, { reportStatus: "In Progress" });
    } catch (error) {
      console.error("Error updating report status:", error);
    }
  };

  // Edit resolution log
  const handleEditLogClick = (reportId, currentLog) => {
    setEditingLogId(reportId);
    setNewResolutionLog(currentLog || ''); 
  };

  // Save updated resolution log
  const handleSaveLogClick = async (reportId) => {
    const updatedReports = reports.map(report =>
      report.id === reportId ? { ...report, resolutionLog: newResolutionLog } : report
    );
    setReports(updatedReports);
    setEditingLogId(null); 

    try {
      await updateRep(reportId, { resolutionLog: newResolutionLog });
    } catch (error) {
      console.error("Error updating resolution log:", error);
    }
  };

  // Handle tab change and reset filters and search
  const handleTabChange = (tab) => {
    setActiveTab(tab);
    setSelectedType('');  // Reset report type filter
    setSearchText('');    // Reset search text
  };

  // Filter the reports by the selected report type, search term, and the active tab
  const filteredReports = reports.filter(report => 
    report.reportStatus.toLowerCase() === activeTab.toLowerCase() && 
    (selectedType === '' || report.reportType === selectedType) &&
    (report.createdBy.toLowerCase().includes(searchText.toLowerCase()) || 
     report.venueID.toLowerCase().includes(searchText.toLowerCase()))
  );

  return (
    <div className="reports-container">
      <h1>Reports Management</h1>

      {/* Error messages */}
      {errorMessage && <div className="error-message">{errorMessage}</div>}

      {/* Tabs */}
      <div className="tabs">
        <button
          className={activeTab.toLowerCase() === 'pending' ? 'active' : ''}
          onClick={() => handleTabChange('Pending')}
        >
          Pending Reports
        </button>
        <button
          className={activeTab.toLowerCase() === 'in progress' ? 'active' : ''}
          onClick={() => handleTabChange('In Progress')}
        >
          In Progress Reports
        </button>
        <button
          className={activeTab.toLowerCase() === 'resolved' ? 'active' : ''}
          onClick={() => handleTabChange('Resolved')}
        >
          Resolved Reports
        </button>
      </div>

      {/* Dropdown filter for report type */}
      <div className="report-type-container">
        <label htmlFor="reportType">Filter by Report Type:</label>
        <select
          id="reportType"
          value={selectedType}
          onChange={(e) => setSelectedType(e.target.value)} 
          className="report-type-dropdown"
        >
          <option value="">All Types</option>
          <option value="Equipment">Equipment</option>
          <option value="Safety">Safety</option>
          <option value="Incorrect Venue Details">Incorrect Venue Details</option>
          <option value="Other">Other</option>
        </select>
      </div>

      {/* Search by email or venue */}
      <div className="searchReport-container">
        <label htmlFor="searchInput">Search by Email or Venue:</label>
        <input
          type="text"
          id="searchInput"
          placeholder="Search by email or venue"
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)} 
        />
      </div>

      {/* Report List */}
      {filteredReports.length > 0 ? (
        <div className="reports-list">
          {filteredReports.map(report => (
            <div key={report.id} className={`report-card ${report.reportStatus}`}>
              <h3>{report.reportText}</h3>
              <p><strong>Venue:</strong> {report.venueID}</p>
              <p><strong>Type:</strong> {report.reportType}</p>
              <p><strong>Status:</strong> {report.reportStatus}</p>
              <p><strong>Email:</strong> {report.createdBy}</p>

              {/* Edit resolution log */}
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
                  <p><strong>Resolution Log:</strong> {report.resolutionLog || "_____"}</p>
                  {report.reportStatus !== "Resolved" && (
                    <>
                      <button className="edit-log-btn" onClick={() => handleEditLogClick(report.id, report.resolutionLog)}>
                        Edit Resolution Log
                      </button>

                      {/* Conditionally render buttons based on report status */}
                      {report.reportStatus === "pending" && (
                        <button className="progress-btn" onClick={() => handleInProgressClick(report.id)}>
                         In Progress
                        </button>
                      )}

                      {report.reportStatus === "In Progress" && (
                        <button className="resolve-btn" onClick={() => handleResolveClick(report.id)}>
                          Resolved
                        </button>
                      )}
                    </>
                  )}
                </>
              )}
            </div>
          ))}
        </div>
      ) : (
        <p>No {activeTab} reports available for this type</p>
      )}
    </div>
  );
}

export default Reports;
