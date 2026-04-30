import { Router } from "express";
import { getUpdates, mockIngest, patchUpdate, postUpdate } from "../controllers/updates.controller.js";
import { requireAuth } from "../middleware/auth.js";

export const updatesRouter = Router();
updatesRouter.use(requireAuth);
updatesRouter.get("/", getUpdates);
updatesRouter.post("/", postUpdate);
updatesRouter.patch("/:id", patchUpdate);
updatesRouter.post("/mock-ingest", mockIngest);
