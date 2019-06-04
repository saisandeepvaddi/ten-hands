/* global io */

let procId = "";

// function start() {
//   const socket = io();

//   const client = feathers();

//   client.configure(feathers.socketio(socket));
//   const command = "node functions.js";
// }

function stop() {}

function ab2str(buf) {
  return String.fromCharCode.apply(null, new Uint16Array(buf));
}

$(document).ready(function() {
  $("#start").on("click", e => {
    const socket = io.connect("http://localhost:5010");

    socket.emit("start", { command: "node ./src/functions.js" });
    // socket.emit("start", { command: "echo sai" });

    // socket.on("news", function(data) {
    //   console.log(data);
    //   // socket.emit('my other event', { my: 'data' });
    // });
    socket.on("result", function(result) {
      console.log(result);
      $(".console").append(`<div>${result}</div>`);
    });
    // fetch("http://localhost:1234/kill")
    //   .then(response => response.body)
    //   .then(rs => {
    //     const reader = rs.getReader();
    //     return new ReadableStream({
    //       async start(controller) {
    //         while (true) {
    //           const { done, value } = await reader.read();
    //           // When no more data needs to be consumed, break the reading
    //           if (done) {
    //             break;
    //           }
    //           // Enqueue the next data chunk into our target stream
    //           controller.enqueue(value);
    //         }
    //         // Close the stream
    //         controller.close();
    //         reader.releaseLock();
    //       }
    //     });
    //   })
    //   // Create a new response out of the stream
    //   .then(rs => new Response(rs))
    //   // Create an object URL for the response
    //   .then(res => {
    //     return res.text();
    //   })
    //   .then(res => {
    //     $(".console").text(res);
    //   });
    //   .catch(console.error);
    // let httpAdapter = "axios/lib/adapters/http";
    // axios({
    //   method: "get",
    //   url: "http://localhost:1234/kill",
    //   responseType: "stream"
    //   // adapter: httpAdapter
    // }).then(function(response) {
    //   // response.data.pipe(fs.createWriteStream('ada_lovelace.jpg'))
    //   console.log(response.data);
    // });
  });
});
