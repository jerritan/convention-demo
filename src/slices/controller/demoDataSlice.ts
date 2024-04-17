import { CONTROLLER_DATA_DEMO } from "../../config";
import { createDataSlice } from "../../utils/createSliceFactory";

const {
  reducer: demoDataReducer,
  fetchDataAsync: fetchDemoDataAsync,
} = createDataSlice("Demo", CONTROLLER_DATA_DEMO);

export { demoDataReducer, fetchDemoDataAsync };

