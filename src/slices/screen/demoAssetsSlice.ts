import { SCREEN_DATA_ASSET_DEMO } from "../../config";
import { createDataSlice } from "../../utils/createSliceFactory";

const {
  reducer: demoAssetsDataReducer,
  fetchDataAsync: fetchDemoAssetsDataAsync,
} = createDataSlice("Demo Assets", SCREEN_DATA_ASSET_DEMO);

export { demoAssetsDataReducer, fetchDemoAssetsDataAsync };
