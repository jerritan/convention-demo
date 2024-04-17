import { configureStore } from "@reduxjs/toolkit";

import { globalDataReducer } from "./slices/controller/globalDataSlice";
import { demoDataReducer } from "./slices/controller/demoDataSlice";
import { talkingDataReducer } from "./slices/controller/talkingDataSlice";

import { defaultAssetsDataReducer } from "./slices/screen/defaultAssetsSlice";
import { demoAssetsDataReducer } from "./slices/screen/demoAssetsSlice";
import { globalAssetsDataReducer } from "./slices/screen/globalAssetsSlice";

import { crewFacingDataReducer } from "./slices/cfs/cfsDataSlice";
import cnbReducer from "./slices/cnb-slice";

export const store = configureStore({
  reducer: {
    globalData: globalDataReducer,
    demoData: demoDataReducer,
    talkingData: talkingDataReducer,
    defaultAssetsData: defaultAssetsDataReducer,
    demoAssetsData: demoAssetsDataReducer,
    globalAssetsData: globalAssetsDataReducer,
    crewFacingData: crewFacingDataReducer,
    cnb: cnbReducer,
  },
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
