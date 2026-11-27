# SkyOps Frontend

SkyOps is a full-stack flight operations system for managing flights, passengers and ticket bookings. It is split into two repositories that are built to work together:

| Part                       | Repository                                                     | Stack                                                 |
| -------------------------- | -------------------------------------------------------------- | ----------------------------------------------------- |
| Backend                    | [SkyOps](https://github.com/Adam-hash-a11y/SkyOps)             | Express 5, TypeScript, MongoDB 7, JWT, Docker Compose |
| Frontend (this repository) | [skyops-forms](https://github.com/Adam-hash-a11y/skyops-forms) | React 19, TypeScript, Vite, styled-components         |

The backend owns the business rules and the data: seat maps, ticket prices, and all-or-nothing bookings. This frontend is a single-page application that consumes its REST API, validates input for instant feedback, and presents the data in English, French and German. Every visual value comes from a central design token system.

## At a glance

|                      |                                                                                      |
| -------------------- | ------------------------------------------------------------------------------------ |
| Language             | TypeScript                                                                           |
| Framework            | React 19, built with Vite 8                                                          |
| Styling              | styled-components 6, with a design token system                                      |
| Routing              | react-router-dom 7                                                                   |
| HTTP                 | axios, with a response interceptor for error messages                                |
| State                | `useReducer` for forms and filters, `useState` for page data                         |
| Internationalization | react-i18next: English, French, German                                               |
| Notifications        | react-toastify                                                                       |
| Validation           | Form validators in `src/validators`, run inside the form reducers                    |
| Tests                | Vitest 4, Testing Library, user-event, jest-dom, jsdom: **43 test files, 347 tests** |
| CI                   | GitHub Actions: tests and ESLint on every pull request                               |
| Code quality         | ESLint, TypeScript strict build                                                      |

## Contents

1. [Features](#features)
2. [Getting started](#getting-started)
3. [Scripts](#scripts)
4. [Architecture](#architecture)
5. [Design decisions](#design-decisions)
6. [Internationalization](#internationalization)
7. [Design tokens and styling](#design-tokens-and-styling)
8. [Forms, validation and errors](#forms-validation-and-errors)
9. [Testing](#testing)
10. [Continuous integration and workflow](#continuous-integration-and-workflow)

---

## Features

**Flights**

- List all flights with status, route, UTC times, and a seat progress bar that turns orange from 90% and red at 100%.
- Filter by status, origin and destination, and sort by departure time. Reset returns the full list. Search is disabled while the origin or destination has 1 or 2 letters (only 0 or 3 are valid IATA input).
- Create a flight with its seat counts per class. Edit a flight: the flight number is locked and the seat counts are not editable.
- Delete a flight. The confirmation shows how many tickets reference it, and only when there are some.
- Details page with every ticket of the flight, and a cancel flow.
- The Book button is disabled for full flights and for flights that are not scheduled or delayed.

**Passengers**

- List, filter by first name, last name and nationality, create, edit (the passport number is locked) and delete.
- Details page with the passenger's tickets.

**Tickets**

- Book a ticket from a flight card, from a passenger card, or from the tickets page.
- The booking form is a cascade: flight, then passenger, then class (with the number of free seats per class), then seat. The price is shown by class. The Book button stays disabled until all four fields are set.
- Filter tickets by flight or by passenger. Cancel a ticket from any list or details page. A cancelled ticket cannot be cancelled again.
- Tickets whose flight or passenger was deleted are shown with a clear "Deleted flight" or "Deleted passenger" label.

**General**

- Language switcher in the header (English, French, German) with flags.
- Loading and empty states on every list and details page, and a 404 page.
- Toast notifications for every create, update, delete, booking and cancellation, and for every error.
- All times are shown in UTC, 24-hour format.

---

## Getting started

**Requirements:** Node.js 20 and Docker (for the backend).

**1. Start the backend**

The frontend needs the backend running on port `5100`. The backend repository has the full setup (Docker Compose, `.env`). In short:

```bash
git clone https://github.com/Adam-hash-a11y/SkyOps.git
cd SkyOps
# create the .env file as described in the backend README
docker compose up -d
docker compose exec api npm run seed   # optional demo data
```

**2. Start the frontend**

```bash
git clone https://github.com/Adam-hash-a11y/skyops-forms.git
cd skyops-forms
npm install
npm run dev
```

Open `http://localhost:5173`. The backend allows this origin through CORS.

The API base URL is `http://localhost:5100/api` and is set in `src/service/axios.ts`. No login is needed: on start, the app requests a token from `GET /api/login` and sends it as a Bearer token with every request. It shows "Connecting..." until the token arrives.

The tests do not need the backend: it is never called (see [Testing](#testing)).

---

## Scripts

| Command                                        | Purpose                                        |
| ---------------------------------------------- | ---------------------------------------------- |
| `npm run dev`                                  | Start the Vite dev server                      |
| `npm run build`                                | Type-check (`tsc -b`) and build for production |
| `npm run preview`                              | Serve the production build locally             |
| `npm run lint`                                 | Run ESLint                                     |
| `npm test`                                     | Run all tests once with Vitest                 |
| `npx vitest run test/<folder>/<File>.test.tsx` | Run one test file                              |

---

## Architecture

Data flows in one direction, and each layer has one job.

```text
component -> service -> axios instance -> backend
                \-> mapper (API shape <-> app shape)
```

| Layer      | Responsibility                                                                                         |
| ---------- | ------------------------------------------------------------------------------------------------------ |
| Components | Rendering and user interaction. Pages own their data and pass handlers to their children               |
| Reducers   | Form and filter state. Each modal and list keeps `reducer.ts` and `action.ts` next to it               |
| Validators | Pure functions that return an error message, or an empty string when the value is valid                |
| Services   | One function per API call. No UI code                                                                  |
| Mappers    | Convert between the API shape (for example `route.origin`, lowercase status) and the shape the UI uses |
| Types      | Enums and shared interfaces: flight status, ticket status, ticket class, entity names                  |
| Utils      | Date formatting (UTC), price formatting (EUR), city names                                              |
| Theme      | Design tokens exposed as one plain object                                                              |

```text
src
├── app                  App.tsx, GlobalStyle.ts
├── components
│   ├── header, rootLayout, notFound
│   ├── flighList        flights page + reducer + action
│   ├── flightCard, flightFilters, flightDetailsPage
│   ├── passengerList    passengers page + reducer + action
│   ├── passengerCard, passengerFilters, passengerDetailsPage
│   ├── ticketList       tickets page + reducer + action
│   ├── ticketFilters
│   └── shared           button, iconButton, formInput, formInputError,
│                        statusBadge, progressBar, warningBox, ticketCard,
│                        deleteModal, ticketCancelModal,
│                        flightFormModal, passengerFormModal, ticketFormModal
├── constants            nationalities.ts
├── i18n                 i18n.ts and locales/{en,fr,de}/translation.json
├── mappers              flightMapper, passengerMapper, ticketMapper
├── service              axios.ts, flightService, passengerService, ticketService
├── theme                tokens.ts, theme.ts
├── types                entityTypes, flightTypes, passengerTypes, ticketTypes
├── utils                cityNames, formatDateTime, priceFormater
└── validators           flightForm.validator, passengerForm.validator

test                     one folder per source folder, one test file per source file
├── setup                setup.ts
├── validators, mappers, utils, service
├── formInput, button, iconButton, formInputError, statusBadge, progressBar
├── ticketCard, deleteModal, ticketCancelModal
├── flightFormModal, passengerFormModal, ticketFormModal   component + reducer tests
├── header, notFound, flightCard, passengerCard
├── flightFilters, passengerFilters, ticketFilters
├── flighList, passengerList, ticketList                   page + reducer tests
├── flightDetailsPage, passengerDetailsPage
└── app
```

### How the pages connect

- `App` logs in, then renders the routes inside `RootLayout` (header + page): `/` and `/flights`, `/flights/:flightNumber`, `/passengers`, `/passengers/:passportNumber`, `/tickets`, and a 404 for anything else.
- Each list page mounts its own modals: the form modal (create or edit), the delete modal, and the ticket booking modal. A modal opens when a button on the page or on a card sets a piece of state, and closes through the same state.
- Opening the delete modal shows it at once, then loads the number of tickets that reference the item. The warning appears only when that number is above zero.
- After a successful create, update, booking or cancellation, the page resets its filters, reloads the list from the API and shows a success toast.

---

## Design decisions

| Decision                                                                                                                                                                                     | Reason                                                                                                                                                      |
| -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------- |
| The backend is the source of truth. After every write, the page reloads from the API                                                                                                         | The list always matches the server. There is no local copy that can drift                                                                                   |
| Frontend validation gives instant feedback. The backend re-validates everything                                                                                                              | Users see mistakes while typing, and the server stays the authority                                                                                         |
| No React Context and no Provider. The theme is a plain imported object, and i18next is initialised once                                                                                      | The theme is static, so a Provider would add runtime cost for no benefit. It also keeps tests simple: components render without any wrapper except a router |
| Error handling lives once, in the axios interceptor. It copies the backend's `message` into `error.message`, or sets "Server not reachable". Components only show `error.message` in a toast | No repeated status-code logic in components                                                                                                                 |
| Enums live in `src/types`. The API's lowercase strings are mapped to the app enums in the mappers                                                                                            | One place for each value, and the UI never handles raw API strings                                                                                          |
| Each modal keeps its reducer and actions beside it                                                                                                                                           | A form's state, actions and view stay together, and the reducer is a pure function that is tested without rendering                                         |
| Validators are pure functions that return a message                                                                                                                                          | They are tested on their own, with boundary values                                                                                                          |
| The seats request in the booking form ignores responses from outdated requests                                                                                                               | Switching flights quickly can never show another flight's seats or prices                                                                                   |
| Details pages show a loading state before deciding between the page and the 404                                                                                                              | The 404 never flashes while data is still loading                                                                                                           |
| Option lists (statuses, nationalities, ticket classes) are built inside components                                                                                                           | They update when the language changes                                                                                                                       |
| Nationalities come from one constant of the 9 codes the backend accepts                                                                                                                      | The form and the filter share a single list that matches the API                                                                                            |

---

## Internationalization

- Library: `react-i18next`, initialised once in `src/i18n/i18n.ts` and imported in `main.tsx`. English is the fallback language.
- One JSON file per language in `src/i18n/locales/`. Keys are grouped by area: `common`, `header`, `flights`, `passengers`, `tickets`, `toast`, `validation`, and so on. Shared texts such as "Cancel" and "Search" are defined once under `common`.
- Texts with values use interpolation (for example `{{className}} ({{free}} free)`), so each language can place the value where its grammar needs it.
- Ticket classes and flight and ticket statuses are translated for display; the stored enum values (for example `Scheduled`) are never translated.
- Validation messages are translated too. The validators are plain functions, so they call `i18n.t(...)` directly.
- Error messages that come from the backend are shown as the server sends them.
- The language is switched from the header dropdown and applies immediately, without a page reload.
- The three translation files have the same keys and the same `{{variables}}`. They hold only values, so they are not tested on their own; the language switch is tested through the header and the app.

---

## Design tokens and styling

All visual values come from `src/theme/tokens.ts`, bundled in `src/theme/theme.ts`, and components import `theme` directly.

| Token group                                        | Content                                                                                                         |
| -------------------------------------------------- | --------------------------------------------------------------------------------------------------------------- |
| `colors`                                           | primary, accent, header, background, text, border, overlay, and status palettes (info, warning, error, success) |
| `fontFamily`, `fontSizes`, `fontWeights`           | IBM Plex Sans typography                                                                                        |
| `spacing`                                          | Keyed by pixel value, for example `theme.spacing[16]`                                                           |
| `borderRadius`, `shadows`, `zIndex`, `breakpoints` | Layout values                                                                                                   |

No component contains a hardcoded colour, font size, radius, spacing, z-index or breakpoint. The status badge and the toast container read the same status colours, so they cannot drift apart. Styling uses styled-components only.

---

## Forms, validation and errors

- Every form modal (flight, passenger, ticket) uses `useReducer`. The reducer runs the validators on each change and keeps `errors`, `touched` and a `disabled` flag.
- The submit button is disabled until the form is valid. An error appears under a field only after the user has left it; until then the field shows its hint.
- Edit mode locks the identifying field (flight number, passport number).
- The ticket form is a cascade: changing the flight clears class and seat, and changing the class clears the seat.
- Flight form rules: flight number `SKYOPS-` plus at least 3 digits, airline at least 5 characters, origin and destination 3 uppercase letters and not equal, departure before arrival, at least one seat in total.
- Passenger form rules: first and last name at least 3 characters, passport at least 6 characters, a nationality, a valid date of birth with age 18 or more, a valid email, a phone number of at least 8 characters.
- Every request failure ends in an error toast with the backend's message, and the modal stays open with the user's values.

---

## Testing

**43 test files, 347 tests, all green.** There are no end-to-end tests: the frontend never calls the real backend, which has its own test suite. Tests run in CI on every pull request.

### Three levels

| Level                | Files                                                                              | What it covers                                                                                                                                                                                                    |
| -------------------- | ---------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Logic                | validators (2), mappers (3), utils (3), reducers (6), services (3), `axios.ts` (1) | Pure functions and API wrappers. Validators and reducers are called directly, with boundary values. Services run against a mocked axios instance with the real mappers, and assert URL, payload and mapped result |
| Component unit tests | shared components (11), form modals (3), header, not found, cards (2), filters (3) | One component at a time, rendered on its own with props and mocked handlers. They check what the user sees and which handler is called, through typing, selecting, tabbing and clicking                           |
| Integration tests    | 3 list pages, 2 details pages, `App`                                               | A whole page with its real child components, modals and filters. Only the services and the toasts are mocked. Each test is one user story                                                                         |

### What the integration tests cover

- **List pages (flights, passengers, tickets):** loading then cards, the empty state, a failed load, create (service called with the right arguments in the right order, success toast, modal closed, list reloaded), failed create (error toast with the backend message, modal stays open, typed values kept), edit (prefilled form, locked identifier, update called instead of create), delete (modal first, then the ticket count and warning, confirm, card removed, failure keeps the card), booking from a card (flight or passenger already chosen), cancel flow, search, reset.
- **Guard rails:** Book disabled for full and for cancelled flights, Search disabled for 1 or 2 letter IATA codes, Cancel ticket disabled for cancelled tickets, Create disabled while the form is invalid, the warning shown only when tickets exist.
- **Details pages:** loading state (no 404 flash), 404 when the item does not exist, tickets list, empty state, "Deleted flight" and "Deleted passenger" labels, cancel flow with success and failure.
- **App:** login success, login failure (error toast, stays on "Connecting..."), every route, the 404 inside the layout, header navigation, "View details" and "View tickets" opening the right details page, and the language switch to French and German.
- **Header:** links and targets, the active link on list and details URLs, the language dropdown, and switching to French, German and back to English.

### Conventions

- Elements are located with hardcoded `data-testid` attributes and `getByTestId`, never by role or label. Ids are kebab-case, `<component>-<element>`. Shared components (button, icon button, form input) have one id used by all instances and are picked by position or scoped with `within(...)`.
- Every test follows Arrange, Act, Assert with comments, and is named as a sentence that describes a behaviour.
- Tests are grouped with `describe` blocks: rendering, user interactions, disabled, validation, failures.
- Services are mocked at module level (`vi.mock`), toasts are mocked and asserted with their exact text, and guard-rail paths also assert that no toast was shown.
- i18n is loaded in the test setup, so tests assert the real English texts. The language tests restore English after each test.
- No fake timers, no `it.each`, no helper components inside tests. Every test must answer the question: which bug would this catch?
- Test files are named after the source file and placed in `test/<source folder>/`.

### Not tested on purpose

Files that hold only values or styling: `theme.ts`, `tokens.ts`, `GlobalStyle.ts`, `FlightIcon`, `StyledToastContainer`, the `action.ts` files, the type files, `main.tsx`, `i18n.ts` and the translation files. `WarningBox` is covered through the delete and cancel modals, `RootLayout` through the `App` test, and `nationalities.ts` through the passenger form tests.

### Running the tests

Tests live in `test/`, and the setup file is `test/setup/setup.ts` (jest-dom matchers, the i18n instance, cleanup after each test). Vitest runs in the `jsdom` environment with globals enabled, and mock call history is cleared before every test.

```bash
npm test                                          # all tests, once
npx vitest run test/flighList/FlightList.test.tsx # one file
```

---

## Continuous integration and workflow

A GitHub Actions workflow (`.github/workflows/ci.yaml`) runs on Node 20 for pull requests into `main` and `refactor/ui-redesign`, and on pushes to those branches.

| Job          | Steps                                               |
| ------------ | --------------------------------------------------- |
| `unit-tests` | Install dependencies, run `npm test` (all 43 files) |
| `eslint`     | Install dependencies, run `npm run lint`            |

Workflow:

- Feature work happens on short-lived branches (`feat/`, `fix/`, `refactor/`, `test/`) that are merged through pull requests. The tests were added in six batches, one branch each: logic, reducers and form modals, services, shared components, other components, integration.
- Commits follow Conventional Commits, one commit per file. Source files that only received a `data-testid` use `refactor: add test id to ...`.
- Component files export only components. Enums sit in separate `.types.ts` files, which keeps the ESLint react-refresh rule satisfied.
