import PropTypes from "prop-types";
import { useState, useEffect, useRef } from "react";
import "./PostTop.css";

const PostTop = ({ className = "" }) => {
  const [accessToken, setAccessToken] = useState(null);
  const [musicInfo, setMusicInfo] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [deviceId, setDeviceId] = useState(null);

  useEffect(() => {
    const savedMusic = localStorage.getItem('musicInfo');
    if (savedMusic) {
      const parsedMusic = JSON.parse(savedMusic);
      setMusicInfo(parsedMusic);
    }

    // 플레이어 상태 구독
    const handleStateChange = (state) => {
      setIsPlaying(!state?.paused);
    };

    if (window.spotifyPlayer) {
      window.spotifyPlayer.addListener('player_state_changed', handleStateChange);
    }

    // 백엔드에서 Access Token 요청
    const fetchAccessToken = async () => {
      try {
        const response = await fetch('http://192.168.1.3:3002/api/get-access-token');
        const data = await response.json();
        setAccessToken(data.access_token);
        console.log('Access Token:', data.access_token);
        localStorage.setItem('spotify_access_token', data.access_token);
        setDeviceId(localStorage.getItem('spotify_device_id'));
      } catch (error) {
        console.error('Error fetching access token:', error);
      }
    };

    fetchAccessToken();

    return () => {
      if (window.spotifyPlayer) {
        window.spotifyPlayer.removeListener('player_state_changed', handleStateChange);
      }
    };
  }, []);

  const handleMusicClick = () => {
    if (musicInfo && musicInfo.track_id) {
      const spotifyTrackUrl = `https://open.spotify.com/track/${musicInfo.track_id}`;
      window.open(spotifyTrackUrl, '_blank');
    }
  };

  const playMusic = (trackId) => {
  };

  return (
    <div className={`post-top ${className}`}>
      <div className="rectangle1" />
      <div className="post-header">
        <img
          className="image-icon1" 
          loading="lazy"
          alt=""
          src="/image1@2x.png"
        />
        <div className="profile-info">
          <a className="name1">promi123</a>
          {musicInfo && (
            <div className="music-info">
              <div className="music-icon-area">
                <img 
                  className="icon5" 
                  loading="lazy" 
                  alt="" 
                  src="/play-icon.svg"
                /> 
              </div>
              <div 
                className="music3"
                onClick={handleMusicClick}
                style={{ 
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px'
                }}
              >
                {musicInfo?.album_cover && (
                  <img 
                    src={musicInfo.album_cover} 
                    alt="Album Cover" 
                    style={{ 
                      width: '40px', 
                      height: '40px', 
                      borderRadius: '4px' 
                    }}
                  />
                )}
                <div>
                  <div style={{ fontWeight: 500 }}>{musicInfo?.bgm_name}</div>
                  <div style={{ fontSize: '0.8em', color: '#666' }}>
                    {musicInfo?.artist}
                  </div>
                </div>
                <div style={{ marginLeft: 'auto' }}>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
      <div className="more-icon-area">
        <img
          className="more-icon"
          loading="lazy"
          alt=""
          src="/more-icon@2x.png"
        />
      </div>
    </div>
  );
};

PostTop.propTypes = {
  className: PropTypes.string,
};

export default PostTop;
