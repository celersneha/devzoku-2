import { getHackathonTeamEmailQueue, closeQueue } from "../queues/queue";
import { teamRegToHackathonTemplate } from "../templates/teamRegToHackathon";
import { hackathonResultAnnouncementTemplate } from "../templates/HackathonWinnerAnnouncement";
import { ApiError } from "../utils/ApiError";
import { ApiResponse } from "../utils/ApiResponse";
import { asyncHandler } from "../utils/asyncHandler";
import transporter from "../utils/nodemailerUtility";

type TeamRegistrationJobData = {
  email: string;
  memberName: string;
  teamName: string;
  hackathonName: string;
  hackathonStartDate?: string;
  hackathonEndDate?: string;
  organizationName?: string;
  organizationEmail?: string;
};

type WinnerResultJobData = {
  email: string;
  captainName: string;
  teamName: string;
  hackathonName: string;
  organizationName: string;
  organizationEmail: string;
  position: "winner" | "firstRunnerUp" | "secondRunnerUp" | "participant";
};

const processEmailQueue = asyncHandler(async (req, res) => {
  const cronSecret = process.env.CRON_SECRET;

  if (!cronSecret) {
    throw new ApiError(500, "CRON_SECRET is not set in environment variables");
  }

  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    throw new ApiError(401, "Unauthorized");
  }

  const submittedSecret = authHeader.substring(7);
  if (submittedSecret !== cronSecret) {
    throw new ApiError(403, "Forbidden: Invalid secret");
  }

  const batchSizeRaw = Number(process.env.EMAIL_QUEUE_BATCH_SIZE || "100");
  const batchSize = Number.isNaN(batchSizeRaw)
    ? 100
    : Math.min(Math.max(batchSizeRaw, 1), 500);

  const queue = getHackathonTeamEmailQueue();
  const jobs = await queue.getWaiting(0, batchSize - 1);

  let processed = 0;
  let failed = 0;

  for (const job of jobs) {
    try {
      if (job.name === "team-registration") {
        const data = job.data as TeamRegistrationJobData;
        const message = teamRegToHackathonTemplate({
          memberName: data.memberName,
          teamName: data.teamName,
          hackathonName: data.hackathonName,
          hackathonStartDate: data.hackathonStartDate,
          hackathonEndDate: data.hackathonEndDate,
          organizationName: data.organizationName,
          organizationEmail: data.organizationEmail,
        });

        await transporter(
          data.organizationEmail || process.env.SMTP_EMAIL || "",
          data.organizationName || "DevZoku",
          data.email,
          `Team Registration Confirmation for ${data.teamName} at ${data.hackathonName}`,
          message,
        );
      } else if (job.name === "winner-result") {
        const data = job.data as WinnerResultJobData;
        const message = hackathonResultAnnouncementTemplate({
          captainName: data.captainName,
          teamName: data.teamName,
          hackathonName: data.hackathonName,
          organizationName: data.organizationName,
          organizationEmail: data.organizationEmail,
          position: data.position,
        });

        await transporter(
          data.organizationEmail || process.env.SMTP_EMAIL || "",
          data.organizationName || "DevZoku",
          data.email,
          `Hackathon Results for ${data.teamName} at ${data.hackathonName}`,
          message,
        );
      }

      await job.remove();
      processed += 1;
    } catch (error) {
      failed += 1;
      console.error(`Failed to process email queue job ${job.id}:`, error);
    }
  }

  const queue2 = getHackathonTeamEmailQueue();
  const queued = await queue2.count();
  await closeQueue();

  return res.status(200).json(
    new ApiResponse(
      200,
      {
        processed,
        failed,
        queued,
      },
      "Email queue processed",
    ),
  );
});

export { processEmailQueue };
