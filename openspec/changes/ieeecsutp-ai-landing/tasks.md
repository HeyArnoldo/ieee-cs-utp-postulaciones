# Tasks: ieeecsutp-ai-landing

## M0 — Scaffold (DONE)
- [x] Copy original index.html to reference/original-landing.html
- [x] Copy assets to public/assets/
- [x] Create package.json with correct scripts and dependencies
- [x] Create tsconfig.json, tsconfig.app.json, tsconfig.node.json
- [x] Create vite.config.ts with @tailwindcss/vite, @vitejs/plugin-react, path alias @/, vitest config
- [x] Replace index.html with Vite entry point
- [x] Create src/main.tsx, src/App.tsx, src/index.css
- [x] Set up Tailwind CSS v4 (import "tailwindcss" in CSS)
- [x] Create components.json for shadcn/ui
- [x] Create src/lib/utils.ts with cn()
- [x] Create src/components/ui/button.tsx (example component)
- [x] Create src/test/setup.ts with jest-dom import
- [x] Write src/lib/utils.test.ts with passing test
- [x] Create api/health.ts with VercelRequest/VercelResponse types
- [x] Update vercel.json with SPA rewrite + preserve security headers
- [x] Create .gitignore
- [x] pnpm install, pnpm build, pnpm test all pass
- [x] Commit on chore/m0-scaffold

## M1 — React Form Flow
- [ ] Port original 7-step quiz flow to React components
- [ ] Implement step-based wizard with progress indicator
- [ ] Implement Zod validation per step
- [ ] Match original visual design (colors, fonts, animations)
- [ ] Add conditional IEEE membership ID field
- [ ] Unit tests for form validation logic

## M2 — Notion Persistence
- [ ] Add @notionhq/client dependency
- [ ] Implement field mapping module (form values → Notion select values) with full TDD
- [ ] Implement /api/postular Notion write
- [ ] Write integration tests for mapping layer
- [ ] Test error path (Notion failure)

## M3 — AI Layer
- [ ] Add openai dependency
- [ ] Implement /api/repregunta (dynamic follow-up Q)
- [ ] Wire follow-up Q step into form flow
- [ ] Implement personalized result generation in /api/postular
- [ ] Test all fallback paths (AI never blocks persistence)

## M4 — Polish & Deploy
- [ ] Remove all traces of hardcoded 87/100 score from reference (verify none leaked into SPA)
- [ ] Add loading states and error UX
- [ ] Update README with setup, env vars, deploy instructions
- [ ] Verify Vercel deploy (preview + production)
- [ ] Final QA on mobile
