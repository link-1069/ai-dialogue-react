# ai-dialogue-react Copilot Instructions

This workspace publishes the npm package `ai-dialogue-react`.

When the user asks to update or publish the npm package, follow this workflow:

1. Inspect `package.json` and determine the current package version.
2. Ask for or infer the intended release type only when it is not explicit:
   - `patch` for fixes or packaging-only changes
   - `minor` for backward-compatible features
   - `major` for breaking changes
3. Update the version in `package.json` before publishing.
4. Build the library with `pnpm run build:lib`.
5. Publish with `npm publish --access public` from the workspace root.
6. If npm rejects publishing because of 2FA, request either:
   - an npm token that supports publish with 2FA bypass, or
   - a one-time password for `npm publish --otp=XXXXXX`

Project-specific rules:

- Package name: `ai-dialogue-react`
- Library entry: `src/index.ts`
- Library build config: `vite.lib.config.ts`
- Publishable output: `dist/`
- Do not publish unless the version has been updated for the new release.
- Prefer the smallest valid version bump.
- Before publishing, avoid unrelated source edits.
- After publishing, report the final package name and version.

When the user asks for an npm package update, prefer doing the work directly instead of only explaining the steps.