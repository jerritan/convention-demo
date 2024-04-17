import { CONTROLLER_DATA_GLOBAL } from "../../config";
import { createDataSlice } from "../../utils/createSliceFactory";

const {
  reducer: globalDataReducer,
  fetchDataAsync: fetchGlobalDataAsync,
} = createDataSlice("Global", CONTROLLER_DATA_GLOBAL);

export { globalDataReducer, fetchGlobalDataAsync };
