import React, { FC, useEffect, useRef } from "react";

interface VideoContentProps {
  src: string;
  disabled: boolean;
  width?: string;
  height?: string;
  videoLoop?: boolean;
}

const VideoContent: FC<VideoContentProps> = ({
  src,
  disabled,
  width,
  height,
  videoLoop,
}) => {
  const videoElemRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (!(videoElemRef && videoElemRef.current)) {
      return;
    }
    const videoRef = videoElemRef.current;
    if (videoLoop === false) {
      videoRef.currentTime = 0;
      videoRef.muted = false;
    }
    if (disabled) {
      videoRef.pause();
    } else {
      videoRef.currentTime = 0;
      videoRef.play();
      videoRef.muted = false;
    }
  }, [src, disabled, videoLoop]);

  // Inline style for dynamic width and height
  const dynamicStyles = {
    width: width || "100%",
    height: height || "100%",
  };

  return (
    <video
      src={src}
      ref={videoElemRef}
      style={dynamicStyles}
      autoPlay
      muted
      loop={videoLoop}
    />
  );
};

export default VideoContent;
