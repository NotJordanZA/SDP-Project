import React from "react";
import "../styles/mainIcon.css";

export default function MainIcon({ iconClass, text, onClickFunction}) {
    return (
        <div className="main-icon" onClick={onClickFunction}>
            <i className={iconClass}></i>
            <p className="icon-text">{text}</p>
        </div>
    );
}
