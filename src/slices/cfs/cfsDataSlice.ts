import { CREW_FACING_DATA } from "../../config";
import { createDataSlice } from "../../utils/createSliceFactory";

const {
  reducer: crewFacingDataReducer,
  fetchDataAsync: fetchCrewFacingDataAsync,
} = createDataSlice("CrewFacing", CREW_FACING_DATA);

export { crewFacingDataReducer, fetchCrewFacingDataAsync };
