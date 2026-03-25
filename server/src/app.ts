import express from "express";

import cors from "cors";
import cookieParser from "cookie-parser";

import userRoutes from "./routes/user.route.js";
import developerRoutes from "./routes/developer.route.js";
import teamRoutes from "./routes/team.route.js";
import hackathonRoutes from "./routes/hackathon.route.js";
import organizerRoutes from "./routes/organizer.route.js";
import internalRoutes from "./routes/internal.route.js";
import errorMiddleware from "./middlewares/error.middleware.js";

const app = express();

const allowedOrigins = (process.env.CORS_ORIGIN || "")
  .split(",")
  .map((origin) => origin.trim())
  .filter(Boolean);

app.use(
  cors({
    origin: allowedOrigins,
    credentials: true,
  }),
);
app.use(cookieParser());
app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true, limit: "16kb" }));

app.use(express.static("public"));

const getHealthResponse = () => ({
  ok: true,
  service: "devzoku-server",
  timestamp: new Date().toISOString(),
});

app.get("/health", (req, res) => {
  res.status(200).json(getHealthResponse());
});

app.get("/", (req, res) => {
  res.status(200).json(getHealthResponse());
});

// authorization routes
app.use("/developer/authorization", userRoutes);
app.use("/organizer/authorization", userRoutes);

// main application routes
app.use("/users", userRoutes);
app.use("/developer", developerRoutes);
app.use("/organizer", organizerRoutes);
app.use("/hackathon", hackathonRoutes);
app.use("/team", teamRoutes);
app.use("/internal", internalRoutes);

app.use(errorMiddleware);

export { app };
export default app;
