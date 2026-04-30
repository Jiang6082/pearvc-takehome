import { Router } from "express";
import { getTags, postTag } from "../controllers/tags.controller.js";
import { requireAuth } from "../middleware/auth.js";

export const tagsRouter = Router();
tagsRouter.use(requireAuth);
tagsRouter.get("/", getTags);
tagsRouter.post("/", postTag);
