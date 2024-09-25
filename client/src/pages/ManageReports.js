import React, { useState, useEffect } from 'react';
import { auth } from "../firebase";
import { useNavigate } from "react-router-dom";
import { onAuthStateChanged } from "firebase/auth";
import { fetchAllReports } from '../utils/AdminfetchAllReports';
import '../styles/ManageReports.css';

// Fetch all the reports
export const getAllReports = async () => {
  const response = await fetch(`/api/reports`);
  return await response.json();
};

// Update report and create notification logic
export const updateRep = async (id, RepData) => {
  try {
    const response = await fetch(`/api/reports/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(RepData),
    });

    if (!response.ok) {
      throw new Error("Failed to update report");
    }

    const updatedReport = await response.json();

    const reportText = RepData.reportText || updatedReport.reportText;
    const recipientEmail = RepData.recipientEmail || updatedReport.recipientEmail;

    if (!reportText || !recipientEmail) {
      throw new Error("Missing reportText or recipientEmail");
    }

    const notificationMessage = `Your report status has been changed to ${RepData.reportStatus === 'Resolved' ? 'Resolved' : 'In Progress'}. Report Details: ${reportText}`;
    const notificationData = {
      dateCreated: new Date().toISOString(),
      notificationMessage,
      notificationType: "Report Update",
      read: false,
      recipientEmail,
    };

    const notificationResponse = await fetch(`/api/notifications`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(notificationData),
    });

    if (!notificationResponse.ok) {
      throw new Error("Failed to create notification");
    }

    return updatedReport;
  } catch (error) {
    console.error("Error in updateRep:", error);
    throw error;
  }
};
function Reports() {
  const [, setUser] = useState(null);  // Only keep setUser, ignoring the user variable
  const [reports, setReports] = useState([]);
  const [activeTab, setActiveTab] = useState('Pending');
  const [editingLogId, setEditingLogId] = useState(null);
  const [newResolutionLog, setNewResolutionLog] = useState('');
  const [selectedType, setSelectedType] = useState('');
  const [searchText, setSearchText] = useState('');
  const [selectedImage, setSelectedImage] = useState(null); // For modal image display
  const navigate = useNavigate();

  // Ensure User is logged in
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      if (firebaseUser) {
        setUser(firebaseUser);  // Set the user here to manage authentication
      } else {
        navigate("/login");
      }
    });
    return () => {
      if (unsubscribe) {
        unsubscribe();
      }
    };
  }, [navigate]);  // No need for setUser in the dependency array
  
  // Fetch all reports on component mount
  useEffect(() => {
    fetchAllReports(setReports, getAllReports);
  }, []);// Add setUser to the dependency array




  // Image click handler to show enlarged image in a modal
  const handleImageClick = (imageUrl) => {
    setSelectedImage(imageUrl);
  };

  // Close modal
  const closeImageModal = () => {
    setSelectedImage(null);
  };

  const handleResolveClick = async (reportId) => {
    const updatedReports = reports.map(report =>
      report.id === reportId ? { ...report, reportStatus: "Resolved" } : report
    );
    setReports(updatedReports);

    const report = reports.find(report => report.id === reportId);
    if (!report) return;

    try {
      await updateRep(reportId, {
        reportStatus: "Resolved",
        reportText: report.reportText,
        recipientEmail: report.createdBy,
      });
    } catch (error) {
      console.error("Error updating report status:", error);
    }
  };

  const handleInProgressClick = async (reportId) => {
    console.log(`In Progress clicked for report: ${reportId}`);
    const updatedReports = reports.map(report =>
      report.id === reportId ? { ...report, reportStatus: "In Progress" } : report
    );
    setReports(updatedReports);

    const report = reports.find(report => report.id === reportId);
    if (!report) return;

    try {
      await updateRep(reportId, {
        reportStatus: "In Progress",
        reportText: report.reportText,
        recipientEmail: report.createdBy,
      });
    } catch (error) {
      console.error("Error updating report status:", error);
    }
  };

  const handleEditLogClick = (reportId, currentLog) => {
    setEditingLogId(reportId);
    setNewResolutionLog(currentLog || '');
  };

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

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    setSelectedType('');
    setSearchText('');
  };

  const filteredReports = reports.filter(report =>
    report.reportStatus.toLowerCase() === activeTab.toLowerCase() &&
    (selectedType === '' || report.reportType === selectedType) &&
    (report.createdBy.toLowerCase().includes(searchText.toLowerCase()) ||
      report.venueID.toLowerCase().includes(searchText.toLowerCase()))
  );

  return (
    <div className="reports-container">
      <h1>Reports Management</h1>

      {/* Tabs */}
      <div className="tabs">
        <button className={activeTab.toLowerCase() === 'pending' ? 'active' : ''} onClick={() => handleTabChange('Pending')}>
          Pending Reports
        </button>
        <button className={activeTab.toLowerCase() === 'in progress' ? 'active' : ''} onClick={() => handleTabChange('In Progress')}>
          In Progress Reports
        </button>
        <button className={activeTab.toLowerCase() === 'resolved' ? 'active' : ''} onClick={() => handleTabChange('Resolved')}>
          Resolved Reports
        </button>
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

              {/* Display report photos */}
              {Array.isArray(report.photos) && report.photos.length > 0 && (
                <div className="photos-container">
                  {report.photos.map((photoUrl, index) => (
                    <img
                      key={index}
                      src={photoUrl}
                      alt={`Report ${index + 1}`}
                      className="report-photo"
                      style={{ width: '100px', height: '100px', cursor: 'pointer', margin: '5px' }}
                      onClick={() => handleImageClick(photoUrl)} // Click to enlarge
                    />
                  ))}
                </div>
              )}

              {/* Edit resolution log */}
              {editingLogId === report.id ? (
                <>
                  <textarea
                    value={newResolutionLog}
                    onChange={(e) => setNewResolutionLog(e.target.value)}
                  />
                  <button onClick={() => handleSaveLogClick(report.id)}>Save</button>
                  <button onClick={() => setEditingLogId(null)}>Cancel</button>
                </>
              ) : (
                <>
                  <p><strong>Resolution Log:</strong> {report.resolutionLog || "_____"}</p>
                  {report.reportStatus !== "Resolved" && (
                    <>
                      <button className="edit-log-btn" onClick={() => handleEditLogClick(report.id, report.resolutionLog)}>
                        Edit Resolution Log
                      </button>
                      {report.reportStatus === "pending" && (
                        <button className="progress-btn" onClick={() => handleInProgressClick(report.id)}>In Progress</button>
                      )}
                      {report.reportStatus === "In Progress" && (
                        <button className="resolve-btn" onClick={() => handleResolveClick(report.id)}>Resolved</button>
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

      {/* Image Modal */}
      {selectedImage && (
        <div className="image-modal" onClick={closeImageModal}>
          <div className="image-modal-content">
            <span className="close-button" onClick={closeImageModal}>X</span>
            <img src={selectedImage} alt="Enlarged" className="large-image" />
          </div>
        </div>
      )}
    </div>
  );
}

export default Reports;
