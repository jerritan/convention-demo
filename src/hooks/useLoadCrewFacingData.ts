import { useEffect, useRef } from "react";
import { RootState } from "../store";
import { useAppDispatch, useAppSelector } from "./reduxHook";
import { fetchCrewFacingDataAsync } from "../slices/cfs/cfsDataSlice";
import { DataItem } from "../interfaces/datasource";

function useSliceSelector(stateSlice: keyof RootState) {
  return {
    data: useAppSelector((state) => state[stateSlice].data),
    isLoading: useAppSelector((state) => state[stateSlice].isLoading),
  }; 
}

export const useLoadCrewFacingData = () => {
  const dispatch = useAppDispatch();
  const fetched = useRef(false); // useRef to track if fetch actions have been dispatched

  useEffect(() => {
    if (!fetched.current) {
      // Check if fetch actions haven't been dispatched yet
      dispatch(fetchCrewFacingDataAsync());
      fetched.current = true; // Mark as fetched to prevent future dispatches on re-renders or re-mounts
    }
  }, [dispatch]);

  const sliceData = useSliceSelector("crewFacingData");

  const crewFacingData = [...sliceData.data] as DataItem[];

  const crewFacingDataLoaded = !sliceData.isLoading;

  return { crewFacingDataLoaded, crewFacingData };
};
