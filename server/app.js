const express = require("express");
const app = express();
const cors = require("cors");
const path = require("path");

app.use(cors());
app.set("port", process.env.PORT || 1010);
app.use(express.static(path.join(__dirname, "public")));

module.exports = app;
