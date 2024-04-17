import { SUPERMASTER_IP } from "../config";
import { LmsOptionsInterface, LmsSocketService } from "./lmsSocketService";

export const defaultLmsOptions: LmsOptionsInterface = {
    ip: SUPERMASTER_IP,
    port: '22599',
    lane: 'cod-lane-1',
    reconnect: true,
    reconnectDelay: 60,
  };

export class LmsConnectService {
  protected options: LmsOptionsInterface;
  protected socketIoClient: LmsSocketService;

  constructor() {}

  public init(options: LmsOptionsInterface): LmsSocketService {
    this.options = { ...defaultLmsOptions, ...options };
    const { ip, lane } = this.options;

    if (this.socketIoClient) {
      // If socketIoClient already exists, just update its options
      this.socketIoClient.update({ ip, lane });
    } else {
      // Otherwise, create a new LmsSocketService instance
      this.socketIoClient = new LmsSocketService({ ip, lane });
    }

    // Return the LmsSocketService instance
    return this.socketIoClient;
  }
}

export default new LmsConnectService();
