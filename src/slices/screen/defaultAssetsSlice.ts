import { SCREEN_DATA_ASSET_DEFAULT } from "../../config";
import { createDataSlice } from "../../utils/createSliceFactory";

const {
  reducer: defaultAssetsDataReducer,
  fetchDataAsync: fetchDefaultAssetsDataAsync,
} = createDataSlice("Default Assets", SCREEN_DATA_ASSET_DEFAULT);

export { defaultAssetsDataReducer, fetchDefaultAssetsDataAsync };
