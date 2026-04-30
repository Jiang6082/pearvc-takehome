import { Router } from "express";
import { createNote, patchNote, removeNote } from "../controllers/notes.controller.js";
import { requireAuth } from "../middleware/auth.js";

export const notesRouter = Router();
notesRouter.use(requireAuth);
notesRouter.post("/", createNote);
notesRouter.patch("/:id", patchNote);
notesRouter.delete("/:id", removeNote);
