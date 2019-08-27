import { createServer } from "http";
import app from "./app";

import socketIO from "socket.io";
import { JobManager } from "./services/job";
import { getConfig } from "../shared/config";


/**
 * Starts Node server for ten-hands project.
 * This is the starting point of the backend.
 *
 * @export
 * @returns
 */
export async function startServer() {
  return new Promise(async (res, rej) => {
    try {
      const port = process.env.PORT || getConfig().port || 5010;

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
