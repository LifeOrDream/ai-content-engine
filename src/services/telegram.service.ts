/**
 * Telegram Notification Service for NFT Minting and Asset Generation
 *
 * Sends formatted notifications to the founder via Telegram for:
 * - NFT minting events
 * - Asset generation queue updates
 * - Image generation results (with images)
 * - Validation results
 * - Job completion
 */

import axios from "axios";
import { logger } from "../utils/logger.js";

// ============================================================================
// CONFIGURATION
// ============================================================================

// Use the NFTs-specific bot for asset generation notifications
const TELEGRAM_BOT_TOKEN =
  process.env.TELEGRAM_NFTS_BOT || process.env.TELEGRAM_BOT_TOKEN;
const TELEGRAM_CHAT_ID = process.env.TELEGRAM_CHAT_ID;

const TELEGRAM_API_BASE = `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}`;

// Solana explorer base URL for transaction links
const SOLSCAN_BASE = "https://solscan.io/tx";

// ============================================================================
// TYPES
// ============================================================================

export interface NFTMintedNotification {
  mint: string;
  name: string;
  txSignature: string;
  buyerAddress: string;
  priceSOL: number;
  priceUSD?: number;
  queuePosition: number;
  totalInQueue: number;
  factionName: string;
  typeName: string;
}

export interface JobStartedNotification {
  jobId: string;
  mint: string;
  name: string;
  queuePosition: number;
  remainingJobs: number;
  factionName: string;
}

export interface ImageGeneratedNotification {
  jobId: string;
  mint: string;
  name: string;
  imageType: "full_body" | "dp";
  attempt: number;
  maxAttempts: number;
  imageUrl: string;
}

export interface ValidationResultNotification {
  jobId: string;
  mint: string;
  name: string;
  imageType: "full_body" | "dp";
  passed: boolean;
  attempt: number;
  reason?: string;
}

export interface JobCompletedNotification {
  jobId: string;
  mint: string;
  name: string;
  fullBodyUrl: string;
  dpUrl: string;
  processingTimeMs: number;
  factionName: string;
  typeName: string;
}

export interface JobFailedNotification {
  jobId: string;
  mint: string;
  name: string;
  error: string;
  attempt: number;
  maxAttempts: number;
}

// ============================================================================
// CORE TELEGRAM FUNCTIONS
// ============================================================================

/**
 * Check if Telegram is configured
 */
export function isTelegramConfigured(): boolean {
  return !!(TELEGRAM_BOT_TOKEN && TELEGRAM_CHAT_ID);
}

/**
 * Send a text message via Telegram
 */
export async function sendTelegramMessage(
  message: string,
  options: {
    parseMode?: "Markdown" | "HTML";
    disablePreview?: boolean;
    silent?: boolean;
  } = {},
): Promise<boolean> {
  if (!isTelegramConfigured()) {
    logger.debug("Telegram not configured, skipping notification");
    return false;
  }

  const {
    parseMode = "Markdown",
    disablePreview = false,
    silent = false,
  } = options;

  try {
    await axios.post(
      `${TELEGRAM_API_BASE}/sendMessage`,
      {
        chat_id: TELEGRAM_CHAT_ID,
        text: message,
        parse_mode: parseMode,
        disable_web_page_preview: disablePreview,
        disable_notification: silent,
      },
      { timeout: 10000 },
    );
    return true;
  } catch (error: any) {
    logger.warning(`Telegram message failed: ${error.message}`);
    return false;
  }
}

/**
 * Send a photo via Telegram
 */
export async function sendTelegramPhoto(
  photoUrl: string,
  caption: string,
  options: {
    parseMode?: "Markdown" | "HTML";
    silent?: boolean;
  } = {},
): Promise<boolean> {
  if (!isTelegramConfigured()) {
    logger.debug("Telegram not configured, skipping photo notification");
    return false;
  }

  const { parseMode = "Markdown", silent = false } = options;

  try {
    await axios.post(
      `${TELEGRAM_API_BASE}/sendPhoto`,
      {
        chat_id: TELEGRAM_CHAT_ID,
        photo: photoUrl,
        caption: caption.substring(0, 1024), // Telegram caption limit
        parse_mode: parseMode,
        disable_notification: silent,
      },
      { timeout: 30000 }, // Longer timeout for photos
    );
    return true;
  } catch (error: any) {
    logger.warning(`Telegram photo failed: ${error.message}`);
    // Fallback to text message with link
    return await sendTelegramMessage(
      `${caption}\n\n🖼 [View Image](${photoUrl})`,
      { disablePreview: false },
    );
  }
}

/**
 * Send a video via Telegram (by public URL — Telegram fetches it).
 */
export async function sendTelegramVideo(
  videoUrl: string,
  caption: string,
  options: {
    parseMode?: "Markdown" | "HTML";
    silent?: boolean;
  } = {},
): Promise<boolean> {
  if (!isTelegramConfigured()) {
    logger.debug("Telegram not configured, skipping video notification");
    return false;
  }
  const { parseMode = "Markdown", silent = false } = options;
  try {
    await axios.post(
      `${TELEGRAM_API_BASE}/sendVideo`,
      {
        chat_id: TELEGRAM_CHAT_ID,
        video: videoUrl,
        caption: caption.substring(0, 1024),
        parse_mode: parseMode,
        disable_notification: silent,
        supports_streaming: true,
      },
      { timeout: 60000 },
    );
    return true;
  } catch (error: any) {
    logger.warning(`Telegram video failed: ${error.message}`);
    // Fallback to a text message with the link.
    return await sendTelegramMessage(`${caption}\n\n🎬 [View Video](${videoUrl})`, {
      disablePreview: false,
    });
  }
}

// ============================================================================
// NFT NOTIFICATION FUNCTIONS
// ============================================================================

/**
 * Notify when an NFT is minted and queued for asset generation
 */
export async function notifyNFTMinted(
  data: NFTMintedNotification,
): Promise<void> {
  const txLink = `${SOLSCAN_BASE}/${data.txSignature}`;
  const shortMint = `${data.mint.substring(0, 4)}...${data.mint.substring(data.mint.length - 4)}`;

  const priceDisplay = data.priceUSD
    ? `${data.priceSOL.toFixed(4)} SOL (~$${data.priceUSD.toFixed(2)})`
    : `${data.priceSOL.toFixed(4)} SOL`;

  const message = `
🎉 *NFT MINTED*

🐕 *${data.name}*
📍 Mint: \`${shortMint}\`

💰 *Price:* ${priceDisplay}
👤 *Buyer:* \`${data.buyerAddress.substring(0, 8)}...\`

🏴 *Faction:* ${data.factionName}
👔 *Type:* ${data.typeName}

📋 *Queue Position:* #${data.queuePosition} of ${data.totalInQueue}

🔗 [View Transaction](${txLink})
`.trim();

  await sendTelegramMessage(message);
}

/**
 * Notify when a job starts processing
 */
export async function notifyJobStarted(
  data: JobStartedNotification,
): Promise<void> {
  const shortMint = `${data.mint.substring(0, 4)}...${data.mint.substring(data.mint.length - 4)}`;

  const message = `
⚙️ *JOB STARTED*

🐕 *${data.name}* (\`${shortMint}\`)
🏴 ${data.factionName}

🔄 Processing job...
📊 *${data.remainingJobs}* jobs remaining in queue
`.trim();

  await sendTelegramMessage(message, { silent: true });
}

/**
 * Notify with generated image
 */
export async function notifyImageGenerated(
  data: ImageGeneratedNotification,
): Promise<void> {
  const shortMint = `${data.mint.substring(0, 4)}...${data.mint.substring(data.mint.length - 4)}`;
  const imageTypeLabel =
    data.imageType === "full_body" ? "Full Body" : "Display Picture";

  const caption = `
🖼 *${imageTypeLabel} Generated*

🐕 *${data.name}* (\`${shortMint}\`)
🔄 Attempt ${data.attempt}/${data.maxAttempts}

⏳ Validating...
`.trim();

  await sendTelegramPhoto(data.imageUrl, caption, { silent: true });
}

/**
 * Notify validation result
 */
export async function notifyValidationResult(
  data: ValidationResultNotification,
): Promise<void> {
  const shortMint = `${data.mint.substring(0, 4)}...${data.mint.substring(data.mint.length - 4)}`;
  const imageTypeLabel =
    data.imageType === "full_body" ? "Full Body" : "Display Picture";

  const statusEmoji = data.passed ? "✅" : "❌";
  const statusText = data.passed ? "PASSED" : "FAILED";

  const message = `
${statusEmoji} *${imageTypeLabel} Validation ${statusText}*

🐕 *${data.name}* (\`${shortMint}\`)
🔄 Attempt ${data.attempt}
${data.reason ? `📝 ${data.reason}` : ""}
${!data.passed ? "🔁 Regenerating..." : ""}
`.trim();

  await sendTelegramMessage(message, { silent: true });
}

/**
 * Notify when a job completes successfully
 */
export async function notifyJobCompleted(
  data: JobCompletedNotification,
): Promise<void> {
  const shortMint = `${data.mint.substring(0, 4)}...${data.mint.substring(data.mint.length - 4)}`;
  const processingTime = (data.processingTimeMs / 1000).toFixed(1);

  // Send final full body image with completion message
  const caption = `
✅ *JOB COMPLETED*

🐕 *${data.name}* (\`${shortMint}\`)
🏴 ${data.factionName} | ${data.typeName}

⏱ Processing time: ${processingTime}s

🖼 Full Body: [View](${data.fullBodyUrl})
👤 Display Pic: [View](${data.dpUrl})
`.trim();

  await sendTelegramPhoto(data.fullBodyUrl, caption);
}

/**
 * Notify when a job fails
 */
export async function notifyJobFailed(
  data: JobFailedNotification,
): Promise<void> {
  const shortMint = `${data.mint.substring(0, 4)}...${data.mint.substring(data.mint.length - 4)}`;

  const message = `
❌ *JOB FAILED*

🐕 *${data.name}* (\`${shortMint}\`)
🔄 Attempt ${data.attempt}/${data.maxAttempts}

⚠️ *Error:* ${data.error}
`.trim();

  await sendTelegramMessage(message);
}

/**
 * Notify queue status update
 */
export async function notifyQueueStatus(
  totalJobs: number,
  completedJobs: number,
  failedJobs: number,
): Promise<void> {
  const message = `
📊 *Queue Status Update*

✅ Completed: ${completedJobs}
❌ Failed: ${failedJobs}
📋 Remaining: ${totalJobs - completedJobs - failedJobs}
📦 Total: ${totalJobs}
`.trim();

  await sendTelegramMessage(message, { silent: true });
}

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

/**
 * Escape special characters for Markdown
 */
export function escapeMarkdown(text: string): string {
  return text.replace(/[_*[\]()~`>#+=|{}.!-]/g, "\\$&");
}

/**
 * Format SOL amount
 */
export function formatSOL(lamports: number): string {
  const sol = lamports / 1e9;
  return sol.toFixed(4);
}
