import React from "react";
import { Link } from "react-router-dom";

import { GlobalDataItem } from "../interfaces/datasource";
import { createSendData } from "../services/sendMessageService";

const sendMessage = createSendData("wwc");

interface GlobalContainerProps {
  globalData: GlobalDataItem[];
}

const GlobalContainer: React.FC<GlobalContainerProps> = ({ globalData }) => {
  const handleClick = (actionKey: string) => {
    setTimeout(() => {
      sendMessage({
        action: "takeover",
        value: actionKey,
      });
      console.log("Send takeover", actionKey);
    }, 100);
  };

  return (
    <div className="relative bg-black w-full h-screen">
      <div className="w-full h-full flex justify-center items-center">
        {globalData ? (
          globalData.map((item, index) => {
            const borderColor =
              index === 0 ? "border-[#01a2dd]" : "border-[#ee3135]";

            return (
              <button
                key={item.uid}
                onClick={() => handleClick(item.actionKey)}
                className={`bg-black text-white py-4 px-20 mr-10 border-2 ${borderColor} rounded text-4xl`}
              >
                {item.buttonName}
              </button>
            );
          })
        ) : (
          <div>Loading data...</div>
        )}
      </div>

      <div className="absolute top-[30px] left-[30px]">
        <div className="text-white text-4xl">Global Control:</div>
      </div>

      <div className="absolute top-[660px] left-[30px]">
        <Link to="/">
          <img className="w-12 h-auto" src="./home.png" />
        </Link>
      </div>
    </div>
  );
};

export default GlobalContainer;
