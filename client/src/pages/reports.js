import React, { useState } from 'react';
import '../styles/reports.css';
import PopupForm from '../components/PopupForm';
const Reports = () => {
    const [isPopupOpen, setIsPopupOpen] = useState(false);

    const togglePopup = () => {
        setIsPopupOpen(!isPopupOpen);
    };

    // Mock data for My Reports
    const mockReports = [
        { id: 1, title: 'Report 1', date: '2024-08-01' },
        { id: 2, title: 'Report 2', date: '2024-08-05' },
        { id: 3, title: 'Report 3', date: '2024-08-10' },
        { id: 4, title: 'Report 4', date: '2024-08-15' },
        { id: 5, title: 'Report 5', date: '2024-08-20' }
    ];

    return (
        <section className="report-page">
            <button onClick={togglePopup} className="open-popup-button">Submit a Report</button>
            <PopupForm isOpen={isPopupOpen} onClose={togglePopup} />
            
            <div className="report-list">
                <h2>My Reports</h2>
                <ul>
                    {mockReports.map(report => (
                        <li key={report.id}>
                            <span className="report-title">{report.title}</span>
                            <span className="report-date">{report.date}</span>
                        </li>
                    ))}
                </ul>
            </div>
        </section>
    );
};

export default Reports;
