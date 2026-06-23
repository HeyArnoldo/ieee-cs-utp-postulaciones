# IEEE CS UTP — Volunteer Recruitment App

Conversational quiz that collects applicants, saves to Notion, and uses OpenAI to generate a dynamic follow-up question and a personalized result message.

## Stack

- **Frontend**: Vite 7 + React 19 + TypeScript + Tailwind v4
- **Backend**: Vercel serverless functions (`/api`)
- **Storage**: Notion API (internal integration)
- **AI**: OpenAI `gpt-4o-mini`

## Local dev

```bash
pnpm install
cp .env.example .env   # fill in the three env vars below
pnpm dev               # http://localhost:5173
pnpm test              # Vitest — all tests must pass
pnpm build             # type-checks api/ + builds the SPA
```

## Environment variables

| Variable | Description |
|---|---|
| `NOTION_TOKEN` | Notion internal integration secret |
| `NOTION_DATABASE_ID` | ID of the target Notion database (from its URL) |
| `OPENAI_TOKEN` | OpenAI API key (**not** `OPENAI_API_KEY`) |

Set these in Vercel → Project → Settings → Environment Variables.

## Notion setup (important — people always miss this)

1. Go to [notion.so/my-integrations](https://www.notion.so/my-integrations) and create an **Internal Integration**.
2. Copy the **Integration Secret** → `NOTION_TOKEN`.
3. Open the target database in Notion → `•••` menu → **Connections** → add your integration.

> If you skip step 3 the API returns: *"Could not find database… Make sure the relevant pages and databases are shared with your integration."*

`NOTION_DATABASE_ID` is the 32-character ID in the database URL:
`https://notion.so/workspace/**{DATABASE_ID}**?v=...`

## Deploy to Vercel

1. Import the repo in [vercel.com](https://vercel.com). Framework preset: **Vite**.
2. Add the three env vars above.
3. Deploy. The `/api` directory is auto-detected as serverless functions.

For a custom domain: add it in Vercel → Project → Domains. SSL is automatic.

## Important: ESM import extensions

All relative imports inside `api/*.ts` **must** end with `.js` (not `.ts`). Node ESM requires explicit extensions at runtime. A test (`api/import-extensions.test.ts`) enforces this — it will fail CI if any offending import is added.
