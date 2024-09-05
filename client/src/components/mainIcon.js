import React from "react";
import "../styles/mainIcon.css";

export default function MainIcon({ iconClass, text }) {
    return (
        <a>
            <nav className="main-icon">
                <i className={iconClass}></i>
                <p className="icon-text">{text}</p>
            </nav>
        </a>
    );
}
