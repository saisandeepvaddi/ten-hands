import app from "./app";

const http = require("http").Server(app);

const io = require("socket.io")(http);

const port = app.get("port");

http.listen(port, function() {
  console.log("listening on " + port);
});

require("./socket")(io);
