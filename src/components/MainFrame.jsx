import React, { useState, useEffect } from 'react';
import PropTypes from "prop-types";
import PostTop from "../components/PostTop";
import { useNavigate } from "react-router-dom";

import "./FrameComponent3.css";

const MainFrame = ({ className = "" }) => {
  const navigate = useNavigate();
  const [musicInfo, setMusicInfo] = useState(null);

  useEffect(() => {
    const savedMusic = localStorage.getItem('musicInfo');
    if (savedMusic) setMusicInfo(JSON.parse(savedMusic));
  }, []);

  return (
    <div className={`bars-status-bar-iphone-x-parent ${className}`}>
      <header className="bars-status-bar-iphone-x1">
        <div className="background5" />
        <div className="div19">9:41</div>
        <div className="signal-icons-wrapper">
          <div className="signal-icons">
            <img
              className="mobile-signal-icon1"
              loading="lazy"
              alt=""
              src="/mobile-signal.svg"
            />
            <img className="wifi-icon1" loading="lazy" alt="" src="/wifi.svg" />
            <img
              className="battery-icon1"
              loading="lazy"
              alt=""
              src="/battery.svg"
            />
          </div>
        </div>
      </header>
      <div className="frame-container">
        <div className="frame-group">
          <div className="back-wrapper">
            <img 
              className="back-icon" 
              loading="lazy" 
              alt="" 
              src="/back.svg" 
              onClick={() => navigate('/')}
              style={{ cursor: 'pointer' }}
            />
          </div>
        </div>
      </div>
      <PostTop />
    </div>
  );
};

MainFrame.propTypes = {
  className: PropTypes.string,
};

export default MainFrame;
