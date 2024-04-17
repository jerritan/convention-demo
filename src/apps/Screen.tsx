import React, { useEffect, useState } from "react";

import {
  SetConfig,
  SwitchboardConfig,
  getEnvironment,
} from "../utils/switchboardEnvHelper";

import Multimedia from "../components/Multimedia";
import CameraContent from "../components/CameraContent";

import { useLmsClient, useMessageStream } from "../hooks/useLmsClient";

import { DataItem } from "../interfaces/datasource";

import { getUrlParamValue } from "../utils/urlHelper";
import { useLoadAssetsData } from "../hooks/useLoadAssetsData";

const channel = "ZONE2";
const classification = "message";

const urlScreenName = getUrlParamValue("screenName");
const urlScreenOrientation = getUrlParamValue("orientation");
const animationDuration = 1000;

const APP_CONFIG: SwitchboardConfig = {
  environmentData: {
    orientation: urlScreenOrientation || "",
    sequence: "",
    "channel-name": "",
    "channel-screen": {
      name: urlScreenName || "",
    },
    "screen-set-name": "",
  },
  dataSources: {},
};

export const ScreenApp: React.FC = () => {
  const client = useLmsClient();
  const { payload: latestPayload } = useMessageStream(client, {
    classification,
    channel,
  });

  const lmsActionKey = latestPayload?.value;

  const [currentMedia, setCurrentMedia] = useState<DataItem | null>(null);
  const [nextMedia, setNextMedia] = useState<DataItem | null>(null);
  const [cfsMedia, setCfsMedia] = useState<DataItem | null>(null);
  const [mediaQueue, setMediaQueue] = useState<DataItem[]>([]);

  const [enabledLoop, setEnabledLoop] = useState(false);

  SetConfig(APP_CONFIG);
  const currentScreenName = getEnvironment("channel-screen").name;
  const orientation = getEnvironment("orientation");
  const isHorizontal = orientation === "normal";
  const mediaWidthClass = isHorizontal ? "w-[1920px]" : "w-[1080px]";
  const mediaHeightClass = isHorizontal ? "h-[1080px]" : "h-[1920px]";

  const { assetsLoaded, defaultAssets, combinedAssets } = useLoadAssetsData();

  const fallbackMedia = defaultAssets.find(
    (item) => item.screenName === currentScreenName
  );

  const hasLoopOrTakeover = (str: string | undefined) => {
    if (!str) return false;
    return str.toLowerCase().includes("loop") || str === "TAKEOVER_GLOBAL";
  };

  const shouldShowCFS =
    ["ZONE2-ODMB-CFS-1", "ZONE3-ODMB-CFS-1"].includes(currentScreenName) &&
    !(
      lmsActionKey === "TAKEOVER_GLOBAL" ||
      lmsActionKey === "RESET_GLOBAL" ||
      lmsActionKey === "default"
    );

  useEffect(() => {
    if (fallbackMedia && !currentMedia) {
      setCurrentMedia(fallbackMedia);
    }
  }, [currentMedia, currentScreenName, fallbackMedia]);

  useEffect(() => {
    if (!assetsLoaded) return;

    // Further filter assets for the current screen based on the LMS action key, if available
    // "US_GLOBAL-ZONE4-CFS_NOW"
    const matchedAsset = combinedAssets.find(
      (item) =>
        item.screenName === currentScreenName && item.actionKey === lmsActionKey
    );

    if (
      matchedAsset &&
      matchedAsset.uid !== currentMedia?.uid &&
      matchedAsset.uid !== nextMedia?.uid
    ) {
      if (shouldShowCFS) {
        setCfsMedia(matchedAsset);
        setEnabledLoop(false);
        setCurrentMedia(null);
        setNextMedia(null);
      } else {
        setNextMedia(matchedAsset);
        setEnabledLoop(hasLoopOrTakeover(lmsActionKey));
        setCfsMedia(null); // Ensure CFS media is cleared
      }
    }
  }, [assetsLoaded, combinedAssets, currentScreenName, lmsActionKey]);

  useEffect(() => {
    if (nextMedia && !lmsActionKey?.includes("CFS")) {
      const timer = setTimeout(() => {
        setCurrentMedia(nextMedia);
        setNextMedia(null);
      }, animationDuration);

      return () => clearTimeout(timer);
    }
  }, [lmsActionKey, nextMedia]);

  useEffect(() => {
    if (cfsMedia) {
      // If there's CFS media, clear the existing queue as it takes precedence
      setMediaQueue([]);
    } else {
      const newQueue = [currentMedia, nextMedia].filter(Boolean) as DataItem[];
      setMediaQueue(newQueue);
    }
  }, [currentMedia, nextMedia, cfsMedia]);

  const msg = {
    screenName: window.Switchboard.environmentData["channel-name"],
    orientation: window.Switchboard.environmentData["orientation"]
  }

  const renderMediaContent = (media: DataItem, index: number) => (
    <div
      key={media.uid}
      className={`${
        index > 0 ? "fade-in" : ""
      } absolute top-0 left-0 ${mediaWidthClass} ${mediaHeightClass}`}
    >
      <Multimedia videoLoop={enabledLoop} src={media.assetFileName} messageData={msg}/>
    </div>
  );

  return (
    <div
      className={`relative ${mediaWidthClass} ${mediaHeightClass} m-0 p-0 overflow-hidden whitespace-nowrap`}
    >
      {cfsMedia ? (
        // Directly render CFS media with CameraContent, bypassing the media queue
        <CameraContent
          camFeedUrl={cfsMedia.camFeedUrl}
          camWidth={cfsMedia.camWidth}
          camHeight={cfsMedia.camHeight}
          camPosX={cfsMedia.camPosX}
          camPosY={cfsMedia.camPosY}
          assetFileName={cfsMedia.assetFileName}
        />
      ) : (
        // Render mediaQueue with Multimedia for non-CFS content
        mediaQueue.map(renderMediaContent)
      )}
    </div>
  );
};
