# UI design notes

Design follows Apple's Human Interface Guidelines (content layer vs. translucent functional layer).

- **Tokens** live in `frontend/src/app/globals.css` as RGB CSS variables (`--c-canvas`, `--c-surface`, `--c-fill`, `--c-ink`, `--c-ink-2`, `--c-line`, `--c-accent`, `--c-ok`, `--c-warn`, `--c-bad`). Light and dark switch automatically with the system setting.
- **Tailwind names** map to those tokens in `tailwind.config.js` (`bg-surface`, `text-ink-2`, `text-ok`, `bg-accent/10`, ...). Use these, not raw colours.
- **Components:** `.card`, `.field`, `.btn` (`btn-primary`, `btn-quiet`, `btn-plain`), `.glass` (toolbar and tab bar only).
- **Navigation:** top toolbar on desktop; bottom tab bar (5 tabs) on phones. Audit Log is reachable from the desktop toolbar and the footer.
- **Rules:** status is never colour alone (dot + label); no emoji; system font; body text at least 15px; secondary text uses `text-ink-2` (meets 4.5:1).
