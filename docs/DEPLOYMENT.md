# Free-tier deployment guide (no Docker, no local build)

Both hosts build from GitHub in the cloud. Your laptop only needs `git`.
You do not need `docker compose`, `node_modules` or `.next` locally. Delete them to free disk space.

## Architecture

```
Browser -> Vercel project 1 (Next.js, root: frontend)
                |  NEXT_PUBLIC_API_URL
                v
           Vercel project 2 (FastAPI, root: backend) -> Gemini API (free key)
```

The backend is self-contained: data is generated in memory, so no database is needed.
If Gemini fails or no key is set, `/api/triage` falls back to a rule-based heuristic.
The Overview page also has built-in fallback data.

## 0. Prerequisites (all free)
- GitHub account
- Vercel account (sign in with GitHub)
- Gemini API key from https://aistudio.google.com/

## 1. Push to GitHub
```bash
cd Build-with-AI-Health-and-SCM
git add -A && git commit -m "Prepare for deployment"
git remote add origin https://github.com/<you>/<repo>.git
git push -u origin main
```
`.gitignore` already excludes `.env`, `node_modules` and `.next`. Check that `git status` shows no `.env` file before pushing.

## 2. Deploy the backend (Vercel project 1)
1. Vercel -> Add New -> Project -> import the repo.
2. **Root Directory: `backend`**. Vercel detects FastAPI from `main.py`.
3. Environment variables:

| Name | Value |
|---|---|
| `GEMINI_API_KEY` | your key |
| `GEMINI_MODEL` | a live model, e.g. `gemini-3.5-flash-lite` (check the AI Studio model list) |
| `CORS_ORIGINS` | `*` for now; tighten in step 4 |

Frontend project variables: `NEXT_PUBLIC_API_URL` (required) and `NEXT_PUBLIC_CARTO_KEY` (optional, see Troubleshooting).

4. Deploy, then open `https://<backend>.vercel.app/health` (expect `{"status":"ok"}`) and `/docs`.

## 3. Deploy the frontend (Vercel project 2)
1. Add New -> Project -> the same repo.
2. **Root Directory: `frontend`** (framework: Next.js, auto-detected).
3. Environment variable: `NEXT_PUBLIC_API_URL` = `https://<backend>.vercel.app` (no trailing slash).
4. Deploy. If you change this variable later, **redeploy**, because it is baked in at build time.

## 4. Lock down CORS
In the backend project set `CORS_ORIGINS` to the frontend URL, for example
`https://<frontend>.vercel.app`. A comma-separated list or a JSON array both work.
Redeploy the backend.

## 5. Smoke test
- Frontend loads, and the Triage page returns a result.
- Supply Radar charts and Outbreak Map render (the map uses CARTO tiles, which is fine for a demo).
- Browser dev tools show no CORS errors.

## Troubleshooting

**Triage shows "Couldn't reach the server"** - the browser cannot call the backend.
1. Open `https://<backend>.vercel.app/health`. It must return `{"status":"ok"}`. If not, check the backend project's deployment logs.
2. In the *frontend* project, `NEXT_PUBLIC_API_URL` must be the backend URL (no trailing slash). Redeploy the frontend after changing it, because it is baked in at build time. If it is missing, the app calls `localhost:8000`, which fails on Vercel.
3. `CORS_ORIGINS` on the backend must include the frontend URL (or `*`). Redeploy the backend after changing it.

**Triage shows "AI service unavailable"** - the backend works, but Gemini failed. Open `https://<backend>.vercel.app/api/triage/status`. It returns `key_set`, `key_looks_valid`, the model, and the exact error.
- `key_set: false`: add `GEMINI_API_KEY` to the *backend* project and redeploy.
- `key_looks_valid: false`: Gemini keys usually start with `AIza`. Create one at https://aistudio.google.com/apikey.
- 404 / model not found: set `GEMINI_MODEL` to a live model. The backend also tries a few fallback models automatically.
- 429: free-tier rate limit. Wait a minute.

**Map shows "API KEY REQUIRED"** - CARTO tiles now need a free key. Either leave `NEXT_PUBLIC_CARTO_KEY` empty (the map uses OpenStreetMap tiles) or get a free key at https://carto.com/basemaps/apikey and set `NEXT_PUBLIC_CARTO_KEY` in the *frontend* project, then redeploy. The key is visible in the browser, so restrict it to your domain in CARTO.

## Limits and caveats
- **Vercel Hobby is for personal, non-commercial use only.** A hackathon or demo is fine; a commercial pilot needs a paid plan.
- **Python bundle limit is 500 MB.** numpy + scipy + pandas should fit, but this repo has not been test-deployed. If the build fails on size, remove pandas or scipy, or use the Render fallback.
- **Gemini free tier:** rate limits are low (roughly 5-15 requests/min for Flash models; check current limits) and Google may use free-tier prompts to improve its products. **Do not send real patient data.** Use synthetic data for demos.
- Model names change often. If triage always shows `"heuristic_used": true`, check the Vercel function logs for the Gemini error and update `GEMINI_MODEL`.
- The `google-generativeai` SDK is end-of-life. It still works for now, but plan a move to `google-genai`.

## Fallback: backend on Render (free)
1. New -> Web Service -> the repo, Root Directory `backend`, Runtime Python.
2. Build: `pip install -r requirements.txt`. Start: `uvicorn main:app --host 0.0.0.0 --port $PORT`.
3. Same environment variables as above.

Free instances have 512 MB RAM and sleep after about 15 minutes idle (roughly a minute to wake). Point `NEXT_PUBLIC_API_URL` at the Render URL and redeploy the frontend.

## Optional: local development without Docker
```bash
# backend
cd backend && python -m venv .venv && .venv\Scripts\activate
pip install -r requirements-dev.txt
copy ..\.env.example .env
uvicorn main:app --reload
# frontend (another terminal)
cd frontend && npm ci && npm run dev
```
