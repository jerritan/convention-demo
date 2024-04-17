import { useEffect, useRef } from "react";
import { RootState } from "../store";
import { useAppDispatch, useAppSelector } from "./reduxHook";
import { fetchDefaultAssetsDataAsync } from "../slices/screen/defaultAssetsSlice";
import { fetchDemoAssetsDataAsync } from "../slices/screen/demoAssetsSlice";
import { fetchGlobalAssetsDataAsync } from "../slices/screen/globalAssetsSlice";
import { DataItem } from "../interfaces/datasource";

function useAssetsDataSelector(assetSlice: keyof RootState) {
  return {
    data: useAppSelector((state) => state[assetSlice].data),
    isLoading: useAppSelector((state) => state[assetSlice].isLoading),
  }; 
}

export const useLoadAssetsData = () => {
  const dispatch = useAppDispatch();
  const fetched = useRef(false); // useRef to track if fetch actions have been dispatched

  useEffect(() => {
    if (!fetched.current) {
      // Check if fetch actions haven't been dispatched yet
      dispatch(fetchDefaultAssetsDataAsync());
      dispatch(fetchDemoAssetsDataAsync());
      dispatch(fetchGlobalAssetsDataAsync());
      fetched.current = true; // Mark as fetched to prevent future dispatches on re-renders or re-mounts
    }
  }, [dispatch]);

  // default
  const defaultAssetsData = useAssetsDataSelector("defaultAssetsData");
  // demo
  const demoAssetsData = useAssetsDataSelector("demoAssetsData");

  // global
  const globalAssetsData = useAssetsDataSelector("globalAssetsData");

  const defaultAssets = [...defaultAssetsData.data] as DataItem[];

  const combinedAssets = [
    ...defaultAssetsData.data,
    ...demoAssetsData.data,
    ...globalAssetsData.data,
  ] as DataItem[];

  const assetsLoaded =
    !defaultAssetsData.isLoading &&
    !demoAssetsData.isLoading &&
    !globalAssetsData.isLoading;

  return { assetsLoaded, defaultAssets, combinedAssets };
};
