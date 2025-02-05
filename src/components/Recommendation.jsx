import { useState, useEffect } from "react";
import PropTypes from "prop-types";
import "./Recommendation.css";

// API 기본 URL을 환경에 맞게 설정
const API_BASE_URL = 'http://192.168.1.3:3002';  // 백엔드 서버 주소로 변경

const Recommendation = ({ setAnalysisResult, setMusicInfo }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [availableTracks, setAvailableTracks] = useState(null);
  const [selectedTrackId, setSelectedTrackId] = useState(null);  // 선택된 트랙 ID 관리

  const handleButtonClick = async () => {
    setIsLoading(true);
    try {
      // localStorage에서 미디어 파일과 텍스트 가져오기
      const mediaFiles = JSON.parse(localStorage.getItem('uploadedMedia') || '[]');
      const postText = localStorage.getItem('postText') || '';

      let response;
      if (mediaFiles.length > 0) {
        // 파일을 Base64로 변환
        const mediaData = await Promise.all(mediaFiles.map(async (media) => {
          try {
            const response = await fetch(media.url);
            const blob = await response.blob();
            return new Promise((resolve, reject) => {
              const reader = new FileReader();
              reader.onloadend = () => resolve({
                type: media.type.startsWith('video') ? 'video' : 'image',
                data: reader.result
              });
              reader.onerror = reject;
              reader.readAsDataURL(blob);
            });
          } catch (error) {
            console.error("Error processing media:", error);
            return null;
          }
        }));

        const validMediaData = mediaData.filter(item => item !== null);

        // 감정 분석 API 호출 (POST 요청)
        response = await fetch(`${API_BASE_URL}/api/analyze`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            mediaFiles: validMediaData,
            postText: postText
          })
        });
      } else {
        // 텍스트만 있는 경우 GET 요청
        response = await fetch(`${API_BASE_URL}/api/analyze?postText=${encodeURIComponent(postText)}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });
      }

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log("감정 분석 결과:", data);

      if (data.success) {
        const emotionLabels = {
          '0': '분노',
          '1': '기쁨',
          '2': '슬픔'
        };

        const formattedResult = {
          finalEmotion: emotionLabels[data.result.finalEmotion],
          imageEmotion: emotionLabels[data.result.imageEmotion],
          textEmotion: emotionLabels[data.result.textEmotion],
          videoEmotion: data.result.videoEmotion ? emotionLabels[data.result.videoEmotion] : null
        };

        console.log("포맷된 결과:", formattedResult);
        setAnalysisResult(formattedResult);
        setResult(formattedResult);

        const emotionToSpotify = {
          '분노': 'anger',
          '기쁨': 'joy',
          '슬픔': 'sadness'
        };

        const spotifyEmotion = emotionToSpotify[formattedResult.finalEmotion];
        console.log("Spotify 감정:", spotifyEmotion);

        const tracksResponse = await fetch(`${API_BASE_URL}/tracks/${spotifyEmotion}`);
        if (!tracksResponse.ok) {
          throw new Error('Failed to fetch tracks');
        }
        
        const tracksData = await tracksResponse.json();
        console.log("가져온 트랙:", tracksData);

        if (tracksData && tracksData.length > 0) {
          setAvailableTracks(tracksData);
          setMusicInfo(tracksData[0]);
          localStorage.setItem('musicInfo', JSON.stringify(tracksData[0]));
        } else {
          console.error("추천 음악이 없습니다.");
        }
      }
    } catch (error) {
      console.error("분석 실패:", error);
      if (error.message.includes('Failed to fetch')) {
        alert(`음악 정보를 가져오는데 실패했습니다. 서버 상태를 확인해주세요.`);
      } else {
        alert(`감정 분석 중 오류가 발생했습니다: ${error.message}`);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleTrackSelect = (track, index) => {
    setSelectedTrackId(index); // 선택된 트랙의 index 저장
    setMusicInfo(track);
    localStorage.setItem('musicInfo', JSON.stringify(track));
  };

  return (
    <div className="recommendation-wrapper">
      <div className="ai-recommendation-section">
        <div className="recommendation-button">
          <div className="button1" onClick={handleButtonClick}>
            <img className="icon2" alt="" src="/icon-1@2x.png" />
            <div className="ai-wrapper">
              <div className="ai">
                {isLoading ? "분석중..." : "AI에게 음악 추천받기"}
              </div>
            </div>
          </div>
        </div>

        {result && (
          <div className="analysis-result">
            <h3>감정 분석 결과</h3>
            <div className="emotion-results">
              {result.textEmotion && <div>텍스트: {result.textEmotion}</div>}
              {result.imageEmotion && <div>이미지: {result.imageEmotion}</div>}
              {result.videoEmotion && <div>비디오: {result.videoEmotion}</div>}
              {result.finalEmotion && (
                <div className="final-emotion">최종 감정: {result.finalEmotion}</div>
              )}
            </div>
          </div>
        )}

        {availableTracks && (
          <div className="track-selection">
            <h3>추천 음악</h3>
            {availableTracks.map((track, index) => (
              <div 
                key={index}
                className={`track-item ${selectedTrackId === index ? 'active' : ''}`}
                onClick={() => handleTrackSelect(track, index)}
              >
                <img 
                  src={track.album_cover} 
                  alt="앨범 커버" 
                  className="track-album-cover"
                />
                <div className="track-info">
                  <div className="track-title">{track.bgm_name}</div>
                  <div className="track-artist">{track.artist}</div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

Recommendation.propTypes = {
  setAnalysisResult: PropTypes.func.isRequired,
  setMusicInfo: PropTypes.func.isRequired
};

export default Recommendation;