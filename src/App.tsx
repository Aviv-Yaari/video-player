import { ChangeEventHandler, useMemo, useRef, useState } from "react";
import "./App.css";
import { calcDurationUpToIndex, findVideoForTime } from "./utils";
import videos from "./videos.json";

function App() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const videoRef = useRef<HTMLVideoElement>(null);
  const index = useRef(0);
  const totalDuration = useMemo(() => calcDurationUpToIndex(videos, videos.length), []);

  const togglePlay = () => {
    setIsPlaying(!isPlaying);
    if (isPlaying) {
      videoRef.current?.pause();
    } else {
      videoRef.current?.play();
    }
  };

  const init = () => {
    if (!videoRef.current) return;
    replaceSrc(videos[0].src);
    setCurrentTime(0);
    setIsPlaying(false);
    index.current = 0;
    videoRef.current.currentTime = 0;
    videoRef.current.pause();
  };

  const handleTimeUpdate = () => {
    if (!videoRef.current) return;
    if (currentTime > 0.99) {
      init();
      return;
    }
    if (videos[index.current].duration - videoRef.current.currentTime < 0.1 && index.current < videos.length - 1) {
      index.current = index.current + 1;
      replaceSrc(videos[index.current].src);
    }
    setCurrentTime((videoRef.current.currentTime + calcDurationUpToIndex(videos, index.current)) / totalDuration);
  };

  const replaceSrc = (src: string) => {
    if (!videoRef.current) return;
    videoRef.current.src = src;
    videoRef.current.load();
    videoRef.current.play();
    setIsPlaying(true);
  };

  const handleSeek: ChangeEventHandler<HTMLInputElement> = (e) => {
    if (!videoRef.current) return;
    const newTime = +e.target.value * totalDuration; // in seconds
    const videoForTime = findVideoForTime(videos, newTime);
    if (videos[videoForTime].src !== videoRef.current.src) {
      index.current = videoForTime;
      replaceSrc(videos[videoForTime].src);
    }
    videoRef.current.currentTime = newTime - calcDurationUpToIndex(videos, videoForTime);
    setCurrentTime(+e.target.value);
  };

  return (
    <div className="App">
      <video
        ref={videoRef}
        src={videos[0].src}
        onTimeUpdate={handleTimeUpdate}
      />
      <div className="seek-bar">
        <button onClick={togglePlay}>{isPlaying ? "Pause" : "Play"}</button>
        <input
          type="range"
          min="0"
          max="1"
          step="0.01"
          value={currentTime}
          onChange={handleSeek}
        />
      </div>
    </div>
  );
}

export default App;
