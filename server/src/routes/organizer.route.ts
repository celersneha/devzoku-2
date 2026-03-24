import { Router } from "express";
import {
  completeOrganizerProfile,
  fetchHackathonsOrganized,
  fetchOrganizerProfile,
} from "../controllers/organizer.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

import { upload } from "../utils/Cloudinary.js";
const router = Router();

// Protected route
router.post("/complete-profile", verifyJWT, completeOrganizerProfile);
router.get("/organized-hackathons/:id", fetchHackathonsOrganized);

// unprotected route
router.get("/profile/:id", fetchOrganizerProfile);

export default router;
