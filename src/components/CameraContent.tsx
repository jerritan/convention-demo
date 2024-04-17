import React from "react";
import { CSSProperties } from "react";

interface CameraContentProps {
  camFeedUrl: string;
  camWidth: string;
  camHeight: string;
  camPosX: string;
  camPosY: string;
  assetFileName: string;
}

export const CameraContent: React.FC<CameraContentProps> = ({ camFeedUrl, camWidth, camHeight, camPosX, camPosY, assetFileName }) => {
  const camFrameStyle: CSSProperties = {
    position: 'absolute',
    left: `${camPosX}px`,
    top: `${camPosY}px`,
    width: `${camWidth}px`,
    height: `${camHeight}px`,
    objectFit: 'cover',
    zIndex: 99
  };

  const backgroundStyle: CSSProperties = {
    position: 'absolute', 
    left: 0, 
    top: 0, 
    width: '100%', 
    height: '100%', 
    objectFit: 'cover', 
    zIndex: 1 
  };

  return (
    <div className="relative w-full h-full m-0 p-0 overflow-hidden">
      <img 
        style={backgroundStyle} 
        src={`/file/${assetFileName}`} 
        alt="Crew Facing Background" 
      />
      <img
        style={camFrameStyle}
        src={`${camFeedUrl}`}
        alt="Crew Facing Data Feed"
      />
    </div>
  );
};

export default CameraContent;
