import { createServer } from "http";
import app from "./app";

import socketIO from "socket.io";
import { JobManager } from "./services/job";
import { getConfig } from "./setupConfig";

export async function startServer() {
  const config = await getConfig();
  return new Promise((res, rej) => {
    try {
      const port = config.port || process.env.PORT || 1010;

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
