import React, { useEffect, useRef } from "react";

interface ZipContentProps {
  src: string;
  disabled: boolean;
  width?: string;
  height?: string;
  queryParams?: string;
  borderStyle?: string;
  messageData?: {
    screenName: string;
    orientation: string;
  }
}

const ZipContent: React.FC<ZipContentProps> = ({
  src,
  width,
  height,
  disabled,
  borderStyle,
  messageData,
}) => {
  const iframeElemRef = useRef<HTMLIFrameElement>(null);

  useEffect(() => {
    console.log('iframeElemRef', iframeElemRef);
    console.log('messageData', messageData);
    const sendMessageToIframe = () => {
      const iframe = iframeElemRef.current;
      if (iframe && iframe.contentWindow && messageData) {
        // The '*' targetOrigin is a security risk in production code if you know the specific origin of the iframe
        iframe.contentWindow.postMessage(messageData, '*');
      }
    };

    sendMessageToIframe();
    console.log('message sent');
  }, [messageData]);


  useEffect(() => {
    const playPauseVideo = () => {
      try {
        const iframeElem = iframeElemRef.current;
        const iframeDocumentObj =
          iframeElem?.contentDocument || iframeElem?.contentWindow?.document;
        const videoRef = iframeDocumentObj?.getElementById(
          "videoPlayer"
        ) as HTMLVideoElement;

        if (videoRef && videoRef.pause && videoRef.play) {
          if (disabled) {
            videoRef.pause();
          } else {
            videoRef.currentTime = 0;
            videoRef.play();
          }
        }
      } catch (err) {
        console.error(
          `An error occurred when trying to play or pause a video inside an iframe: ${err}`
        );
      }
    };

    playPauseVideo();
  }, [src, disabled]);

  const dynamicStyles = {
    width: width || "100%",
    height: height || "100%",
    border: borderStyle || "none",
  };

  return (
    <iframe
      src={src}
      ref={iframeElemRef}
      style={dynamicStyles}
      allow="autoplay; encrypted-media"
      title="promo video"
      className=""
    />
  );
};

export default ZipContent;
