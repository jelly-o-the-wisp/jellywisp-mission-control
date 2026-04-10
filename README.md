# Mission Control

A website-first Mission Control prototype for watching AI agents work in one place.

## What this is

This project is the first pass at a dashboard for:

- active agents
- tasks in flight
- animated/cartoon-ish agent presence
- launch readiness
- calendar visibility
- ops timeline and system status

## Stack

- Next.js
- TypeScript
- Tailwind CSS

## Run it locally

```bash
cd mission-control
npm run dev
```

Then open <http://localhost:3000>.

## Included in this first pass

- polished landing dashboard
- animated agent map
- task board with now / next / blocked lanes
- launch calendar panel
- system timeline panel
- starter roadmap docs
- Railway + OpenClaw + Claude setup notes

## Important note

The linked Claude share was not accessible from here, so the current UI is a smart prototype based on the description in chat. Once the screenshot or missing requirements are added, the next pass should align the layout and features more precisely.

## Suggested next build steps

1. connect live OpenClaw state and session/task data
2. add real calendar data
3. define agent/task/run schemas
4. swap placeholder agent visuals for the final art direction
5. add auth and per-workspace views

## Docs

- `docs/railway-openclaw-claude-setup.md`
- `docs/mission-control-roadmap.md`
