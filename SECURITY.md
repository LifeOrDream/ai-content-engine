# Security Policy

## Supported Surface

This repo is early and pre-1.0. Security fixes are accepted for the latest `main` branch.

## Reporting A Vulnerability

Please do not open a public issue for vulnerabilities involving:

- API keys or provider credentials.
- AWS/S3/R2 storage access.
- Telegram or Discord tokens.
- Prompt injection that can expose secrets or private state.
- Unsafe generated command execution.
- Private production media or user data.

Report privately to the maintainers through GitHub security advisories when enabled, or contact the repo owner directly.

## Secret Handling

Never commit:

- `.env` files.
- FAL, Gemini, OpenAI, AWS, Telegram, Discord, or other provider keys.
- Signed upload/download URLs.
- Raw production logs containing tokens or private request payloads.
- Unredacted media manifests from private production runs.

Use `.env.example` for variable names only.
