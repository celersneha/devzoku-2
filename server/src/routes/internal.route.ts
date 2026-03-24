import Router from "express";
import { processEmailQueue } from "../controllers/internal.controller";

const router = Router();

router.get("/process-email-queue", processEmailQueue);
router.post("/process-email-queue", processEmailQueue);

export default router;
