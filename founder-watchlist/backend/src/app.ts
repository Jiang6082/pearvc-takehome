import cors from "cors";
import express from "express";
import { ZodError } from "zod";
import { authRouter } from "./routes/auth.routes.js";
import { foundersRouter } from "./routes/founders.routes.js";
import { trackingRouter } from "./routes/tracking.routes.js";
import { updatesRouter } from "./routes/updates.routes.js";
import { notesRouter } from "./routes/notes.routes.js";
import { tagsRouter } from "./routes/tags.routes.js";
import { errorHandler } from "./middleware/errorHandler.js";

export const app = express();

app.use(cors({ origin: process.env.FRONTEND_URL || "http://localhost:5173" }));
app.use(express.json());

app.get("/health", (_req, res) => res.json({ ok: true }));
app.use("/api/auth", authRouter);
app.use("/api/founders", foundersRouter);
app.use("/api/tracking", trackingRouter);
app.use("/api/updates", updatesRouter);
app.use("/api/notes", notesRouter);
app.use("/api/tags", tagsRouter);

app.use((err: Error, req: express.Request, res: express.Response, next: express.NextFunction) => {
  if (err instanceof ZodError) {
    return res.status(400).json({ message: "Validation error", issues: err.flatten() });
  }
  return errorHandler(err, req, res, next);
});
