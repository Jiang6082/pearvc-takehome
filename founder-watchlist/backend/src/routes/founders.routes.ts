import { Router } from "express";
import { createFounder, getFounder, getFounders, patchFounder, removeFounder } from "../controllers/founders.controller.js";
import { requireAuth } from "../middleware/auth.js";

export const foundersRouter = Router();
foundersRouter.use(requireAuth);
foundersRouter.post("/", createFounder);
foundersRouter.get("/", getFounders);
foundersRouter.get("/:id", getFounder);
foundersRouter.patch("/:id", patchFounder);
foundersRouter.delete("/:id", removeFounder);
