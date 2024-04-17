import React, { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Select from "react-select";

import { DemoDataItem, TalkingDataItem } from "../interfaces/datasource";
import { createSendData } from "../services/sendMessageService";
import WrapTextButton from "../components/WrapTextButton";

interface HierarchicalMap {
  [customer: string]: {
    [zone: string]: {
      [journey: string]: string;
    };
  };
}

interface DemoContainerProps {
  demoData: DemoDataItem[];
  talkingData: TalkingDataItem[];
}

const sendMessage = createSendData("wwc");

const customStyles = {
  control: (baseStyles, state) => ({
    ...baseStyles,
    backgroundColor: "black",
    color: "white",
    borderRadius: "10px",
    fontSize: "26px",
    borderColor: "#01a2dd",
    borderWidth: "2px",
    boxShadow: state.isFocused ? "0 0 0 1px rgb(96,165,250)" : "none",
    "&:hover": {
      borderColor: "rgb(96,165,250)",
    },
  }),
  option: (baseStyles, state) => {
    return {
      ...baseStyles,
      backgroundColor: state.isSelected ? "lightBlue" : "black",
      color: state.isSelected ? "black" : "white",
      cursor: "pointer",
      fontSize: "22px",
      overflow: "hidden",
      textOverflow: "ellipsis",
      whiteSpace: "nowrap",
    };
  },
  placeholder: (baseStyles) => {
    return {
      ...baseStyles,
      color: "white",
      fontSize: "22px",
      padding: "0 5px",
    };
  },
  singleValue: (baseStyles) => ({
    ...baseStyles,
    color: "white",
    fontSize: "26px",
    padding: "0 5px",
  }),
  menu: (baseStyles) => ({
    ...baseStyles,
    backgroundColor: "black",
    width: "100%",
    border: "2px solid rgb(96,165,250)",
    zIndex: 9999,
    overflowY: "auto",
  }),
};

const DemoContainer: React.FC<DemoContainerProps> = ({ demoData, talkingData }) => {
  const [selectedCustomer, setSelectedCustomer] = useState("");
  const [selectedZone, setSelectedZone] = useState("");
  const [selectedJourney, setSelectedJourney] = useState("");
  const [talkingPointImg, setTalkingPointImg] = useState("");

  const initializeMap = useCallback(() => {
    return demoData.reduce<HierarchicalMap>((acc, item) => {
      const { actionKey, customer, zone, journey } = item;
      acc[customer] = acc[customer] || {};
      acc[customer][zone] = acc[customer][zone] || {};
      acc[customer][zone][journey] = actionKey;
      return acc;
    }, {});
  }, [demoData]);

  const [hierarchicalMap, setHierarchicalMap] = useState<HierarchicalMap>(initializeMap);

  useEffect(() => {
    setHierarchicalMap(initializeMap);
  }, [initializeMap]);

  const handleCustomerChange = (selectedOption: {
    value: string;
    label: string;
  }) => {
    setSelectedCustomer(selectedOption.value);
    setSelectedZone("");
    setSelectedJourney("");
  };

  const findTalkingPointImg = (key: string) => {
    const foundItem = talkingData.find((item) => item.actionKey === key);
    return foundItem?.assetFileName;
  };

  const handleZoneSelection = (zone: string) => {
    setSelectedZone(zone);
    setSelectedJourney("");
  };

  const handleJourneySelection = (journey: string) => {
    setSelectedJourney(journey);

    setTimeout(() => {
      if (selectedCustomer && selectedZone && journey) {
        const actionKey = hierarchicalMap[selectedCustomer]?.[selectedZone]?.[journey];

        if (actionKey) {
          const messageObj = { action: journey, value: actionKey };
          sendMessage(messageObj);

          const matchedImg = findTalkingPointImg(actionKey);
          if (matchedImg) setTalkingPointImg(matchedImg);

          console.log("ActionKey Sent: ", actionKey);
        } else {
          console.warn("No actionKey found for the selected journey");
        }
      } else {
        console.warn("selectedCustomer, selectedZone, or journey is null");
      }
    }, 100);
  };

  const customerOptions = Object.keys(hierarchicalMap).map((customer) => ({
    value: customer, label: customer
  }));

  return (
    <div className="relative bg-black w-full h-screen">
      {/* Left Side */}
      <div className="absolute top-[30px] left-[30px] w-[330px] flex flex-col">
        {/* Top Section */}
        <div className="w-full h-[60px] mb-2">
          <Select
            isSearchable={false}
            className="w-full"
            options={customerOptions}
            onChange={handleCustomerChange}
            defaultValue={customerOptions[0]}
            styles={customStyles}
            maxMenuHeight={650}
          />
        </div>
        {/* Zones and Journeys Display */}
        <div className="w-full text-white flex flex-row justify-between overflow-y-auto">
          <div className="w-1/2 content-start flex flex-col">
            {selectedCustomer &&
              Object.keys(hierarchicalMap[selectedCustomer] || {}).map(
                (zone) => (
                  <WrapTextButton
                    key={zone}
                    className={`h-[50px] text-left px-3 py-1 mr-1 mb-2 whitespace-normal rounded-lg ${
                      selectedZone === zone
                        ? "bg-white text-black"
                        : "hover:bg-gray-600 border border-gray-400"
                    }`}
                    onClick={() => handleZoneSelection(zone)}
                  >
                    {zone}
                  </WrapTextButton>
                )
              )}
          </div>
          <div className="w-1/2 content-end flex flex-col">
            {selectedCustomer &&
              selectedZone &&
              Object.keys(
                hierarchicalMap[selectedCustomer][selectedZone] || {}
              ).map((journey) => (
                <WrapTextButton
                  key={journey}
                  className={`h-[50px] text-left px-4 py-1 ml-1 mb-2 rounded-lg whitespace-normal ${
                    selectedJourney === journey
                      ? "bg-blue-950 text-blue-50 border-2 border-blue-400"
                      : "bg-transparent hover:bg-gray-600 border border-gray-400"
                  }`}
                  onClick={() => handleJourneySelection(journey)}
                >
                  {journey}
                </WrapTextButton>
              ))}
          </div>
        </div>
      </div>

      <div className="absolute top-[660px] left-[30px]">
        <Link to="/">
          <img className="w-12 h-auto" src="./home.png" />
        </Link>
      </div>

      {/* Content for selected journey  */}
      <div className="absolute top-[30px] left-[380px] w-[770px] h-[680px] bg-black">
        <img
          className="w-full h-auto"
          src={`${window.location.origin}/file/${talkingPointImg}`}
        />
      </div>
    </div>
  );
};

export default DemoContainer;
