import PropTypes from "prop-types";
import "./PostBottom.css";
import React, {useState, useEffect} from 'react';

const PostBottom = ({ className = "" }) => {
  const [isLiked, setIsLiked] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [postText, setPostText] = useState('');
  const [musicInfo, setMusicInfo] = useState(null);

  useEffect(() => {
    const sharedText = localStorage.getItem('sharedText') || '';
    setPostText(sharedText);
  }, []);

  useEffect(() => {
    const savedMusic = localStorage.getItem('musicInfo');
    if (savedMusic) setMusicInfo(JSON.parse(savedMusic));
  }, []);

  const handleClickLike = () => {
    setIsLiked(!isLiked);
  };

  const handleClickSave = () => {
    setIsSaved(!isSaved);
  };

  return (
    <section className={`post-bottom ${className}`}>
      <div className="post-bottom1">
        <div className="rectangle2" />
        <div className="interaction-area">
          <div className="like-save-area">
            <div className="action-buttons">
              <div className="like-button">
                <img
                  className="image-icon2"
                  loading="lazy"
                  alt=""
                  src="/image-1@2x.png"
                />
                {/* <img
                  className="like-icon"
                  loading="lazy"
                  alt=""
                  src="/like@2x.png"
                /> */}
               <img
                  className={`like-icon ${isLiked ? 'active' : ''}`}
                  loading="lazy"
                  alt=""
                  src="/like@2x.png"
                  onClick={handleClickLike}
                />
              </div>
              <div className="comment-pagination-parent">
                <div className="comment-pagination">
                  <div className="comment-pagination-actions">
                    <div className="pagination-buttons">
                      <img
                        className="comment-icon"
                        loading="lazy"
                        alt=""
                        src="/comment@2x.png"
                      />
                      <img
                        className="messanger-icon"
                        loading="lazy"
                        alt=""
                        src="/messanger@2x.png"
                      />
                    </div>
                    <div className="pagination-area">
                     
                    </div>
                  </div>
                </div>
                <div className="liked-by-craig-love-container">
                  <span className="prometheusai">prometheus.ai</span>
                  <span>{`님 외 `}</span>
                  <span className="prometheusai">여러 명이 좋아합니다</span>
                </div>
              </div>
            </div>
            
            <img
              className={`save-icon ${isSaved ? 'active' : ''}`}
              loading="lazy"
              alt=""
              src="/save@2x.png"
              onClick={handleClickSave}
            />
          </div>
          <div className="caption">
            <div className="joshua-l-the-game-container">
              <span className="prometheusai">promi123</span>
              <span>
                {" "}
                {postText}
              </span>
            </div>
          </div>
        </div>
        <div className="timestamp">
          <div className="september-19">10월 1일</div>       {/* created_at*/}
        </div>
      </div>
      <img
        className="tab-bar-icon1"
        loading="lazy"
        alt=""
        src="/tab-bar@2x.png"
      />
      <div className="bars-home-indicator5">
        <footer className="background9" />
        <div className="line5" />
      </div>
      {musicInfo && (
        <div className="music-info-bottom">
          <span className="prometheusai">🎵 {musicInfo.bgm_name}</span>
          <span> - {musicInfo.artist}</span>
        </div>
      )}
    </section>
  );
};

PostBottom.propTypes = {
  className: PropTypes.string,
};

export default PostBottom;
