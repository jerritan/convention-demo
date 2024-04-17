import { SUPERMASTER_IP } from "../config";
import { getEnvironment } from "../utils/switchboardEnvHelper";

const urlParams = new URLSearchParams(window.location.search);

export const createSendData = (channel: string) => (payload: any) => {
  const ip =
    getEnvironment("master-ip") ||
    urlParams.get("supermaster") ||
    SUPERMASTER_IP;

  console.info(`master ip is ${SUPERMASTER_IP}`);

  console.log(payload);
  fetch(`http://${ip}:3333/createMessage/${channel}`, {
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    method: "POST",
    body: JSON.stringify(payload),
  });
};
