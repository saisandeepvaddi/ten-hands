import { createServer } from "http";
import app from "./app";

import socketIO from "socket.io";
import { JobManager } from "./services/job";
import SocketManager from "./socket";

export async function startServer() {
    return new Promise((res, rej) => {
        try {
            const port = app.get("port");
            const server = createServer(app);

            const io = socketIO(server);
            JobManager.getInstance().bindIO(io);
            server.listen(port, () => {
                console.log(`Server running on ${port}`);
                res(true);
            });
        } catch (err) {
            rej(err);
        }
    });
}

// startServer();
