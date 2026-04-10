# Railway + OpenClaw + Claude setup

This is the cleanest path for an always-on clawbot with Claude as the model backend.

## 1. Deploy OpenClaw on Railway

Use the OpenClaw Railway template:

- <https://railway.com/deploy/clawdbot-railway-template>

## 2. Add persistent storage

Attach a Railway volume mounted at:

- `/data`

This matters because OpenClaw needs persistent state for config, sessions, auth profiles, and workspace files.

## 3. Set Railway variables

Minimum:

```bash
OPENCLAW_GATEWAY_PORT=8080
OPENCLAW_GATEWAY_TOKEN=your-long-random-secret
```

Recommended:

```bash
OPENCLAW_STATE_DIR=/data/.openclaw
OPENCLAW_WORKSPACE_DIR=/data/workspace
ANTHROPIC_API_KEY=your-anthropic-api-key
```

## 4. Enable public networking

In Railway, enable HTTP Proxy on:

- `8080`

## 5. Open the Control UI

After Railway gives you a domain, open:

- `https://your-domain/openclaw`

Use `OPENCLAW_GATEWAY_TOKEN` when prompted.

## 6. Set Claude as the primary model

In OpenClaw config, use a model like:

```json5
{
  env: { ANTHROPIC_API_KEY: "sk-ant-..." },
  agents: {
    defaults: {
      model: { primary: "anthropic/claude-sonnet-4-6" }
    }
  }
}
```

You can also use `anthropic/claude-opus-4-6` if you want the stronger model and are happy with the cost.

## 7. Connect Discord

High level flow:

1. Create a Discord application and bot in the Discord Developer Portal.
2. Enable Message Content Intent.
3. Invite the bot to your server with bot + applications.commands scopes.
4. Put the Discord bot token into OpenClaw config.
5. Pair the bot in DM or allowlist your guild/users.

## 8. Confirm the bot is healthy

Check:

- the Railway service is up
- the Control UI loads
- the model is set to Anthropic Claude
- the bot responds in Discord

## 9. Start Mission Control as a separate web app

Recommended architecture:

- Railway service A: OpenClaw gateway + channels + agent runtime
- Railway service B: Mission Control website
- optional database: Supabase/Postgres for task history, event logs, and dashboards

## 10. Wire live data in phases

Suggested order:

1. sessions and tasks
2. agent roster and status
3. alerts and deploy health
4. calendar integration
5. replay/history view
