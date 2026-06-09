// Logger Implementation — Local file logging with 7-day rotation
// CloudWatch removed (IAM permissions missing, not needed)
import path from "path";
import { format } from "date-fns";
import fs from "fs";
import chalk from "chalk";
import dotenv from "dotenv";
dotenv.config();

// Logger Configuration
const LOG_DIR = path.join(process.cwd(), "logs");
const MAX_LOG_FILES = 7; // Keep logs for last 7 days
const MAX_LOG_SIZE = 10 * 1024 * 1024; // 10MB per file

// Ensure logs directory exists on startup
try {
  if (!fs.existsSync(LOG_DIR)) {
    fs.mkdirSync(LOG_DIR, { recursive: true });
  }
} catch {}

export const logger = {
  getLogFile(): string {
    const date = format(new Date(), "yyyy-MM-dd");
    return path.join(LOG_DIR, `app-${date}.log`);
  },

  getErrorLogFile(): string {
    const date = format(new Date(), "yyyy-MM-dd");
    return path.join(LOG_DIR, `errors-${date}.log`);
  },

  async writeToFile(level: string, msg: string): Promise<void> {
    const timestamp = format(new Date(), "yyyy-MM-dd HH:mm:ss.SSS");
    const logEntry = `[${timestamp}] [${level}] ${msg}\n`;
    const logFile = this.getLogFile();

    try {
      // Check file size and rotate if needed
      if (fs.existsSync(logFile)) {
        const stats = fs.statSync(logFile);
        if (stats.size >= MAX_LOG_SIZE) {
          const rotatedFile = `${logFile}.${format(new Date(), "HHmmss")}`;
          fs.renameSync(logFile, rotatedFile);
        }
      }
      await fs.promises.appendFile(logFile, logEntry);

      // Also write errors to dedicated error log
      if (level === "ERROR" || level === "WARNING") {
        const errorFile = this.getErrorLogFile();
        await fs.promises.appendFile(errorFile, logEntry);
      }

      // Cleanup old logs periodically (1% chance per write)
      if (Math.random() < 0.01) {
        this.cleanupOldLogs();
      }
    } catch (error) {
      // Silently fail — don't spam console about log write failures
    }
  },

  async cleanupOldLogs(): Promise<void> {
    try {
      if (!fs.existsSync(LOG_DIR)) return;

      const files = await fs.promises.readdir(LOG_DIR);
      const now = Date.now();
      const maxAge = MAX_LOG_FILES * 24 * 60 * 60 * 1000;

      for (const file of files) {
        // Match app/error log files including the rotated size-cap variants
        // like `app-2026-05-01.log.091611` that the previous filter missed
        // (they don't end in .log — the timestamp suffix is appended after).
        const isLog =
          file.endsWith(".log") ||
          file.endsWith(".json") ||
          /\.log\.\d{6,}$/.test(file);
        if (!isLog) continue;
        // Don't delete tx-tracker files (they manage their own cleanup)
        if (file.startsWith("tx-tracker")) continue;

        const filePath = path.join(LOG_DIR, file);
        try {
          const stats = fs.statSync(filePath);
          if (now - stats.mtimeMs > maxAge) {
            await fs.promises.unlink(filePath);
          }
        } catch {
          continue;
        }
      }
    } catch {}
  },

  info: (msg: string) => {
    console.log(chalk.blue(`ℹ️ ${msg}`));
    logger.writeToFile("INFO", msg);
  },

  success: (msg: string) => {
    console.log(chalk.green(`✅ ${msg}`));
    logger.writeToFile("SUCCESS", msg);
  },

  warning: (msg: string) => {
    console.log(chalk.yellow(`⚠️ ${msg}`));
    logger.writeToFile("WARNING", msg);
  },

  error: (msg: string) => {
    console.log(chalk.red(`❌ ${msg}`));
    logger.writeToFile("ERROR", msg);
  },

  debug: (msg: string) => {
    console.log(chalk.gray(`🔍 ${msg}`));
    logger.writeToFile("DEBUG", msg);
  },
};
