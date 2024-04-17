import React from "react";
import { useAppDispatch, useAppSelector } from "../hooks/reduxHook";
import { useEffect } from "react";
import { fetchCnbAsync } from "../slices/cnb-slice";
import { SetConfig, SwitchboardConfig } from "../utils/switchboardEnvHelper";
import { useState } from "react";

const getScreenSize = () => {
  // let size: [string, string] = ['', ''];

  // if (orientation === 'left') {
  //   size = ['1080px', '1920px'];
  // } else {
  //   size = ['1920px', '1080px'];
  // }

  // return size;

  return ['1920px', '1080px'];
};

const APP_CONFIG: SwitchboardConfig = {
  environmentData: {
    orientation: "",
    sequence: "",
    "channel-name": "",
    "channel-screen": {
      name: ""
    },
    "screen-set-name": "",
  },
  dataSources: {
    // "wwc.cnb.csv": [
    //   {
    //     "freshInterval(min)": "0.1",
    //     logoUrl: "AUS-Z9 CX Insights Future.jpg",
    //     padUrl: "https://bing.com",
    //     uid: "1",
    //   },
    // ],
  },
};

const FRESH_INTERVAL_TEXT = "freshInterval(min)";
const DEFAULT_BG_COLOR = "#f8cb56";

export interface elementSize {
  width?: string;
  height?: string;
}

export const CnbApp: React.FC = () => {
  SetConfig(APP_CONFIG);

  const dispatch = useAppDispatch();
  const data = useAppSelector((state) => state.cnb.data);

  // const orientation = getEnvironment('orientation') || 'left';
  const [width, height] = getScreenSize();
  const [iframeSize, setIframeSize] = useState<elementSize>({});
  const [iframeUrl, setIframeUrl] = useState("");
  const [styles, setStyles] = useState({});
  const [refreshIntervalId, setRefreshIntervalId] = useState<NodeJS.Timeout>();

  useEffect(() => {
    dispatch(fetchCnbAsync());
  }, [dispatch]);

  // Update state based on fetched data
  useEffect(() => {
    if (data?.[0]) {
      const filteredData = data[0];
      const { logoUrl, padUrl } = filteredData;
      const freshInterval = Number(filteredData?.[FRESH_INTERVAL_TEXT]);

      setIframeSize({
        width: "100%",
        height: "100%",
      });
      setIframeUrl(padUrl);
      setStyles({
        backgroundImage: `url("${window.location.origin}/file/${logoUrl}")`,
      });

      // wait for generation of iframe
      setTimeout(() => {
        // reload iframe
        (document.getElementById("iframe") as HTMLIFrameElement).src = padUrl;
      }, 100);

      // Validate
      if (freshInterval && Number.isInteger(freshInterval)) {
        const intervalId = setInterval(() => {
          // Refetch data
          dispatch(fetchCnbAsync());
        }, freshInterval * 60 * 1000);
        setRefreshIntervalId(intervalId);
      }
    }

    return () => {
      if (refreshIntervalId) {
        clearInterval(refreshIntervalId);
      }
    };
  }, [data, dispatch]);

  return (
    <section
      className={`w-[${width}] h-[${height}] px-[60px] bg-[length:100%_100%] bg-[${DEFAULT_BG_COLOR}] overflow-hidden`}
      // className={`w-screen h-screen bg-[length:100%_100%] bg-[${DEFAULT_BG_COLOR}]`}
      style={styles}
    >
      {iframeUrl && (
        <div className="flex justify-center items-center box-border h-full">
          <iframe
            name="iframe"
            id="iframe"
            // src={iframeUrl}
            style={iframeSize}
          />
        </div>
      )}
    </section>
  );
};
