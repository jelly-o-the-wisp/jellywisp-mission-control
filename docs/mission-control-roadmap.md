# Mission Control roadmap

## Goal

Create a website where you can see what your AI agents are doing in a way that feels alive, visual, and useful.

## Core screens

### 1. Command dashboard
- active agents
- tasks in progress
- alerts
- system health
- launch readiness

### 2. Agent detail view
- current task
- recent actions
- outputs
- blockers
- tool usage
- uptime / status

### 3. Timeline / replay
- what happened
- when it happened
- which agent did it
- what changed

### 4. Calendar + planning
- upcoming events
- deadlines
- launch windows
- reminders

## Suggested architecture

### Frontend
- Next.js website
- animated dashboard cards
- realtime updates later via websockets or polling

### Backend
- OpenClaw for agent runtime and channel operations
- thin Mission Control API for normalized dashboard data
- optional Supabase/Postgres for history and analytics

## Delivery phases

### Phase 1
- UI prototype
- fake data
- IA and visual language

### Phase 2
- real agent/task data
- environment and deploy health
- live activity stream

### Phase 3
- calendar integration
- searchable history
- agent performance summaries

### Phase 4
- avatar animation system
- richer charts
- permissions / teams / workspaces

## Open questions

- where task history should live
- whether calendar starts as read-only or editable
- whether agents need per-project isolation
- what the screenshot layout prioritizes most
