import { useEffect, useRef } from "react";
import { RootState } from "../store";
import { useAppDispatch, useAppSelector } from "./reduxHook";

import { fetchGlobalDataAsync } from "../slices/controller/globalDataSlice";
import { fetchDemoDataAsync } from "../slices/controller/demoDataSlice";
import { fetchTalkingDataAsync } from "../slices/controller/talkingDataSlice";

function useControllerDataSelector(dataSlice: keyof RootState) {
  return {
    data: useAppSelector((state) => state[dataSlice].data),
    isLoading: useAppSelector((state) => state[dataSlice].isLoading),
  };
}

export const useLoadAssetsData = () => {
  const dispatch = useAppDispatch();
  const fetched = useRef(false); // useRef to track if fetch actions have been dispatched

  useEffect(() => {
    if (!fetched.current) {
      // Check if fetch actions haven't been dispatched yet
      dispatch(fetchGlobalDataAsync());
      dispatch(fetchDemoDataAsync());
      dispatch(fetchTalkingDataAsync());
      fetched.current = true; // Mark as fetched to prevent future dispatches on re-renders or re-mounts
    }
  }, [dispatch]);

  const globalSliceData = useControllerDataSelector("globalData");
  const demoSliceData = useControllerDataSelector("demoData");
  const talkingSliceData = useControllerDataSelector("talkingData");

  const globalData = [...globalSliceData.data];
  const demoData = [...demoSliceData.data];
  const talkingData = [...talkingSliceData.data];

  const isDataReady =
    !globalSliceData.isLoading &&
    !demoSliceData.isLoading &&
    !talkingSliceData.isLoading;

  return { isDataReady, globalData, demoData, talkingData };
};
