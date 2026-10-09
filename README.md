# ADOFront

Angular front end for [ADO](https://github.com/DiegoHahn/ADO), a time tracker that logs the hours you spend on Azure DevOps tasks and writes them back to the work items for you.

Instead of opening each task in Azure DevOps and editing *Completed Work* and *Remaining Work* by hand, you pick the user story and task here, start a timer, and stop it when you are done. The API stores the record and a scheduled job updates the work item in Azure DevOps.

<!-- TODO(Diego): add screenshots of the login, activity form and report screens. -->
<!-- ![Activity form](docs/screenshots/activity-form.png) -->
<!-- ![Daily report](docs/screenshots/report.png) -->

## Features

- **Login by email.** If the email is already registered, the stored settings are loaded. Otherwise you are sent to the personal data screen.
- **Personal data.** Save your Azure DevOps board and Personal Access Token. The API validates the token against Azure DevOps before saving it.
- **Activity form.** Enter a user story ID, pick one of your tasks under it, and start or stop the timer. On stop, the record is sent to the API.
- **Reports.** List the records you logged on a given date or for a given work item.

## Stack

- Angular 18 (NgModules, lazy-loaded feature modules, reactive forms)
- RxJS
- Jest with `jest-preset-angular`

## Running locally

Requirements: Node.js 20 or newer, and the [ADO API](https://github.com/DiegoHahn/ADO) running (by default on `http://localhost:8080`).

```bash
npm ci
npm start          # http://localhost:4200
```

### API URL

The API base URL comes from the Angular environment files:

| File | Used by | Default |
|---|---|---|
| `src/environments/environment.development.ts` | `ng serve`, `ng build --configuration development` | `http://localhost:8080` |
| `src/environments/environment.ts` | `ng build` (production) | `http://localhost:8080` |

Change `apiUrl` in the production file before building for a deployed API. The value is compiled into the bundle, so it must be a URL the browser can reach.

### With Docker

The `Dockerfile` builds the production bundle and serves it with an unprivileged nginx on port 8080 inside the container:

```bash
docker build -t ado-front .
docker run --rm -p 4200:8080 ado-front    # http://localhost:4200
```

The [ADO repository](https://github.com/DiegoHahn/ADO) has a `docker-compose.yml` that can start PostgreSQL, the API and this front end together when both repositories are cloned side by side.

## Tests

```bash
npm test           # Jest with coverage
npm run test:watch
```

## Known limitations

- The login only identifies the user by email. There is no password or session, so this is meant for personal or local use, not for a shared deployment.
- The user's email and settings are kept in `localStorage`.

## Related

- [ADO](https://github.com/DiegoHahn/ADO): the Spring Boot API, the database and the Azure DevOps sync.
