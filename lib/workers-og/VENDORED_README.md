# Vendored workers-og Library

This directory contains a vendored (locally copied) version of the `workers-og` library from https://github.com/kvnang/workers-og.

## Why Vendored?

We vendored this library to fix a critical concurrent initialization issue that was causing the following error when multiple requests hit the worker simultaneously:

```
Error: Already initialized. The `initWasm()` function can be used only once.
```

## What Was Changed?

The main change is in `packages/workers-og/src/og.ts`:

- Added module-level promise tracking for WASM initialization
- Changed `initResvgWasm()` and `initYogaWasm()` to use singleton pattern
- Made the initialization safe for concurrent requests

## Working with This Vendored Library

### Checking for Upstream Updates

```bash
# Fetch the latest changes from upstream
git fetch workers-og-upstream main

# See what files changed upstream
git diff HEAD..workers-og-upstream/main -- lib/workers-og/

# See commit history
git log HEAD..workers-og-upstream/main --oneline
```

### Updating from Upstream

If you want to incorporate upstream changes:

```bash
# Option 1: Cherry-pick specific commits
git cherry-pick <commit-hash>

# Option 2: Manual merge (recommended)
# Create a temporary branch to review changes
git checkout -b temp-upstream-review
git checkout workers-og-upstream/main -- lib/workers-og/
# Review changes, reapply our fixes to og.ts
git diff main
# When satisfied, merge back
git checkout main
git merge temp-upstream-review
```

### Our Specific Changes

The concurrent initialization fix in `packages/workers-og/src/og.ts`:

```typescript
// Added these module-level variables
let resvgInitialization: Promise<void> | undefined;
let yogaInitialization: Promise<void> | undefined;

// Modified initialization functions to use singleton pattern
const initResvgWasm = () => {
	if (resvgInitialization) return resvgInitialization;
	// ... initialization logic
};
```

## Important Notes

- The TypeScript path alias in `/tsconfig.json` maps `workers-og` to this vendored version
- WASM files in `packages/workers-og/vendors/` are required for the library to work
- The main entry point is `packages/workers-og/src/index.ts`
- Dependencies are managed in the root `package.json` (not the vendored one)
