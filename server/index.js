const express = require("express");
const app = express();

app.use(express.json());

const port = process.env.PORT || 8989;
app.set("port", port);
app.listen(port, function() {
  console.log(`ten-hands server running at http://localhost:${port}.`);
});
