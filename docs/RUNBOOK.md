# webproposal Runbook

Operational guide for branch protection, pull-request workflow, and continuous
monitoring of the webproposal repository. Written in tutorial style so any
maintainer can pick it up and follow along.

Repository: https://github.com/jeflowers/webproposal

---

## 1. Branch Protection via Rulesets

GitHub Rulesets are the modern replacement for "classic" branch protection
rules. They are evaluated by GitHub whenever someone pushes, opens a PR,
force-pushes, or deletes a branch. Reference documentation:
https://docs.github.com/en/repositories/configuring-branches-and-merges-in-your-repository/managing-rulesets/about-rulesets

### 1.1 What we are protecting

`main` must never be:

- Force-pushed over
- Deleted
- Updated by a direct push (must go through a pull request)
- Merged without the CI build passing

### 1.2 Create the ruleset (UI path)

1. Go to **Settings -> Rules -> Rulesets** on the repository.
2. Click **New ruleset -> New branch ruleset**.
3. Name it `protect-main`.
4. Set **Enforcement status** to `Active`.
5. Under **Target branches**, click **Add target -> Include by pattern**, and
   add `main`.
6. Under **Rules**, enable:
   - `Restrict deletions`
   - `Block force pushes`
   - `Require a pull request before merging` (1 approval, dismiss stale reviews)
   - `Require status checks to pass` -> add `build`, strict
   - `Require linear history` (optional)
7. Save.

### 1.3 Create the ruleset via API

Payload lives at `docs/rulesets/protect-main.json`.

```bash
export GH_TOKEN=ghp_xxx   # fine-grained PAT, Administration: read+write
curl -X POST \
  -H "Authorization: Bearer $GH_TOKEN" \
  -H "Accept: application/vnd.github+json" \
  -H "X-GitHub-Api-Version: 2022-11-28" \
  https://api.github.com/repos/jeflowers/webproposal/rulesets \
  -d @docs/rulesets/protect-main.json
```

To update:

```bash
RULESET_ID=$(curl -s -H "Authorization: Bearer $GH_TOKEN" \
  https://api.github.com/repos/jeflowers/webproposal/rulesets \
  | jq '.[] | select(.name=="protect-main") | .id')

curl -X PUT -H "Authorization: Bearer $GH_TOKEN" \
  -H "Accept: application/vnd.github+json" \
  https://api.github.com/repos/jeflowers/webproposal/rulesets/$RULESET_ID \
  -d @docs/rulesets/protect-main.json
```

### 1.4 Verify

```bash
curl -s -H "Authorization: Bearer $GH_TOKEN" \
  https://api.github.com/repos/jeflowers/webproposal/rulesets | jq '.[].name'
```

Try a force push to `main` - it must be rejected with `GH013`.

---

## 2. Continuous Integration

The ruleset requires the `build` status check. It is produced by
`.github/workflows/ci.yml`.

1. Checks out the code
2. Sets up Node 20 with npm cache
3. Runs `npm ci`
4. Runs `npm run lint` (advisory)
5. Runs `npm run build` (fails the job on any TypeScript or Vite error)

Add more required checks by appending jobs to `ci.yml` and listing their
`context` in the ruleset JSON, then re-applying.

---

## 3. Standard PR Flow

1. `git checkout -b feat/<slug>` from fresh `main`.
2. Commit in small logical chunks.
3. `git push -u origin feat/<slug>`.
4. Open PR -> the template pre-fills.
5. Wait for CI green, request review.
6. Squash and merge.

---

## 4. Incident Response

**Required status check is expected**: empty commit to re-trigger CI.

```bash
git commit --allow-empty -m "ci: re-run"
git push
```

**Branch out-of-date**:

```bash
git fetch origin && git rebase origin/main && git push --force-with-lease
```

**Repository rule violations found**: you pushed direct to `main`. Open a PR.

**Emergency bypass**: repo admin adds self to the ruleset Bypass list
temporarily, then removes after. Every bypass is in the audit log.

---

## 5. Ongoing Monitoring

- **Weekly**: Dependabot + CodeQL alerts.
- **Weekly**: PRs open > 7 days (Insights -> Pulse).
- **Monthly**: rotate any PATs used for ruleset automation.
- **Quarterly**: re-evaluate required checks; update
  `docs/rulesets/protect-main.json` and re-apply.

---

## 6. Supabase / environment

Application data lives in Supabase. Secrets are configured on the Supabase
project, not in GitHub Actions. The CI job is a static build and never needs
service-role keys.

---

## 7. File map

| Thing | Path |
| --- | --- |
| Runbook | `docs/RUNBOOK.md` |
| Ruleset source of truth | `docs/rulesets/protect-main.json` |
| CI workflow | `.github/workflows/ci.yml` |
| PR template | `.github/PULL_REQUEST_TEMPLATE.md` |
