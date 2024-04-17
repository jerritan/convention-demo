import { SCREEN_DATA_ASSET_GLOBAL } from "../../config";
import { createDataSlice } from "../../utils/createSliceFactory";

const {
  reducer: globalAssetsDataReducer,
  fetchDataAsync: fetchGlobalAssetsDataAsync,
} = createDataSlice("Global Assets", SCREEN_DATA_ASSET_GLOBAL);

export { globalAssetsDataReducer, fetchGlobalAssetsDataAsync };
