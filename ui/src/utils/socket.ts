class JobSocket {
  public static getInstance() {
    return JobSocket._instance || new JobSocket();
  }

  public static bindSocket(socket: any) {
    if (JobSocket.socket) {
      JobSocket.socket.destroy();
      JobSocket.socket = null;
    }
    socket.on(`disconnect`, () => {
      console.log(`Disconnecting: `);
    });
    JobSocket.socket = socket;
  }

  public static getSocket() {
    return JobSocket.socket;
  }
  private static _instance: JobSocket;
  private static socket: any = null;
}

export default JobSocket;
