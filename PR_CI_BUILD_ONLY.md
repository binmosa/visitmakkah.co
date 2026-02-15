Add GitHub Actions CI to validate PRs via build only.

## What
- Runs on PRs to `master`
- Steps:
  - `npm ci`
  - `npx next build --webpack`

## Why
- Avoid running heavy builds locally
- Catch build-breaking changes before merge

## Notes
- This repo is Next.js v16; `next lint` command is not available, so this workflow is build-only for now.
