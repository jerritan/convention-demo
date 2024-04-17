/* eslint-disable @typescript-eslint/no-explicit-any */
import axios from "axios";
import { SocketIoService } from "./socketIoService";

export interface LmsMessageBaseInterface {
  data: {
    id: string;
    type: string;
    attributes: {
      classification: string;
      labels: string[];
      timestamp: string;
    };
  };
}

export type LmsNotificationInterface = LmsMessageBaseInterface & {
  data: {
    attributes: {
      payload: any;
    };
  };
};

export interface SocketIoConfig {
  port?: string;
  reconnect?: boolean;
  reconnectDelay?: number;
}

export interface SocketIoOptions extends SocketIoConfig {
  ip: string;
}

export interface LmsOptionsInterface extends SocketIoOptions {
  lane?: string;
}

const LMS_EVENTS = {
  MESSAGE: "message",
  NOTIFICATION: "notification",
};
const LMS_ENDPOINTS = {
  PORT: 3333,
  CREATE_MESSAGE: "createMessage",
  CREATE_NOTIFICATION: "createNotification",
};

export class LmsSocketService extends SocketIoService {
  protected lane: string | undefined;

  constructor(options: LmsOptionsInterface) {
    super({ ...options });
    this.lane = options.lane;
  }

  public async send(
    event: string,
    message: string,
    encrypt: boolean = true
  ): Promise<void> {
    const { ip } = this.getOptions();
    const encodedMessage = encrypt ? btoa(JSON.stringify(message)) : message;
    const url = `http://${ip}:${LMS_ENDPOINTS.PORT}/${LMS_ENDPOINTS.CREATE_NOTIFICATION}/${event}/${encodedMessage}`;

    try {
      const response = await axios.get(url);
      console.log("Response:", response.data);
    } catch (error) {
      console.error("Error sending message:", error);
    }
  }

  public async post(classification: string, payload: any): Promise<void> {
    const { ip } = this.getOptions();
    const url = `http://${ip}:${LMS_ENDPOINTS.PORT}/${LMS_ENDPOINTS.CREATE_MESSAGE}/${classification}`;
    console.log(`LmsSocketService post[${classification}] > data`, payload);

    try {
      const response = await axios.post(url, payload);
      console.log("Post response:", response.data);
    } catch (error) {
      console.error("Error in post:", error);
    }
  }

  // Simplified event handling methods
  public onMessage(
    callback: (message: LmsNotificationInterface) => void
  ): void {
    this.socket.on(LMS_EVENTS.MESSAGE, (data: any) => {
      const message = this.mapDataToTypedLmsMessage(data);
      callback(message);
    });
  }

  public onNotification(
    callback: (message: LmsNotificationInterface) => void
  ): void {
    this.socket.on(LMS_EVENTS.NOTIFICATION, (data: any) => {
      const message = this.mapDataToTypedLmsMessage(data);
      callback(message);
    });
  }

  public onEvent(
    eventName: string,
    callback: (data: any) => void,
    decrypt: boolean = false
  ): void {
    this.socket.on(eventName, (data: any) => {
      const message = this.mapDataToTypedLmsMessage(data);
      const decryptedMessage = decrypt ? this.decryptMessage(message) : message;
      callback(decryptedMessage);
    });
  }

  private encodeToBase64(message: string, enabled: boolean): string {
    return enabled ? btoa(JSON.stringify(message)) : message;
  }

  private decryptMessage(
    message: LmsNotificationInterface
  ): LmsNotificationInterface {
    if (
      message.data &&
      message.data.attributes &&
      message.data.attributes.payload
    ) {
      const { payload } = message.data.attributes;
      const decryptedPayload = JSON.parse(atob(payload));
      return {
        ...message,
        data: {
          ...message.data,
          attributes: {
            ...message.data.attributes,
            payload: decryptedPayload,
          },
        },
      };
    }
    return message;
  }

  private mapDataToTypedLmsMessage(data: any): LmsNotificationInterface {
    return data as LmsNotificationInterface;
  }
}
