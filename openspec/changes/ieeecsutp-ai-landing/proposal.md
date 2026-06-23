# Proposal: ieeecsutp-ai-landing

## Problem

The current IEEE Computer Society UTP landing page is a static HTML file that:

1. **Saves nothing**: applicant responses are never persisted anywhere. When a volunteer fills out the form and clicks submit, all their data vanishes into the void.
2. **Fakes the AI**: the "AI evaluation" shows a hardcoded score of 87/100 regardless of what the applicant answered. This is theater, not a real evaluation.
3. **Blocks committee work**: the HR committee has no way to contact applicants because no data reaches them.

## Goal

Transform the static landing into a modern SPA that:
- Collects the 7 recruitment questions (name, career, cycle, emails, WhatsApp, IEEE membership, interests)
- Generates a real dynamic follow-up question via OpenAI gpt-4o-mini based on the applicant's motivation
- Persists all data to a Notion database ("Voluntarios IEEE CS UTP") so the HR committee can act on it
- Shows the applicant a personalized AI-generated result (replacing the fake 87/100 score)

## Scope

- M0: Vite + React + TS scaffold (this milestone)
- M1: React form flow (port original design)
- M2: Notion persistence + field mapping (TDD)
- M3: OpenAI integration (dynamic question + personalized result)
- M4: Polish, remove fake score, deploy docs

## Non-Goals

- No Postgres or any relational database
- No user authentication or login
- No gatekeeping based on the AI score (everyone who submits gets registered)
- No NestJS or any backend framework
- No admin dashboard (Notion serves as the data view)
