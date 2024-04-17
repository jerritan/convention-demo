import React from "react";
import { HashRouter as Router, Route, Routes } from "react-router-dom";

import { useLoadAssetsData } from "../hooks/useLoadControllerData";
import { DemoDataItem, GlobalDataItem, TalkingDataItem } from "../interfaces/datasource";

import GlobalController from "../containers/GlobalContainer";
import HomeContainer from "../containers/HomeContainer";
import DemoContainer from "../containers/DemoContainer";

export const ControllerApp: React.FC = () => {
  const { isDataReady, globalData, demoData, talkingData } = useLoadAssetsData();

  if (!isDataReady) {
    return <div>Loading...</div>; // Or any other loading indicator
  }

  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomeContainer />} />
        <Route
          path="/demo"
          element={
            <DemoContainer demoData={demoData as DemoDataItem[]} talkingData={talkingData as TalkingDataItem[]} />
          }
        />
        <Route path="/global" element={<GlobalController globalData={globalData as GlobalDataItem[]}/>} />
      </Routes>
    </Router>
  );
};
