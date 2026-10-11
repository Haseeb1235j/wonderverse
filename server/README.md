# WonderVerse web search

The browser uses one backend endpoint. The backend tries configured providers in order and returns source links and previews. It does not generate or independently verify factual answers. The Wikipedia reading modes stay available separately; they are never silently substituted for a failed web search.

No provider is enabled by default. No real API keys are included. Live provider calls have not been tested without credentials; regression tests use fixtures and simulated failures.

## Free credits and zero-spend setup

Offers checked on 11 October 2026:

| Provider                                                                                     | Published offer                                                                                 | Setup                                                                                                |
| -------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------- |
| [Tavily](https://docs.tavily.com/documentation/api-credits)                                  | 1,000 credits per month, no card required. Basic search costs 1 credit.                         | Use the free Researcher plan. Do not enable pay-as-you-go.                                           |
| [Serper](https://serper.dev/)                                                                | 2,500 free queries, no card required.                                                           | Treat this as a finite trial, not a guaranteed monthly allowance.                                    |
| [Brave Search](https://api-dashboard.search.brave.com/documentation/resources/help-feedback) | $5 monthly credits; Search currently costs $5 per 1,000 queries. Card verification is required. | Optional. Use $0 prepay, disable auto-reload, and configure provider-side limits before enabling it. |

The account owner's dashboard is the authority on remaining credits and billing. App counters cannot see usage by other apps or changes to a provider's prices. Use provider-side hard spending limits and avoid sharing the account's quota with other applications. Switching providers does not grant unlimited free access or bypass any provider's limits.

## Run locally

Use Node.js 22.9 or later. No backend packages need to be installed.

1. Copy `server/.env.example` to `server/.env`. Enter keys there, locally. Never put keys in chat, frontend code, a `VITE_` variable, or GitHub files.
2. Set a positive request cap for each enabled provider, below the free credits currently remaining. Leave unused providers at zero. The order defaults to `tavily,serper,brave`; it can be changed with `SEARCH_PROVIDER_ORDER`.
3. Run `npm run search:init` once to create the persistent ledger. It refuses to overwrite an existing ledger.
4. Run `npm run search:dev` in a separate terminal.
5. Copy the root `.env.example` to `.env.local`, set `VITE_SEARCH_API_URL=http://127.0.0.1:8787/api/search`, and restart Vite. This URL is public configuration; keys stay in the backend.

Without keys/caps, the backend returns `not_configured` and makes no upstream calls. Without a backend URL, the frontend does not attempt a web request. The UI shows an explicit unavailable state, working Wikipedia search, and external Google/DuckDuckGo search links. External results open on those websites and are never represented as WonderVerse results.

## Spending controls and fallback

- The ledger reserves one attempt before contacting a provider. Timeouts and failures still consume the app's budget conservatively. There are no automatic retries against the same provider.
- Each configured limit is a **lifetime attempt cap**, not an automatically resetting monthly quota. Counts persist across restarts. After checking a renewed free allowance, the owner can raise the cumulative cap by no more than the additional credits available.
- `SEARCH_DAILY_LIMIT` caps all provider attempts per UTC day (default 30). A search may use up to three attempts if earlier providers fail.
- Quota/billing errors (402, Tavily 432/433), invalid credentials (401/403), throttling (429), timeouts, and malformed responses fall through to the next provider. An ordinary successful search with zero results does not spend another provider's credits.
- Quota/auth failures disable that provider in the ledger until the owner verifies the account and sets that provider's `cooldownUntil` to zero while the server is stopped. Lifetime usage counts must be preserved. Throttling/transient failures use short cooldowns and honor a valid `Retry-After`.
- Missing, corrupted, or locked ledgers stop search instead of resetting usage. A process crash may leave a lock file; confirm the old process is stopped before removing only the `.lock` file. Back up the ledger. Never recreate it to bypass a cap.

## Public hosting

[GitHub Pages is static hosting](https://docs.github.com/en/pages/getting-started-with-github-pages/what-is-github-pages); it cannot run this backend or keep server secrets. Publishing the frontend alone does not activate web search. Host the backend on a Node service with a durable writable disk, then set `VITE_SEARCH_API_URL` to its HTTPS endpoint and rebuild the frontend. The hosting service's own costs and free limits must be checked before deployment.

This implementation targets a single backend process and persistent local disk. Do not run it with an ephemeral filesystem or multiple replicas. Distributed deployment needs a transactional shared usage store. The file lock rejects competing writers, but it is not a distributed quota service.

Set `ALLOWED_ORIGINS` to the exact frontend origins, including `https://haseeb1235j.github.io` for the current Pages site, and bind `SEARCH_HOST=0.0.0.0` only on the chosen server. CORS is not authentication. The endpoint applies a six-request-per-minute socket-IP limit and a global daily budget; public-scale use also needs host-level abuse controls or authentication. Behind a reverse proxy the socket limit may apply to all clients together. Provider results and queries are not persisted or logged by this server; API responses use `Cache-Control: no-store`.

## Data boundaries

Results preserve provider attribution and original source links. A provider's date/age is labeled as provider-reported, not as an independently checked publication date. Unknown dates stay unknown. The app does not label every result verified, claim an employer is still hiring from a snippet, or infer salaries/deadlines. Citation checking, primary-source retrieval, conflict handling, and availability verification are further work before treating this as a factual answering system.

## Verification

Run `npm test` and `npm run build` from the repository root. Tests cover source fidelity, missing evidence, provider switching, quota persistence, concurrency, failure handling, input escaping, and stale navigation responses. Provider schemas follow [Tavily Search](https://docs.tavily.com/documentation/api-reference/endpoint/search), [Brave Web Search](https://api-dashboard.search.brave.com/api-reference/web/search/get), and Serper's Google Search endpoint. A live smoke test against each account is still required when keys are configured.
