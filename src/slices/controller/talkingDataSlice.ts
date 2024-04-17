import { CONTROLLER_DATA_TALKING } from "../../config";
import { createDataSlice } from "../../utils/createSliceFactory";

const {
  reducer: talkingDataReducer,
  fetchDataAsync: fetchTalkingDataAsync,
} = createDataSlice("Talking", CONTROLLER_DATA_TALKING);

export { talkingDataReducer, fetchTalkingDataAsync };
