import React, { useState, useEffect } from 'react';
import PostBottom from "../components/PostBottom";
import MainFrame from "../components/MainFrame";
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import "./Main.css";

const Main = () => {
 const [currentSlide, setCurrentSlide] = useState(1);
 const [mediaFiles, setMediaFiles] = useState([]);
 const [postText, setPostText] = useState('');
 const [accessToken, setAccessToken] = useState(null);
 const [deviceId, setDeviceId] = useState(null);

 useEffect(() => {
   const sharedMedia = JSON.parse(localStorage.getItem('sharedMedia') || '[]');
   const sharedText = localStorage.getItem('sharedText') || '';
   
   setMediaFiles(sharedMedia);
   setPostText(sharedText);
 }, []);

 useEffect(() => {
   const fetchAccessToken = async () => {
     try {
       const response = await fetch('http://192.168.1.3:3002/api/get-access-token');
       const data = await response.json();
       setAccessToken(data.access_token);
     } catch (error) {
       console.error('Error fetching access token:', error);
     }
   };

   fetchAccessToken();
 }, []);

 const handleMusicPlay = (trackId) => {
   if (!accessToken || !deviceId) {
     console.error('Access Token or Device ID is missing.');
     return;
   }

   fetch(`https://api.spotify.com/v1/me/player/play?device_id=${deviceId}`, {
     method: 'PUT',
     headers: {
       'Authorization': `Bearer ${accessToken}`,
       'Content-Type': 'application/json'
     },
     body: JSON.stringify({
       uris: [`spotify:track:${trackId}`]
     })
   }).then(response => {
     if (!response.ok) {
       throw new Error('Failed to play music');
     }
   }).catch(error => {
     console.error('Playback failed:', error);
   });
 };

 useEffect(() => {
   const carousel = document.getElementById('picturesCarousel');
   if (carousel) {
     carousel.addEventListener('slid.bs.carousel', (event) => {
       setCurrentSlide(event.to + 1);
       const currentMedia = mediaFiles[event.to];
       if (currentMedia && currentMedia.track_id) {
         handleMusicPlay(currentMedia.track_id);
       }
     });
   }

   return () => {
     if (carousel) {
       carousel.removeEventListener('slid.bs.carousel', () => {});
     }
   };
 }, [mediaFiles]);

 return (
   <div className="main">
     <main className="post-area">
       <section>
         <MainFrame />
         <div className="pictures-wrapper">
           <div 
             id="picturesCarousel" 
             className="carousel slide"
           >
             <div className="carousel-inner">
               {mediaFiles.map((media, index) => (
                 <div 
                   key={index}
                   className={`carousel-item ${index === 0 ? 'active' : ''}`}
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
             
             <button
               className="carousel-control-prev"
               type="button"
               data-bs-target="#picturesCarousel"
               data-bs-slide="prev"
             >
               <span className="carousel-control-prev-icon" aria-hidden="true"></span>
               <span className="visually-hidden">Previous</span>
             </button>
             <button
               className="carousel-control-next"
               type="button"
               data-bs-target="#picturesCarousel"
               data-bs-slide="next"
             >
               <span className="carousel-control-next-icon" aria-hidden="true"></span>
               <span className="visually-hidden">Next</span>
             </button>
           </div>
           <div className="carousel-indicators-custom">
             <span>{currentSlide}/{mediaFiles.length}</span>
           </div>
         </div>
         <div className="joshua-l-the-game-container">
           
         </div>
       </section>
       <PostBottom />
     </main>
   </div>
 );
};

export default Main;