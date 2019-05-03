import app from "./app";
import { createServer } from "http";

import socketIO from "socket.io";
import SocketManager from "./socket";
import { JobManager } from "./services/job";

async function startServer() {
  const port = app.get("port");
  const server = createServer(app);

  const io = socketIO(server);
  JobManager.getInstance().bindIO(io);
  server.listen(port, () => {
    console.log(`Server running on ${port}`);
  });
}

startServer();
