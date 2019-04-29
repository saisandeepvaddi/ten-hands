import express from "express";
import cors from "cors";
import path from "path";

const app = express();
app.use(cors());
app.set("port", process.env.PORT || 1010);
app.use(express.static(path.join(__dirname, "public")));

export default app;
