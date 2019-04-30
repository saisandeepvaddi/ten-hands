import express from "express";
import cors from "cors";
import path from "path";
import projectRoutes from "./routes/projects";
import bodyParser from "body-parser";

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());
app.set("port", process.env.PORT || 1010);
app.use(express.static(path.join(__dirname, "public")));

// Routes
app.use("/projects", projectRoutes);

// Default Error Handler
app.use(function(error, req, res, next) {
  console.error(error.stack);
  return res.status(500).send({ error });
});

export default app;
