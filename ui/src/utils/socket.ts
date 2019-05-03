class JobSocket {
    public static getInstance() {
        return JobSocket._instance || new JobSocket();
    }

    public static bindSocket(socket: any) {
        JobSocket.socket = socket;
    }

    public static getSocket() {
        return JobSocket.socket;
    }
    private static _instance: JobSocket;
    private static socket: any;
}

export default JobSocket;
