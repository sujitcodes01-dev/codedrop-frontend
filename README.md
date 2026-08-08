# CodeDrop — Frontend

CodeDrop is a minimal, anonymous, temporary code-sharing tool. Paste code
into a Monaco editor, pick a language and an expiration time, and get back a
short link. Anyone who opens that link sees the code in a read-only Monaco
editor — until it expires, after which it's gone.

This is the frontend only. It's built to talk to the CodeDrop Spring Boot
backend running at `http://localhost:8080`.

## Technology Stack

- React 18
- Vite
- Plain JavaScript (no TypeScript)
- [`@monaco-editor/react`](https://github.com/suren-atoyan/monaco-react) for the editor
- React Router for the two routes the app needs
- Plain CSS (no Tailwind, no component library)
- Browser `fetch()` (no Axios)

No Redux, no Zustand — the whole app runs on `useState`/`useEffect` and
props passed down two or three levels at most.

## Installation

```bash
npm install
```

## Running Locally

```bash
npm run dev
```

The app runs at `http://localhost:5173`.

Make sure the backend is running at `http://localhost:8080` first — its
`CorsConfig` already allows `http://localhost:5173`, so no proxy is needed.

## Project Structure

```
codedrop-frontend/
│
├── public/
│
├── src/
│   ├── components/
│   │   ├── CodeEditor.jsx        Monaco wrapper (editor + cursor tracking)
│   │   ├── Header.jsx            Home page top bar (logo, controls, share)
│   │   ├── LanguageSelector.jsx  <select> for Monaco language + label lookup
│   │   ├── ExpirationSelector.jsx <select> for expiration minutes
│   │   ├── ShareButton.jsx       Presentational share trigger
│   │   └── ShareModal.jsx        Post-share success modal with copy link
│   │
│   ├── hooks/
│   │   └── useCountdown.js       Live "time remaining" countdown
│   │
│   ├── pages/
│   │   ├── Home.jsx              "/" — write and share code
│   │   ├── CodeView.jsx          "/code/:accessCode" — view shared code
│   │   └── NotFound.jsx          "*" — unmatched routes
│   │
│   ├── services/
│   │   └── codeApi.js            All fetch() calls to the backend, centralized
│   │
│   ├── App.jsx
│   ├── main.jsx
│   └── index.css
│
├── index.html
├── package.json
└── vite.config.js
```

## Backend

Base URL: `http://localhost:8080`

| Method | Endpoint                  | Purpose                       |
|--------|----------------------------|--------------------------------|
| POST   | `/api/codes`               | Create a new shared snippet    |
| GET    | `/api/codes/{accessCode}`  | Retrieve a shared snippet      |

**Create** — request body:

```json
{
  "content": "console.log('Hello World');",
  "language": "javascript",
  "expirationMinutes": 30
}
```

Response statuses: `201 Created`, `400 Bad Request`, `500 Internal Server Error`.

**Retrieve** — response statuses: `200 OK`, `404 Not Found`, `410 Gone`, `500 Internal Server Error`.

All API calls live in `src/services/codeApi.js`. Both functions throw an
`ApiError` (with a `.status` and a backend-provided `.message` when
available) on any non-2xx response, so pages can branch on status codes
(404 → "not found", 410 → "expired") without re-parsing anything.

## Design Direction

Dark, editor-first, closer to a code tool than a web app:

- Near-black background (`#0b0d0f`) with a slightly lighter panel tone (`#111418`)
- Purple/violet accent (`#7c3aed`) for the primary action and highlights
- Subtle borders, small radii, compact controls — no cards, no shadows, no gradients
- The Monaco editor is the visual centerpiece on both pages, taking up the vast majority of the viewport with no scrolling elsewhere on the page

All colors are CSS custom properties in `src/index.css` (`:root`), so the
palette can be retuned in one place.

## Monaco Integration

Both pages render the shared `CodeEditor` component:

```jsx
<Editor
  height="100%"
  language={language}
  value={content}
  theme="vs-dark"
  onChange={onChange}
  options={{
    readOnly,
    minimap: { enabled: false },
    fontSize: 14,
    scrollBeyondLastLine: false,
    automaticLayout: true
  }}
/>
```

- On the Home page it's editable, backed by `useState` for `content`.
- On the view page it's `readOnly`, and shows exactly what the backend
  returned — no formatting or transformation applied to the code content
  on either end.
- `automaticLayout: true` keeps it correctly sized through window resizes
  and mobile orientation changes.

## Routes

| Path                  | Page        | Behavior                                                        |
|------------------------|-------------|-------------------------------------------------------------------|
| `/`                    | `Home`      | Write code, pick language + expiration, share it                  |
| `/code/:accessCode`    | `CodeView`  | Loads the snippet; shows loading/expired/not-found/error states   |
| `*`                    | `NotFound`  | Any other path                                                    |

## Expiration Behavior

`useCountdown` computes the difference between `expiresAt` and the current
time and updates every second, formatting as `M:SS` or `H:MM:SS`. On the
view page, once the local countdown reaches zero the editor is swapped out
for the "Code Expired" state immediately — the app doesn't wait for a
failed request to notice. If the backend itself returns `410 Gone` (e.g. the
countdown drifted slightly behind the server), the same expired state is
shown.

## Notes

- The frontend never generates or modifies the access code — it's entirely
  backend-controlled and simply displayed once returned.
- Share URLs are built from `window.location.origin`, not a hardcoded
  `localhost:5173`, so this works unmodified after deployment.
- There's no authentication, accounts, history, or any feature beyond
  write → share → view, by design.
