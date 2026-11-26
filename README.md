# THAMUN (থামুন)

**Meet the scam before it meets you.**  
A civic-poster web app where parents, grandparents, and first-time mobile-money users rehearse scam calls safely in Bangla or English.

> Built for **STEM2Connect AI Hackathon 2026 — Community Impact Track**.

---

## Safety & AI Disclosure

- **Fictional wallet only:** All practice scenarios use the made-up wallet **TakaPay**. No real brands, logos, or phone numbers are used.
- **Fixed, reviewed script tree:** Caller lines come strictly from a reviewed JSON script tree (`backend/app/scenarios/scripts.json`). AI **never** generates new scam lines.
- **Stateless classification:** AI (Gemini, added in Milestone 2) only classifies user replies (`safe`, `risky`, `compromised`), identifies the manipulation tactic, and returns plain-language coaching. If AI is unavailable or returns invalid output, THAMUN falls back to the deterministic `RuleClassifier` and notifies the user.
- **No transcript storage:** Client-side guards block inputs resembling PINs, OTPs, phone numbers, or card numbers before submission. The backend never logs or stores user replies or call transcripts.

## Limits

- THAMUN is an educational rehearsal tool, not legal, banking, or law-enforcement advice.
- Browser speech features (`SpeechRecognition`) depend on browser/device support; text input always works.

## Credits

- **Typography:** `Fraunces` (English headings) and `Hind Siliguri` (Bangla & body) via Google Fonts.
- **Design:** Civic-poster layout based on the THAMUN Figma specification.

---

## Local Setup (Milestone 1)

### Backend (FastAPI + SQLite)
```bash
cd backend
cp ../.env.example .env
uv sync
uv run uvicorn app.main:app --reload --port 8000
```

Run backend tests:
```bash
cd backend
uv run pytest
```

### Frontend (Next.js + Tailwind + Framer Motion)
```bash
cd frontend
npm install
npm run dev
```

Run frontend tests:
```bash
cd frontend
npm test
```
