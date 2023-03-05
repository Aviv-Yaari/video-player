interface Video {
    src: string;
    duration: number;
  }
  
  export function findVideoForTime(videos: Video[], time: number) {
    let durationSoFar = 0;
    for (let i = 0; i < videos.length; i++) {
      const video = videos[i];
      durationSoFar += video.duration;
      if (time < durationSoFar) {
        return i;
      }
    }
    return videos.length - 1;
  }
  
  export function calcDurationUpToIndex(videos: Video[], currentIndex: number) {
    let durationSoFar = 0;
    for (let i = 0; i < videos.length; i++) {
      if (i >= currentIndex) break;
      const video = videos[i];
      durationSoFar += video.duration;
    }
    return durationSoFar;
  }
  