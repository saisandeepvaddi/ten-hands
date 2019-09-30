import express from "express";
import cors from "cors";
import path from "path";
import projectRoutes from "./routes/projects";
import utilsRoutes from "./routes/utilities";
import bodyParser from "body-parser";

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());
app.use(express.static(path.join(__dirname, "public")));

app.use("/projects", projectRoutes);
app.use("/utils", utilsRoutes);

// Default Error Handler
app.use(function(error, req, res, next) {
  console.error(error.stack);

  return res.status(500).send({ error });
});

process.on("uncaughtException", function(err) {
  console.error(err);
  console.log("Node NOT Exiting...");
});

export default app;
