import express from "express";
import cors from "cors";
import path from "path";
import projectRoutes from "./routes/projects";
import utilsRoutes from "./routes/utilities";
import bodyParser from "body-parser";
import { existsSync } from "fs";
import handler from "serve-handler";

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());

app.use(express.static(path.join(__dirname, "public")));

app.use("/projects", projectRoutes);
app.use("/utils", utilsRoutes);

app.get("/___serve-ui", async (req, res) => {
  let publicPath = path.resolve(__dirname, "..", "ui");
  console.log("publicPath:", publicPath);
  if (existsSync(publicPath)) {
    return await handler(req, res, {
      public: publicPath
    });
  }
  res.status(400).send("Did not find UI files.");
});

// Default Error Handler
app.use(function(error, req, res, next) {
  console.error(error.stack);

  return res.status(500).send({ error });
});

process.on("uncaughtException", function(err) {
  console.error(err);
  console.log("Node NOT Exiting...");
});

process.on("SIGINT", function(signal) {
  console.warn(`Server being killed with ${signal}`);
  process.exit(0);
});

process.on("exit", function(code) {
  console.warn("Ten Hands server exising with code: " + code);
});

export default app;
