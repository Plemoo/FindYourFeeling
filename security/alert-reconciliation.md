# FindYourFeeling critical/high alert reconciliation

Scope: Approval B PR 1 only. This records the refreshed stable-ID snapshot and current dependency-path evidence; it does not dismiss alerts, accept risk, or change dependencies.

Base SHA: `2f23f8fa9bd72b4b42eb03134a2308710cb6f982` (authoritative repository baseline; the recovery task text contained a non-existent SHA variant with one missing `0`).

## Refreshed snapshot

- 5 open critical npm alerts: IDs `87`, `71`, `15`, `5`, `4`.
- 80 open high npm alerts: 85 critical/high rows total below.
- The planning snapshot had 81 high alerts. The current snapshot contains alert `138` and no longer contains historical IDs `108`/`109`; this explains the 80-vs-81 drift by stable ID.
- Medium and low alerts remain outside this approved scope.

## Current path evidence

`npm explain image-size --all` resolves `image-size@1.2.1` through `expo > @expo/metro > metro > image-size`; the advertised patched version is `2.0.3`. This is recorded as vulnerable-present. No dependency upgrade was performed; Approval C remains required for any root upgrade. No-patch or major-migration decisions remain behind Approval D.

## Stable-ID reconciliation

The table contains exactly 85 rows: 5 critical and 80 high. Each row preserves the current alert identifier; no alert was dismissed or modified.

| Alert ID | Severity | Current classification | Evidence / path |
| ---: | --- | --- | --- |
| 87 | critical | current snapshot; follow-up required | Stable ID preserved; no dismissal or upgrade. |
| 71 | critical | current snapshot; follow-up required | Stable ID preserved; no dismissal or upgrade. |
| 15 | critical | current snapshot; follow-up required | Stable ID preserved; no dismissal or upgrade. |
| 5 | critical | current snapshot; follow-up required | Stable ID preserved; no dismissal or upgrade. |
| 4 | critical | current snapshot; follow-up required | Stable ID preserved; no dismissal or upgrade. |
| 138 | high | vulnerable-present | image-size@1.2.1 via expo > @expo/metro > metro; patched 2.0.3. |
| 137 | high | current snapshot; follow-up required | Stable ID preserved. |
| 136 | high | current snapshot; follow-up required | Stable ID preserved. |
| 135 | high | current snapshot; follow-up required | Stable ID preserved. |
| 134 | high | current snapshot; follow-up required | Stable ID preserved. |
| 133 | high | current snapshot; follow-up required | Stable ID preserved. |
| 132 | high | current snapshot; follow-up required | Stable ID preserved. |
| 131 | high | current snapshot; follow-up required | Stable ID preserved. |
| 130 | high | current snapshot; follow-up required | Stable ID preserved. |
| 129 | high | current snapshot; follow-up required | Stable ID preserved. |
| 127 | high | current snapshot; follow-up required | Stable ID preserved. |
| 126 | high | current snapshot; follow-up required | Stable ID preserved. |
| 125 | high | current snapshot; follow-up required | Stable ID preserved. |
| 124 | high | current snapshot; follow-up required | Stable ID preserved. |
| 123 | high | current snapshot; follow-up required | Stable ID preserved. |
| 122 | high | current snapshot; follow-up required | Stable ID preserved. |
| 119 | high | current snapshot; follow-up required | Stable ID preserved. |
| 118 | high | current snapshot; follow-up required | Stable ID preserved. |
| 117 | high | current snapshot; follow-up required | Stable ID preserved. |
| 116 | high | current snapshot; follow-up required | Stable ID preserved. |
| 115 | high | current snapshot; follow-up required | Stable ID preserved. |
| 114 | high | current snapshot; follow-up required | Stable ID preserved. |
| 112 | high | current snapshot; follow-up required | Stable ID preserved. |
| 110 | high | current snapshot; follow-up required | Stable ID preserved. |
| 107 | high | current snapshot; follow-up required | Stable ID preserved. |
| 106 | high | current snapshot; follow-up required | Stable ID preserved. |
| 101 | high | current snapshot; follow-up required | Stable ID preserved. |
| 100 | high | current snapshot; follow-up required | Stable ID preserved. |
| 99 | high | current snapshot; follow-up required | Stable ID preserved. |
| 98 | high | current snapshot; follow-up required | Stable ID preserved. |
| 96 | high | current snapshot; follow-up required | Stable ID preserved. |
| 95 | high | current snapshot; follow-up required | Stable ID preserved. |
| 94 | high | current snapshot; follow-up required | Stable ID preserved. |
| 93 | high | current snapshot; follow-up required | Stable ID preserved. |
| 92 | high | current snapshot; follow-up required | Stable ID preserved. |
| 91 | high | current snapshot; follow-up required | Stable ID preserved. |
| 90 | high | current snapshot; follow-up required | Stable ID preserved. |
| 88 | high | current snapshot; follow-up required | Stable ID preserved. |
| 79 | high | current snapshot; follow-up required | Stable ID preserved. |
| 78 | high | current snapshot; follow-up required | Stable ID preserved. |
| 77 | high | current snapshot; follow-up required | Stable ID preserved. |
| 75 | high | current snapshot; follow-up required | Stable ID preserved. |
| 74 | high | current snapshot; follow-up required | Stable ID preserved. |
| 73 | high | current snapshot; follow-up required | Stable ID preserved. |
| 70 | high | current snapshot; follow-up required | Stable ID preserved. |
| 69 | high | current snapshot; follow-up required | Stable ID preserved. |
| 67 | high | current snapshot; follow-up required | Stable ID preserved. |
| 63 | high | current snapshot; follow-up required | Stable ID preserved. |
| 59 | high | current snapshot; follow-up required | Stable ID preserved. |
| 58 | high | current snapshot; follow-up required | Stable ID preserved. |
| 57 | high | current snapshot; follow-up required | Stable ID preserved. |
| 56 | high | current snapshot; follow-up required | Stable ID preserved. |
| 55 | high | current snapshot; follow-up required | Stable ID preserved. |
| 52 | high | current snapshot; follow-up required | Stable ID preserved. |
| 51 | high | current snapshot; follow-up required | Stable ID preserved. |
| 48 | high | current snapshot; follow-up required | Stable ID preserved. |
| 47 | high | current snapshot; follow-up required | Stable ID preserved. |
| 46 | high | current snapshot; follow-up required | Stable ID preserved. |
| 45 | high | current snapshot; follow-up required | Stable ID preserved. |
| 43 | high | current snapshot; follow-up required | Stable ID preserved. |
| 42 | high | current snapshot; follow-up required | Stable ID preserved. |
| 40 | high | current snapshot; follow-up required | Stable ID preserved. |
| 38 | high | current snapshot; follow-up required | Stable ID preserved. |
| 37 | high | current snapshot; follow-up required | Stable ID preserved. |
| 35 | high | current snapshot; follow-up required | Stable ID preserved. |
| 34 | high | current snapshot; follow-up required | Stable ID preserved. |
| 33 | high | current snapshot; follow-up required | Stable ID preserved. |
| 32 | high | current snapshot; follow-up required | Stable ID preserved. |
| 31 | high | current snapshot; follow-up required | Stable ID preserved. |
| 30 | high | current snapshot; follow-up required | Stable ID preserved. |
| 29 | high | current snapshot; follow-up required | Stable ID preserved. |
| 28 | high | current snapshot; follow-up required | Stable ID preserved. |
| 25 | high | current snapshot; follow-up required | Stable ID preserved. |
| 22 | high | current snapshot; follow-up required | Stable ID preserved. |
| 20 | high | current snapshot; follow-up required | Stable ID preserved. |
| 19 | high | current snapshot; follow-up required | Stable ID preserved. |
| 17 | high | current snapshot; follow-up required | Stable ID preserved. |
| 14 | high | current snapshot; follow-up required | Stable ID preserved. |
| 12 | high | current snapshot; follow-up required | Stable ID preserved. |
| 11 | high | current snapshot; follow-up required | Stable ID preserved. |

## Verification and controls

- `npm ci`: exit 0.
- `npm explain image-size --all`: exit 0; path recorded above.
- `npm ls --all` / selected graph inspection: exit 0.
- `git diff --check`: exit 0.
- `package.json` and `package-lock.json`: unchanged on this PR 1 worktree.
- No dependency upgrade, alert mutation, commit, push, pull request, settings change, deployment, release, or risk acceptance was performed.
