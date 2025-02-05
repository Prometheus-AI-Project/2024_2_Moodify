import PropTypes from "prop-types";
import "./FrameComponent4.css";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

const FrameComponent4 = ({ className = "" }) => {
  const [selectedTrackId, setSelectedTrackId] = useState(null);
  const navigate = useNavigate();

  const handleShare = () => {
    const mediaFiles = JSON.parse(localStorage.getItem('uploadedMedia') || '[]');
    const postText = document.querySelector('.div1')?.value || '';
    const deviceId = localStorage.getItem('spotify_device_id'); // device_id 가져오기
    
    localStorage.setItem('sharedMedia', JSON.stringify(mediaFiles));
    localStorage.setItem('sharedText', postText);
    
    // device_id와 함께 navigate 호출
    navigate(`/result?device_id=${deviceId}&track_id=${selectedTrackId}`);
  };

  return (
    <div className={`frame-parent1 ${className}`}>
      <div className="button-wrapper">
        <div 
          className="button2" 
          onClick={handleShare}
          style={{ cursor: 'pointer' }}
        >
          <div className="share-background" />
          <div className="div22">공유</div>
        </div>
      </div>
      <div className="bars-home-indicator4">
        <footer className="background6" />
        <div className="line4" />
      </div>
    </div>
  );
};

FrameComponent4.propTypes = {
  className: PropTypes.string,
};

export default FrameComponent4;
