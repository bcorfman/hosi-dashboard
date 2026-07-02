# AGENTS.md for hosi-dashboard

## Project Guidelines

### TDD Requirement
All implementation changes should be TDD-driven. For dashboard changes, start with the smallest failing unit or integration test, then add Storybook coverage for user-visible components where practical, then add or update Playwright smoke coverage for user-facing flows.

### Completion Verification
Before reporting code changes as complete:
- Run unit tests for the affected frontend/backend area.
- Run Storybook-backed rendering tests for affected frontend components.
- Run Playwright Chromium smoke E2E for user-visible frontend flows.

For non-UI-only changes, E2E is still required when the change affects app boot, API integration, navigation, or dashboard rendering.

If a tool or environment limitation prevents one of these checks, say so explicitly and report the closest equivalent verification performed.

### Local E2E Policy
For GUI changes, treat local completion verification as:
- `npm --prefix frontend run test:e2e -- --project=chromium --grep @smoke`

### Flake Policy
If an E2E assertion proves brittle, prefer redesigning the test around stable user-visible invariants rather than layering on waits or implementation-coupled selectors.

