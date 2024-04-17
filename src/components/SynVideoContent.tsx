
import React, { FC, useEffect, useRef } from "react";
import { startVideoSync } from "../services/startSyncingVideo";

interface VideoContentProps {
  src: string;
  disabled: boolean;
  width?: string;
  height?: string;
  videoLoop?: boolean;
}

const SynVideoContent: FC<VideoContentProps> = ({
  src,
  disabled,
  width,
  height,
  videoLoop = false,
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const handleMetadataLoaded = () => {
      const videoDuration = Math.floor(video.duration);
      startVideoSync(videoDuration); // Start the background sync with video duration
    };

    video.addEventListener("loadedmetadata", handleMetadataLoaded);

    // Control loop behavior based on prop
    video.loop = videoLoop;

    // Play or pause based on the 'disabled' prop
    if (disabled) {
      video.pause();
    } else {
      video.play().catch((error) => console.error("Error playing the video:", error));
    }

    return () => {
      video.removeEventListener("loadedmetadata", handleMetadataLoaded);
    };
  }, [src, disabled, videoLoop]);

  // Styles for dynamic width and height
  const dynamicStyles = {
    width: width || "100%",
    height: height || "100%",
  };

  return (
    <video
      src={src}
      ref={videoRef}
      style={dynamicStyles}
      muted
      autoPlay
      loop={videoLoop}
    />
  );
};

export default SynVideoContent;
