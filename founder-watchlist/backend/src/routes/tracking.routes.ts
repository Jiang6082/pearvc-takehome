import { Router } from "express";
import { createTracking, getMyTracking, patchTracking, postMarkContacted, removeTracking } from "../controllers/tracking.controller.js";
import { requireAuth } from "../middleware/auth.js";

export const trackingRouter = Router();
trackingRouter.use(requireAuth);
trackingRouter.post("/", createTracking);
trackingRouter.get("/me", getMyTracking);
trackingRouter.patch("/:id", patchTracking);
trackingRouter.delete("/:id", removeTracking);
trackingRouter.post("/:id/mark-contacted", postMarkContacted);
