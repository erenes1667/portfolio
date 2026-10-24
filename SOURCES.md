# Sources

Every number on the page points to a file. Project numbers come from each repo's README results table, read on 2026-10-24 and re-read after the 21:25 README commits. Work numbers come from the resume in this folder.

## Projects section

| Card | Number on the page | Source |
|---|---|---|
| agent-evals-lab | 40 eval cases, Haiku 92.5% on run one and 100% on run two | README, Results, graph v2 table (`haiku-5-5-v2` 92.5%, `haiku-5-5-v2-rerun` 100%) |
| agent-evals-lab | $0.011 per answer on Haiku, Sonnet $0.025 on the earlier suite version | README, Results (`haiku-5-5-v2-rerun` $0.01115 on graph v2; sonnet-5-5 $0.0251 on the graph v1 table, Sonnet was not rerun on v2) |
| agent-evals-lab | 0.8 kappa, Haiku judge agreement with 10 hand labels | README, Judge calibration (haiku judge 90% pass agreement, kappa 0.8) |
| agent-evals-lab | offline tests with a fake LLM, 1,681 API calls, $5.78 spent | README, Quickstart (`make test`) and Spend ($5.7772) |
| gtm-brain | 94% first try, 17 of 18, first checker prompt, in-sample; shipped prompt 78% | README, Results table (first prompt row and the `2026-10-24-live-v2` re-run row) and Known limits (the final prompt was tuned on the same 25 domains) |
| gtm-brain | $0.0165 per account, 25 accounts, $0.41 run | README, Results table (cost total $0.4114) |
| gtm-brain | 13 of 13 held-out lines, 19 new domains | README, Results, held-out v1 row |
| gtm-brain | 47 offline tests, n8n ran once, $3.49 spent | README, Files, Results table |
| ad-creative-agent | $0.36 per full run, 9 concepts, top 6, 18 calls | README, Results, Lantern Drift run ($0.3584) |
| ad-creative-agent | 0 of 108 banned-claim hits, 12 briefs | README, Results, copy eval rows |
| ad-creative-agent | 9 to 0 near-repeat angles, memory off then on, 3 trials per arm | README, Results, creative memory row ("Creative memory, 3 trials per arm") |
| ad-creative-agent | offline tests (README gives no count), 15 of 15 seeded defects blocked, placeholder images with no diffusion model, about $5.91 spent | README, headline paragraph and Results table (vision critic row: 12 by the vision critic and 3 by code; total spend row) |
| section intro | each project ran on a self-imposed $6 API budget | each README states the $6 cap: agent-evals-lab Spend, gtm-brain Results, ad-creative-agent total spend row |

Crops in `assets/proj-*.webp` are cut from each repo's `docs/shot-1440.png`.

Repos: https://github.com/erenes1667/agent-evals-lab , https://github.com/erenes1667/gtm-brain , https://github.com/erenes1667/ad-creative-agent

## Work section

All counts (32 agents, 47 hooks, 55 jobs, 1,400+ commits, 7 brands, 70 routes, 23 models, 11 workflows, 225 notes, 7,900 docs, 9-call breaker, 3 tiers meaning the Haiku, Sonnet and Opus choice, 10+ services, 3 h interval, 600+ commits on the onboarding hub, 13 game projects) are the ones in `Enes_Eren_Resume.pdf` in this folder. The "Also shipped" items (onboarding hub, cold-email production) are the resume's Client tools and Data and GTM pipelines lines. The AMP engine is described with the resume's words only (in-email ratings, surveys, reorder). The employer and its clients are not named on the page; the resume PDF names them.

Round 3: case 05 uses the resume's wording, "55 scheduled jobs" and "10+ always-on services" (the nodes name cron and systemd as the mechanism), so the case, the stat strip and the resume say the same thing.

Removed in round 2 because no file holds them: per-tier role captions (scans, builds, orchestration), the Klaviyo 6 and Beehiiv 1 split, "3 rendering tiers", and the commit counts for three internal tools.
