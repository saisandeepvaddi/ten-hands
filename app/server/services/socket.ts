import {
  default as socketIO,
  Namespace,
  Server as SocketIOServer,
  Socket,
} from "socket.io";
import { Server } from "http";
type SocketSource = "/desktop" | "/chrome-ext";

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
  socket: Socket;
  io: SocketIOServer;
  subscribers: ISocketListener[] = [];
  connectedNSPs: string[] = [];
  nspMap: Map<string, Namespace> = new Map();

  /**
   * Attaches http server to socket.io instance.
   * Also, attaches subscribers with their events and callabacks on new socket connection.
   *
   * @param {Server} server
   * @memberof SocketManager
   */
  public attachServer(server: Server) {
    const ioServer = new SocketIOServer(server, {
      cors: {
        origin: "*",
        methods: ["GET", "PUT", "POST", "PATCH", "DELETE", "OPTIONS"],
        credentials: true,
      },
    });

    const io = ioServer.of(/^\/(desktop|chrome-ext)$/);
    io.on("connection", (socket: Socket) => {
      console.log(`Socket: ${socket.nsp.name} connected.`);

      this.socket = socket;
      if (!this.connectedNSPs.includes(socket.nsp.name)) {
        this.connectedNSPs.push(socket.nsp.name);
      }

      const namespace = socket.nsp;
      const nspName = namespace.name;
      console.log(`Connected to socket with nsp: ${nspName}.`);
      this.nspMap.set(nspName, socket.nsp);

      this.subscribers.forEach((subscriber) => {
        this.socket.on(subscriber.event, subscriber.callback);
      });
      socket.on("disconnect", () => {
        console.log(`Disconnected ${socket.nsp.name}.`);
        this.nspMap.delete(socket.nsp.name);
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
      (x) => x.event === subscriber.event
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
    this.subscribers = this.subscribers.filter((x) => x.event !== event);
  }

  /**
   * Emits events back to client.
   *
   * @param {string} event Event name
   * @param {*} data Data to send to client
   * @memberof SocketManager
   */
  emit(event: string, data: any) {
    for (let [name, nsp] of this.nspMap) {
      nsp.emit(event, data);
    }
  }
}

export default SocketManager;
