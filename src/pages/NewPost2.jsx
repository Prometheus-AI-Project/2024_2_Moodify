import React, { useState, useEffect } from 'react';  // useEffect 추가
import FrameComponent3 from "../components/FrameComponent3";
import AddMusic from "../components/AddMusic"; 
import Recommendation from "../components/Recommendation";
import FrameComponent4 from "../components/FrameComponent4";
import "./NewPost2.css";
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';

const NewPost2 = () => {
  const [mediaFiles, setMediaFiles] = useState([]);
  const [currentSlide, setCurrentSlide] = useState(1);
  const [postText, setPostText] = useState('');  // 텍스트 상태 추가
  const [analysisResult, setAnalysisResult] = useState(null);
  const [musicInfo, setMusicInfo] = useState(null);

  // Bootstrap 캐러셀 이벤트 리스너 설정
  useEffect(() => {
    const carousel = document.getElementById('picturesCarousel');
    if (carousel) {
      carousel.addEventListener('slid.bs.carousel', (event) => {
        setCurrentSlide(event.to + 1);
      });
    }

    // 컴포넌트 언마운트 시 이벤트 리스너 제거
    return () => {
      if (carousel) {
        carousel.removeEventListener('slid.bs.carousel', () => {});
      }
    };
  }, [mediaFiles]); // mediaFiles가 변경될 때마다 리스너 재설정

  // 감정 분석 결과와 음악 정보를 localStorage에 저장
  useEffect(() => {
    if (analysisResult) {
      localStorage.setItem('analysisResult', JSON.stringify(analysisResult));
    }
    if (musicInfo) {
      localStorage.setItem('musicInfo', JSON.stringify(musicInfo));
    }
    // const storedToken = localStorage.getItem('spotify_access_token');
    // if (!storedToken) {
    //   window.location.href = 'http://192.168.1.3:3002/login';
    // }
  }, [analysisResult, musicInfo]);

  const handleFileUpload = (event) => {
    const files = Array.from(event.target.files);
    const newMediaFiles = files.map(file => ({
      url: URL.createObjectURL(file),
      type: file.type.startsWith('video') ? 'video' : 'image',
      file: file
    }));
    const updatedFiles = [...mediaFiles, ...newMediaFiles];
    setMediaFiles(updatedFiles);
    localStorage.setItem('uploadedMedia', JSON.stringify(updatedFiles));
  };

  const handleDelete = () => {
    if (mediaFiles.length === 1) {
      setMediaFiles([]);
      setCurrentSlide(1);
      localStorage.removeItem('uploadedMedia');
    } else {
      const updatedFiles = mediaFiles.filter((_, index) => index !== currentSlide - 1);
      setMediaFiles(updatedFiles);
      localStorage.setItem('uploadedMedia', JSON.stringify(updatedFiles));
      if (currentSlide > 1) {
        setCurrentSlide(currentSlide - 1);
      }
    }
  };

  const handleEdit = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const newMedia = {
      url: URL.createObjectURL(file),
      type: file.type.startsWith('video') ? 'video' : 'image',
      file: file
    };

    setMediaFiles(prev => {
      const newFiles = [...prev];
      newFiles[currentSlide - 1] = newMedia;
      localStorage.setItem('uploadedMedia', JSON.stringify(newFiles));
      return newFiles;
    });
  };

  const handleSlideChange = (direction) => {
    if (direction === 'prev') {
      setCurrentSlide(prev => Math.max(1, prev - 1));
    } else {
      setCurrentSlide(prev => Math.min(mediaFiles.length, prev + 1));
    }
  };

  // 텍스트 변경 핸들러 수정
  const handleTextChange = (e) => {
    const newText = e.target.value;
    setPostText(newText);
    localStorage.setItem('postText', newText);
  };

  return (
    <div className="new-post1">
      <section className="frame-parent">
        <FrameComponent3 />
        <div className="pictures-wrapper">
          <div className="pictures">
            {mediaFiles.length > 0 ? (
              <>
                <div 
                  id="picturesCarousel" 
                  className="carousel slide" 
                  data-bs-interval="false"
                >
                  <div className="carousel-inner">
                    {mediaFiles.map((media, index) => (
                      <div 
                        key={index}
                        className={`carousel-item ${index === currentSlide - 1 ? 'active' : ''}`}
                      >
                        {media.type === 'video' ? (
                          <video
                            className="pictures-child d-block w-100"
                            controls
                            src={media.url}
                          />
                        ) : (
                          <img
                            className="pictures-child d-block w-100"
                            loading="lazy"
                            alt=""
                            src={media.url}
                          />
                        )}
                      </div>
                    ))}
                  </div>
                  
                  {mediaFiles.length > 1 && (
                    <>
                      <button
                        className="carousel-control-prev"
                        type="button"
                        data-bs-target="#picturesCarousel"
                        data-bs-slide="prev"
                        onClick={() => handleSlideChange('prev')}
                      >
                        <span className="carousel-control-prev-icon" aria-hidden="true"></span>
                        <span className="visually-hidden">Previous</span>
                      </button>
                      <button
                        className="carousel-control-next"
                        type="button"
                        data-bs-target="#picturesCarousel"
                        data-bs-slide="next"
                        onClick={() => handleSlideChange('next')}
                      >
                        <span className="carousel-control-next-icon" aria-hidden="true"></span>
                        <span className="visually-hidden">Next</span>
                      </button>
                    </>
                  )}
                </div>
                
                <div className="media-controls">
                  <div className="carousel-indicators-custom">
                    <span>{currentSlide}/{mediaFiles.length}</span>
                  </div>
                  <div className="media-buttons">
                    <input
                      type="file"
                      accept="image/*,video/*"
                      onChange={handleEdit}
                      id="editMedia"
                      className="file-input"
                    />
                    <label htmlFor="editMedia" className="edit-button">
                      수정
                    </label>
                    <button onClick={handleDelete} className="delete-button">
                      삭제
                    </button>
                    <input
                      type="file"
                      accept="image/*,video/*"
                      multiple
                      onChange={handleFileUpload}
                      id="addMedia"
                      className="file-input"
                    />
                    <label htmlFor="addMedia" className="add-button">
                      추가
                    </label>
                  </div>
                </div>
              </>
            ) : (
              <div className="upload-placeholder">
                <input
                  type="file"
                  accept="image/*,video/*"
                  multiple
                  onChange={handleFileUpload}
                  id="mediaUpload"
                  className="file-input"
                />
                <label htmlFor="mediaUpload" className="upload-label">
                  클릭하여 사진이나 동영상 추가
                </label>
              </div>
            )}
          </div>
        </div>
        <div className="wrapper">
          <textarea 
            className="div1" 
            placeholder="문구를 입력하세요..."
            value={postText}
            onChange={handleTextChange}
          />
        </div>
      </section>
      
      <section className="music-section">
        <AddMusic />
        <Recommendation 
          setAnalysisResult={setAnalysisResult}
          setMusicInfo={setMusicInfo}
        />
      </section>
      
      <FrameComponent4 />
    </div>
  );
};

export default NewPost2;