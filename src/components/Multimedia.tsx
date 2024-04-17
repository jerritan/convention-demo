import React from "react";

import ImageContent from "./ImageContent";
import VideoContent from "./VideoContent";
// import SynVideoContent from "./SynVideoContent";
import ZipContent from "./ZipContent";

import { getBaseUrl } from "../utils/urlHelper";
import { getFileExtensionType } from "../utils/getFileExtensionType";

export interface MultimediaProps {
  src: string;
  zip?: string;
  width?: string;
  height?: string;
  queryParams?: string;
  disabled?: boolean;
  videoLoop?: boolean;
  imagePaddingAdjustment?: boolean;
  backupImageSrc?: string;
  messageData?: {
    screenName: string;
    orientation: string;
  }
}

export const MultimediaComp = ({
  src,
  zip,
  width,
  height,
  queryParams,
  disabled = false,
  videoLoop = false,
  imagePaddingAdjustment,
  backupImageSrc,
  messageData,
}: MultimediaProps) => {
  const extension = src && getFileExtensionType(src);
  switch (extension) {
    case "image":
      return (
        <ImageContent
          src={getBaseUrl(`/${zip ? zip : "file"}/${src}`)}
          width={width}
          height={height}
          imagePaddingAdjustment={imagePaddingAdjustment}
          backupImageSrc={
            backupImageSrc &&
            getBaseUrl(`/${zip ? zip : "file"}/${backupImageSrc}`)
          }
        />
      );
    case "video":
      return (
        <VideoContent
          src={getBaseUrl(`/${zip ? zip : "file"}/${src}`)}
          width={width}
          height={height}
          disabled={disabled}
          videoLoop={videoLoop}
        />
      );
    case "iframe":
      return (
        <ZipContent
          src={getBaseUrl(
            `/content/${src}${queryParams ? "/?" + queryParams : "/"}`
          )}
          width={width}
          height={height}
          queryParams={queryParams}
          disabled={disabled}
          messageData={messageData}
        />
      );
    default:
      return null;
  }
};

const arePropsEqual = (
  prevProps: MultimediaProps,
  nextProps: MultimediaProps
) => {
  return (
    prevProps.src === nextProps.src &&
    prevProps.videoLoop === nextProps.videoLoop
  );
};

export const Multimedia = React.memo(MultimediaComp, arePropsEqual);

export default Multimedia;
