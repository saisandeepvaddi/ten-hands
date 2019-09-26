import socketIO, { Socket } from "socket.io";
import { Server } from "http";

export interface ISocketListener {
  readonly event: string;
  callback: (options: any) => void;
}

/**
 * Service Class to manage SocketIO things
 *
 * @class SocketManager
 */
class SocketManager {
  private static _instance: SocketManager;
  socket: Socket = null;
  io: any = null;
  subscribers: ISocketListener[] = [];

  /**
   * Attaches http server to socket.io instance.
   * Also, attaches subscribers with their events and callabacks on new socket connection.
   *
   * @param {Server} server
   * @memberof SocketManager
   */
  public attachServer(server: Server) {
    const io = socketIO(server);
    io.on("connection", socket => {
      this.socket = socket;
      console.log("Connected to socket");
      this.subscribers.forEach(subscriber => {
        this.socket.on(subscriber.event, subscriber.callback);
      });
    });

    io.on("disconnect", () => {
      console.log("Disconnecting: ", this.socket.id);
    });
  }

  /**
   * Creates and returns singleton instance of SocketManager
   *
   * @static
   * @returns {SocketManager}
   * @memberof SocketManager
   */
  public static getInstance(): SocketManager {
    return this._instance || (this._instance = new this());
  }

  /**
   * Subsribe to socket.io with an event and callback
   *
   * @param {ISocketListener} subscriber
   * @memberof SocketManager
   */
  subscribe(subscriber: ISocketListener): void {
    const isAlreadyThere = this.subscribers.find(
      x => x.event === subscriber.event
    );
    if (isAlreadyThere) {
      throw new Error(
        `Socket subscriber for event ${subscriber.event} is already registered`
      );
    }
    this.subscribers = [...this.subscribers, subscriber];
  }

  /**
   * Unsubscribe from SocketManager subscriber list
   *
   * @param {string} event
   * @memberof SocketManager
   */
  unsubscribe(event: string): void {
    this.subscribers = this.subscribers.filter(x => x.event !== event);
  }

  /**
   * Emits events back to client.
   *
   * @param {string} event Event name
   * @param {*} data Data to send to client
   * @memberof SocketManager
   */
  emit(event: string, data: any) {
    this.socket.emit(event, data);
  }
}

export default SocketManager;
