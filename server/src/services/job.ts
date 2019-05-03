import { v4 as uuid } from "uuid";
import execa from "execa";
import pKill from "tree-kill";
import io from "socket.io";

enum EventTypes {
  SUBSCRIBE,
  UNSUBSCRIBE
}

export class JobManager {
  public static _instance: JobManager;
  io: any;
  socket: any;
  private constructor() {}

  private bindEvents() {
    this.socket.on(EventTypes.SUBSCRIBE, ({ job, room }) => {
      console.log(`${job} joining room ${room}`);
    });

    this.socket.on(EventTypes.UNSUBSCRIBE, ({ job, room }) => {
      console.log(`${job} leaving room ${room}`);
    });
  }

  public bindIO(io: any) {
    if (!this.io) {
      this.io = io;
    }
    this.io.on("connection", socket => {
      console.log(`Client connected to socket`);

      this.socket = socket;
      this.bindEvents();
    });
  }
  public static getInstance() {
    return this._instance || new this();
  }
}

class Job implements IJob {
  _id?: string;
  pid: number;
  status: JobStatus;
  command: IProjectCommand;
  createdAt: Date;
  // Room of socket. Each Job will get a room with the name of id
  room: any;
  manager: JobManager;
  constructor(command: IProjectCommand) {
    // Pass a command to create Job
    const id = uuid();
    this._id = id;
    this.room = id;
    this.command = command;
    this.manager = JobManager.getInstance();
  }

  start(): number {
    this.createdAt = new Date();

    return 0;
  }

  kill(): number {
    pKill(this.pid);
    return 0;
  }
}

export default Job;
