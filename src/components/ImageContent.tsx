import React from "react";

interface ImageContentProps {
  src: string;
  width?: string;
  height?: string;
  imagePaddingAdjustment?: boolean;
  backupImageSrc?: string;
}

const ImageContent: React.FC<ImageContentProps> = ({
  src,
  width,
  height,
  imagePaddingAdjustment,
  backupImageSrc,
}) => {
  // Style object for dynamic styles
  const dynamicStyles = {
    width: width || "100%",
    height: height || "100%",
    verticalAlign: imagePaddingAdjustment ? "middle" : "initial",
  };

  return (
    <img
      src={src}
      alt="content-image"
      style={dynamicStyles}
      onError={(e) => {
        // Type assertion to inform TypeScript that e.target is an HTMLImageElement
        const target = e.target as HTMLImageElement;
        if (backupImageSrc) {
          target.src = backupImageSrc;
        }
      }}
    />
  );
};

export default ImageContent;
