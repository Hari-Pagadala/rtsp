import React, { useRef, useEffect } from 'react';
import Hls from 'hls.js';
import './App.css';

const App = () => {
  const videoRefs = useRef([React.createRef(), React.createRef(), React.createRef()]);
  const videoSources = ['http://localhost:4000/index.m3u8', 'http://localhost:4000/index1.m3u8', 'http://localhost:4000/index2.m3u8'];

  useEffect(() => {
    const videos = videoRefs.current.map(ref => ref.current);

    videos.forEach((video, index) => {
      if (!video) return;

      if (Hls.isSupported()) {
        const hls = new Hls();
        hls.loadSource(videoSources[index]);
        hls.attachMedia(video);
        hls.on(Hls.Events.MEDIA_ATTACHED, function () {
          video.muted = true; // Mute the video for autoplay
          video.play();
        });
      } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
        video.src = videoSources[index];
        video.autoplay = true;
      } else {
        console.error('HLS not supported');
      }
    });

    return () => {
      videos.forEach(video => {
        if (video) {
          video.pause();
          video.removeAttribute('src');
          video.load();
        }
      });
    };
  }, []);

  return (
    <div className="App">
      <h1>IP Camera Streaming</h1>
      <div className="video-container">
        {videoRefs.current.map((ref, index) => (
          <video id="video" key={index} ref={ref} controls width="400px" height="auto" muted autoPlay />
        ))}
      </div>
    </div>
  );
}

export default App;
