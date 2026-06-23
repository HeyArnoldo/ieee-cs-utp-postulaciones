# Design: ieeecsutp-ai-landing

## Architecture

```
Browser (Vite SPA)
  └── /api/repregunta  → gpt-4o-mini → dynamic follow-up Q
  └── /api/postular    → @notionhq/client → Notion DB
                       → gpt-4o-mini → personalized result
```

## Frontend

- **Framework**: Vite 7 + React 19 + TypeScript 5
- **Styling**: Tailwind CSS v4 + shadcn/ui (new-york style, zinc base)
- **State**: Local React state (no global store needed for M1; evaluate TanStack Query for async in M3)
- **Form**: React controlled form, Zod validation
- **Routing**: Single page, no router needed (step-based wizard)

## Serverless Functions

### `/api/repregunta`
```
POST /api/repregunta
Body: { motivation: string }
Response: { question: string }
```
- Calls gpt-4o-mini with a system prompt to generate one relevant follow-up question
- Falls back to a hardcoded generic question on error
- Timeout: 10s

### `/api/postular`
```
POST /api/postular
Body: ApplicationPayload (all form fields + followUpQ + followUpA)
Response: { ok: boolean; message: string }
```
1. Validates payload with Zod
2. Writes to Notion (always, before AI)
3. Calls gpt-4o-mini for personalized result message
4. Returns message (AI or fallback)

## Notion Integration

**DB name**: Voluntarios IEEE CS UTP

**Property mapping** (form value → Notion property):

| Form field | Notion Property | Type |
|---|---|---|
| name | Nombres y Apellidos | title |
| carrera | Carrera | select |
| ciclo | Ciclo | number |
| correoUTP | Correo institucional UTP | email |
| correoPersonal | Correo personal | email |
| whatsapp | WhatsApp | phone_number |
| esMiembroIEEE | Es miembro IEEE | checkbox |
| membershipId | IEEE Membership ID | rich_text |
| comite | Comunidad/Comité/Rol | select |
| lineas | Línea/Departamento | multi_select |

**Body content** (written as blocks):
- Motivation paragraph
- Dynamic follow-up question
- Follow-up answer

**Estado** default: "Nuevo"

**CRITICAL**: Form select option values (e.g., "software-libre") do NOT match Notion select values (e.g., "Software Libre"). A dedicated, unit-tested mapping module handles this translation.

## Environment Variables

```
NOTION_TOKEN=secret_xxx
NOTION_DATABASE_ID=xxx
OPENAI_API_KEY=sk-xxx
```

## AI Layer

- Model: `gpt-4o-mini` (cost-efficient, fast)
- Library: `openai` npm package
- Pattern: try/catch wrapping every OpenAI call; all failures are non-fatal
- No streaming in M3 (simplest implementation first)
