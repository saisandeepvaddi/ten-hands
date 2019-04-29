import app from "./app";
import { createServer } from "http";

import socketIO from "socket.io";

async function startServer() {
  const port = app.get("port");
  const server = createServer(app);

  const io = socketIO(server);

  require("./socket")(io);

  server.listen(port, () => {
    console.log(`Server running on ${port}`);
  });
}

startServer();
