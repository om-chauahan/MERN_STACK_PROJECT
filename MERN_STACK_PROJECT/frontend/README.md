# Frontend — Event Management System

This React app powers the UI for the Event Management System.

## Highlights

- Static header (no collapse/toggler) with role-aware links
	- Brand (links to About)
	- Home, Events
	- Dashboard, Create Event (admin/organizer only)
	- Theme toggle + avatar initials + name + role badge
	- Avatar dropdown: Profile, Settings, Logout
- About page: “Get Started”, “Learn More”, and “Contact Admin” CTAs removed; hero and sections remain.
- Settings page: Left nav simplified (General, Security, Appearance); Notifications section removed.

## Scripts

```bash
# Start in development (from repo root)
npm run dev

# Or only the frontend
cd frontend
npm start
```

## Routing

- `/` Home
- `/about` About (brand link)
- `/events` Events list
- `/dashboard` Dashboard (admin/organizer)
- `/create-event` Create Event (admin/organizer)
- `/profile` Profile
- `/settings` Settings

## Bootstrap Dropdowns

This UI uses Bootstrap 5. Ensure the JavaScript bundle is loaded, otherwise dropdowns (avatar menu) won’t open.

- Imported in `src/App.js`:

```js
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
```

- Alternatively via CDN in `public/index.html`.

Verify in DevTools console:

```js
window.bootstrap // should be defined
```

## Theming

A light/dark theme toggle is exposed in the header. Theme is managed by the app’s ThemeContext and applied across pages.
