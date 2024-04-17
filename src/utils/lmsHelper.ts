import lmsConnectService from "../services/lmsConnectService";
import { LmsSocketService } from "../services/lmsSocketService";
import { fetchEnvLaneParam, fetchMasterIpParam } from "./switchboardEnvHelper";

type filterOption = {
  classification?: string;
  channel?: string;
};

const urlParams = new URLSearchParams(window.location.search);
let client: LmsSocketService | undefined;

async function initClient() {
  const masterIp = fetchMasterIpParam(urlParams);
  if (masterIp) {
    console.info(`master ip found, connecting..`);
    let ip = masterIp;

    // Overwrite IP if 'supermaster' query parameter is set
    const ipOverWrite = urlParams.get("supermaster");
    if (ipOverWrite) ip = ipOverWrite;

    const lane = fetchEnvLaneParam(urlParams);

    console.info(`supermaster ip[${ip}]: lane[${lane}]`);

    client = lmsConnectService.init({ ip, lane });

    // Setup connection listeners
    client.onConnect(() => {
      console.info("Connected to LMS Socket Service");
    });

    client.onConnectError(() => {
      console.error("Connection to LMS Socket Service failed");
    });
  }
}

initClient();

const $lmsClient = client; // Expose the client for usage outside

// filter functions for lms payload
// const filterLabel = (str: string) => (labels: string[]) => labels.includes(str);
// const filterClassification = (str: string) => (classification: string) => classification.includes(str);

// const PASS = () => true;

let onConnectCB: any = undefined;

export const getMessageStream = async ({
  classification,
  channel,
}: filterOption) => {
  const isMasterIP = fetchMasterIpParam(urlParams);
  if (isMasterIP && !onConnectCB && $lmsClient) {
    onConnectCB = $lmsClient.onConnect(() => {
      console.log(
        `%c👂 start listening...${classification ? classification : ""} ${
          channel ? channel : ""
        }...`,
        "color:yellow; background:black;"
      );
    });

    // Assuming onMessage() sets up a listener and calls the callback with messages
    $lmsClient.onMessage((message) => {
      const { data } = message;
      const attributes = data?.attributes;
      const payload = JSON.parse(attributes.payload)
      // if (channel ? filterLabel(channel)(attributes.labels) : PASS()) {
      //   // Process message
      //   console.log("lms message", data);
      // }
      console.log("LMS Message Payload", payload);
    });
  }
};

