import { useEffect, useState } from "react";

import { fetchEnvLaneParam, fetchMasterIpParam } from "../utils/switchboardEnvHelper";
import lmsConnectService from "../services/lmsConnectService";
import { LmsSocketService } from "../services/lmsSocketService";
import { SUPERMASTER_IP } from "../config";

type FilterOption = {
  classification?: string;
  channel?: string;
  screenName?: string;
};

export const useLmsClient = () => {
  const [client, setClient] = useState<LmsSocketService | undefined>();

  useEffect(() => {
    const initClient = async () => {
      const urlParams = new URLSearchParams(window.location.search);

      const ip = fetchMasterIpParam(urlParams) || SUPERMASTER_IP;
      const lane = fetchEnvLaneParam(urlParams);

      if (ip && lane) {
        console.info(`master ip[${ip}] and lane[${lane}] found, connecting..`);
        const clientInstance = lmsConnectService.init({ ip, lane });

        clientInstance.onConnect(() => {
          console.info("Connected to LMS Socket Service");
          console.log(
            "%c👂 start listening...",
            "color:yellow; background:black;"
          );
        });

        clientInstance.onConnectError(() => {
          console.error("Connection to LMS Socket Service failed");
        });

        setClient(clientInstance);
      }
    };

    initClient();
  }, []);

  return client;
};

export const useMessageStream = (
  client: LmsSocketService | undefined,
  filterOption: FilterOption
) => {
  const [payload, setPayload] = useState<{ action: string; value: string } | undefined>(undefined);

  useEffect(() => {
    if (client) {
      const handleMessage = (message: any) => {
        const { data } = message;
        const attributes = data?.attributes;
        const payload = JSON.parse(attributes.payload);
        if (payload) {
          console.log("LMS Raw msg: ", message);
          console.log("LMS Message Received", payload);
          setPayload(payload); // Update state with the new payload
        }
      };

      // Setup message listener
      client.onMessage(handleMessage);
    }
  }, [client, filterOption.classification, filterOption.channel]);

  return { payload };
};
