# Virkarekisteri

## Technologies

Vite + React + SWA

## Development

### Prerequisites

- Node.js 20+
- `npm install`

### Running

- `npm run dev` - runs the dev server which supports hot module reloading.
- `npm run build` - builds the project for production.
- `npm run preview` - serves the **last built** production project from `dist/`
- `npm run swa` - starts Azure Static Web Apps emulator & dev server

### Linting

This project uses ESLint and Prettier.  
You should set your IDE to use them and automatically run both on save.

Optionally, you can use the following commands:

- `npm run lint:check` - runs ESLint and reports (doesn't fix) problems
- `npm run lint` - runs ESLint and fixes all auto-fixable problems
- `npm run format` - runs Prettier and formats all files
- `npm run lint+format` - runs both ESLint auto-fixes and Prettier formatting
