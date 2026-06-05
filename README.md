# DeepShield

**AI armor against deepfakes and digital violence.**

DeepShield is a browser-first toolkit for people facing deepfake abuse, morphed images, and non-consensual intimate imagery (NCII). It combines on-device computer vision, server-side ML scoring, reverse-image trace, encrypted evidence storage, legal PDF export, and trauma-informed support — in one web app.

**Repository:** [github.com/Siddharthye/Deepshield](https://github.com/Siddharthye/Deepshield)

---

## Live deployment

| App | Role | URL |
|-----|------|-----|
| **Frontend** | UI, auth, client-side detection | [deepshield-frontendd.vercel.app](https://deepshield-frontendd.vercel.app) |
| **Backend API** | Hugging Face, LLM, trace APIs | [deepshield-xi.vercel.app](https://deepshield-xi.vercel.app) |

The frontend proxies most `/api/*` routes to the backend via `deepshield-frontend/vercel.json`. Google OAuth routes stay on the frontend.

---

## Features

| Tool | Route | What it does |
|------|-------|--------------|
| **Scan** | `/scan` | Image + video deepfake detection with heatmap and compare slider |
| **Trace** | `/trace` | Reverse image search (Google Lens) + manual URL logging |
| **Report** | `/report` | Court-ready PDF with scan data, trace log, and legal summary |
| **Vault** | `/vault` | PIN-protected AES-256 encrypted evidence storage (local) |
| **Asha** | `/asha` | Trauma-informed AI companion for rights guidance |
| **Rights** | `/rights` | Plain-language Indian cyber-law summaries |
| **Community** | `/community` | Anonymous local support feed with LLM moderation |
| **Learn** | `/learn` | Education hub — authentic vs suspicious examples, quizzes |

**Sign-in:** Google OAuth or local email/password (stored in the browser only).

**Languages:** Full English and Hindi UI; 8-language selector with English fallback for other locales.

---

## How detection works

```
Upload (browser)
    │
    ├─ face-api.js        → symmetry + face box
    ├─ Canvas artifacts   → edge / compression signals
    ├─ morphDetection.ts  → blend / seam heuristics
    │
    └─ POST /api/scan-image
           ├─ Hugging Face deepfake classifier
           └─ Sightengine (optional, parallel)
    │
    └─ riskScoring.ts → verdict + heatmap → optional LLM explanation
```

**Important:** The LLM does **not** decide if media is fake. It only explains detector outputs and helps with legal wording.

**Privacy:** Scans are sent to the API for scoring only — no server-side gallery of uploads. Vault and trace logs stay in the browser unless the user exports them.

---

## Tech stack

### Frontend (`deepshield-frontend/`)

Next.js 16 · React 19 · Tailwind CSS v4 · Framer Motion · GSAP · Three.js / R3F · Lenis · face-api · FFmpeg.wasm · pdf-lib · CryptoJS

### Backend (`deepshield-backend/deepshield-backend/`)

Next.js Route Handlers · Hugging Face Inference · Sightengine · SerpAPI / Serper · in-memory rate limiting

### Deployment

Two Vercel projects from this monorepo.

---

## Project structure

```
deepshield-backend/                 ← Git root
├── deepshield-backend/             ← API app (deploy separately)
│   └── src/app/api/                ← scan, explain, asha-chat, trace, …
├── deepshield-frontend/            ← UI app (deploy separately)
│   ├── vercel.json                 ← proxies /api/* to backend
│   └── src/
│       ├── app/                    ← pages + Google OAuth routes
│       ├── components/
│       ├── context/
│       └── lib/                    ← riskScoring, i18n, pdf-generator, …
└── README.md
```

---

## Local development

### Prerequisites

- Node.js 20+
- npm

### 1. Backend API

```bash
cd deepshield-backend/deepshield-backend
cp ../.env.local.example .env.local
# Add HF_API_TOKEN at minimum
npm install
npm run dev
```

Runs on [http://localhost:3000](http://localhost:3000) by default (or the next free port).

### 2. Frontend

```bash
cd deepshield-frontend
cp .env.local.example .env.local
npm install
npm run dev
```

Set `NEXT_PUBLIC_API_URL` to your local backend URL, or use `same-origin` with rewrites if both run on the same host.

For local Google sign-in, add this redirect URI in [Google Cloud Console](https://console.cloud.google.com/apis/credentials):

```
http://localhost:3000/api/auth/google/callback
```

Confirm the live redirect URI after deploy:

```
GET https://YOUR-FRONTEND/api/auth/google/setup
```

---

## Environment variables

### Backend (`.env.local` in `deepshield-backend/deepshield-backend/`)

| Variable | Required | Purpose |
|----------|----------|---------|
| `HF_API_TOKEN` | Yes | Hugging Face inference + LLM |
| `HF_DEEPFAKE_MODEL_URL` | No | Default: `dima806/deepfake_vs_real_image_detection` |
| `HF_LLM_MODEL_URL` | No | Default: `meta-llama/Llama-3.1-8B-Instruct` |
| `SIGHTENGINE_API_USER` / `SECRET` | No | Boosts scan accuracy |
| `SERPAPI_API_KEY` or `SERPER_API_KEY` | No | Automatic reverse-image trace |

See [`.env.local.example`](.env.local.example) for the full list.

### Frontend (`.env.local` in `deepshield-frontend/`)

| Variable | Required | Purpose |
|----------|----------|---------|
| `NEXT_PUBLIC_API_URL` | Yes | Use `same-origin` with `vercel.json` rewrites |
| `GOOGLE_CLIENT_ID` | For OAuth | Google OAuth Web client |
| `GOOGLE_CLIENT_SECRET` | For OAuth | Google OAuth secret |
| `GOOGLE_REDIRECT_URI` | No | Override if auto-detection is wrong |

See [`deepshield-frontend/.env.local.example`](deepshield-frontend/.env.local.example).

**Never commit `.env.local` or secrets.**

---

## Deploy on Vercel

1. **Backend project** — root directory: `deepshield-backend/deepshield-backend`  
   Add HF token and optional Sightengine / SerpAPI keys.

2. **Frontend project** — root directory: `deepshield-frontend`  
   Set `NEXT_PUBLIC_API_URL=same-origin`, Google OAuth vars, and update `vercel.json` rewrite destinations to your backend URL.

3. **Google Console** — authorized redirect URI must match exactly:  
   `https://YOUR-FRONTEND.vercel.app/api/auth/google/callback`

4. Redeploy the frontend after any `vercel.json` or auth changes.

---

## API routes (backend)

| Route | Method | Purpose |
|-------|--------|---------|
| `/api/scan-image` | POST | HF + Sightengine model scores |
| `/api/scan-video-frame` | POST | Per-frame video scoring |
| `/api/explain` | POST | LLM risk explanation |
| `/api/asha-chat` | POST | Streaming Asha chat |
| `/api/rights-explainer` | POST | Legal Q&A |
| `/api/reverse-trace` | POST | Google Lens lookup |
| `/api/trace-upload` | POST | Host image for trace |
| `/api/moderate-post` | POST | Community moderation |
| `/api/translate` | POST | UI string translation |

Auth routes (`/api/auth/google/*`) run on the **frontend** only.

---

## Crisis resources

DeepShield surfaces these contacts in-app:

- **Cybercrime helpline:** 1930  
- **Report portal:** [cybercrime.gov.in](https://cybercrime.gov.in/)

---

## Scripts

```bash
# Frontend
cd deepshield-frontend && npm run dev
cd deepshield-frontend && npm run build

# Backend
cd deepshield-backend/deepshield-backend && npm run dev
cd deepshield-backend/deepshield-backend && npm run build
```

---

## License

Academic project. Check with the repository owner before commercial use.

---

## Contributors

**Siddharthye** — [github.com/Siddharthye/Deepshield](https://github.com/Siddharthye/Deepshield)
