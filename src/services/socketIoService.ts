/* eslint-disable @typescript-eslint/no-explicit-any */
import { Socket } from 'socket.io';
import * as io from 'socket.io-client';

interface SocketIoConfig {
  port?: string;
  reconnect?: boolean;
  reconnectDelay?: number;
}

const defaultConfig: SocketIoConfig = {
  port: '22599',
  reconnect: true,
  reconnectDelay: 60,
};

interface SocketIoOptions extends SocketIoConfig {
  ip: string;
}

const IO_EVENTS = {
  CONNECT: 'connect',
  CONNECT_ERROR: 'connect_error',
  RECONNECTING: 'reconnecting',
  RECONNECT_FAILED: 'reconnect_failed',
};

export class SocketIoService {
  protected options: SocketIoOptions;
  protected socket: Socket;
  protected subscriptions = {};

  constructor(options: SocketIoOptions) {
    this.update(options);
  }

  public update(options: SocketIoOptions) {
    if (this.socket) {
      this.socket.disconnect();
    }
    this.options = { ...defaultConfig, ...options };
    const { ip, port, reconnect, reconnectDelay } = this.options;
    this.socket = io.connect(`${ip}:${port}`, {
      reconnect,
      'reconnection delay': reconnectDelay,
    });
  }

  public getOptions() {
    return this.options;
  }

  public onConnect(callback: () => void) {
    this.socket.on(IO_EVENTS.CONNECT, () => {
      const { ip } = this.options;
      console.info(`socket.io-client connected to ${ip}`);
      callback();
    });
  }

  public onReconnecting(callback: () => void) {
    this.socket.on(IO_EVENTS.RECONNECTING, () => {
      const { ip } = this.options;
      console.info(`socket.io-client reconnecting to ${ip}`);
      callback();
    });
  }

  public onConnectError(callback: (error: any) => void) {
    this.socket.on(IO_EVENTS.CONNECT_ERROR, (error) => {
      console.error('socket.io-client connection error', error);
      callback(error);
    });
  }

  public onReconnectFailed(callback: () => void) {
    this.socket.on(IO_EVENTS.RECONNECT_FAILED, () => {
      console.error('socket.io-client reconnection failed');
      callback();
    });
  }

  public on(eventName: string, callback: (data: any) => void) {
    if (!this.subscriptions[eventName]) {
      this.socket.on(eventName, (data) => {
        console.log(`socket.io-client event[${eventName}]`, data);
        callback(data);
      });
      this.subscriptions[eventName] = true; // Just to remember the subscription
    }
  }
}
