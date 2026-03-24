import Router from "express";
import {
  applyToHackathon,
  createHackathon,
  embedHackathons,
  getUpcomingHackathons,
  markWinners,
  viewAllHackathons,
  viewHackathonById,
} from "../controllers/hackathon.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { upload } from "../utils/Cloudinary.js";

const router = Router();

// protected routes
router.post("/apply-to-hackathon", verifyJWT, applyToHackathon);
router.post(
  "/create-hackathon",
  verifyJWT,
  upload.single("poster"),
  createHackathon,
);
router.get("/view-all-hackathons-auth", verifyJWT, viewAllHackathons);
router.get("/hackathon-auth/:id", verifyJWT, viewHackathonById);
router.post("/mark-winners", verifyJWT, markWinners);

// unprotected routes
router.get("/view-all-hackathons", viewAllHackathons);
router.get("/hackathon/:id", viewHackathonById);
router.get("/upcoming-hackathons", getUpcomingHackathons);

//cron routes
router.post("/embed-hackathons", embedHackathons);
router.get("/embed-hackathons", embedHackathons);

export default router;
