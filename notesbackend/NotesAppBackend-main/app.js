import express from "express";
import path from "path";
import cors from "cors";
import noteRoute from "./Routes/note.route.js";
import uploadRoute from "./Routes/upload.route.js";
import { projectRoot } from "./config/paths.js";

const app = express();

app.use(
  cors({
    origin: process.env.CLIENT_URL || "http://localhost:5173",
  }),
);
app.use(express.json({ limit: "5mb" }));
app.use(express.urlencoded({ extended: true, limit: "5mb" }));
app.use("/uploads", express.static(path.join(projectRoot, "uploads")));

app.get("/api/health", (_req, res) => {
  res.status(200).json({ message: "Backend is running" });
});

app.use("/api/v1/notes", noteRoute);
app.use("/api/v1/uploads", uploadRoute);

app.use((_req, res) => {
  res.status(404).json({ message: "Route not found" });
});

app.use((error, _req, res, _next) => {
  console.error(error);

  if (error.code === "LIMIT_FILE_SIZE") {
    return res.status(413).json({
      message: "Each attachment must be 25 MB or smaller.",
    });
  }

  return res.status(error.statusCode || 500).json({
    message: error.message || "Internal server error",
  });
});

export default app;
