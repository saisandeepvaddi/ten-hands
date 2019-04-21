module.exports = function(io) {
  const execa = require("execa");
  const kill = require("tree-kill");

  io.on("connection", function(socket) {
    // socket.emit('news', { hello: 'world' });
    socket.on("start", function(data) {
      const command = data.command;
      console.log("command:", command, command.indexOf("node"));
      const n = execa(command);
      n.stdout.on("data", function(chunk) {
        socket.emit("result", chunk.toString());
      });

      n.stderr.on("data", function(chunk) {
        socket.emit("result", chunk.toString());
      });

      n.on("close", function(code, signal) {
        socket.emit("result", `Exited with code ${code} by signal ${signal}`);
      });

      n.on("exit", function(code, signal) {
        socket.emit("result", `Exited with code ${code} by signal ${signal}`);
      });

      setTimeout(() => {
        console.log("Attempt Kill");

        kill(n.pid);
      }, 10000);
    });
  });
};
