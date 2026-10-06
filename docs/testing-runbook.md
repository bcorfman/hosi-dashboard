## Dashboard Playwright smoke regression

**Purpose:** Verify that the dashboard, component breakdown, and methodology pages render their primary user-visible content.

**Setup / seed:**

- Install frontend dependencies with `npm --prefix frontend ci`.
- The Playwright configuration starts the required local frontend/backend services.

**Safe actions:**

- Running the smoke suite is read-only apart from local Playwright result artifacts.

**Destructive or external actions:**

- Refreshing a pull-request branch updates remote GitHub state and should only be done for the intended PR.

**Steps:**

1. Confirm the smoke test asserts a date-shaped latest-month value, rather than a specific dataset month.
2. Refresh each stale Dependabot PR from `main` before re-running its checks.

**Verify:**

```bash
npm --prefix frontend run test:e2e -- --project=chromium --grep @smoke
```

Expected: one Chromium `@smoke` test passes. A failure looking for a fixed `Latest month: YYYY-MM-DD` value means the PR branch predates the dataset-tolerant assertion on `main`.

**Cleanup:** Playwright creates `frontend/test-results/`; it is ignored by Git.

**Notes:** The current latest month is data-dependent; use the stable date-format matcher from `main` when resolving dependency-PR failures.

## React dependency updates

**Purpose:** Ensure a React dependency PR retains the exact-version pairing required by `react` and `react-dom`.

**Setup / seed:**

- Inspect the proposed dependency versions from the PR lockfile or CI log.

**Safe actions:**

- Running the frontend unit suite and reading CI output are read-only.

**Destructive or external actions:**

- Merge the already-green matching `react-dom` dependency PR before refreshing the `react` PR; this changes `main`.

**Steps:**

1. If CI reports mismatched `react` and `react-dom` versions, locate the green matching `react-dom` PR.
2. Merge that prerequisite PR, then update the `react` PR branch from `main`.

**Verify:**

```bash
npm --prefix frontend run test:unit
```

Expected: component test suites load without an “Incompatible React versions” error.

**Cleanup:** None.

**Notes:** React 19 requires `react` and `react-dom` to be identical versions; Dependabot can split their updates into separate PRs.
