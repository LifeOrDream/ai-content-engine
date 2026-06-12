/**
 * Side-effect env shim for acceptance scripts: load .env and accept FAL_KEY
 * as an alias for FAL_API_KEY BEFORE any engine module captures env at load.
 * Never logs values.
 */
import "dotenv/config";

if (!process.env.FAL_API_KEY && process.env.FAL_KEY) {
  process.env.FAL_API_KEY = process.env.FAL_KEY;
}
