# Toolbox Full Stack Challenge — Frontend

React client for the Toolbox Full Stack Challenge.

The application consumes the local REST API, displays formatted CSV information in a responsive table and allows users to filter the results by file name.

## Technical requirements

- Node.js 16.x
- npm 8 or newer
- API running at `http://localhost:3001`
- No globally installed dependencies required
- No environment variables required

## Technologies

- React 18
- React Bootstrap
- Bootstrap 5
- Redux Toolkit
- React Redux
- Webpack 5
- Babel
- Jest
- React Testing Library
- JavaScript Standard Style
- Nginx for the Docker production build

## Installation

From the `frontend` directory:

```bash
nvm use
npm ci
```

The expected Node.js version is defined in `.nvmrc`:

```text
16.20.2
```

If that version is not installed:

```bash
nvm install
nvm use
```

## Available scripts

Start the development server:

```bash
npm start
```

The application will be available at:

```text
http://localhost:3000
```

Create a production build:

```bash
npm run build
```

Run JavaScript Standard Style:

```bash
npm run lint
```

Run the unit tests:

```bash
npm test
```

Run the tests in watch mode:

```bash
npm run test:watch
```

## Running locally

The API and frontend must run in separate terminals.

Start the API:

```bash
cd api
nvm use
npm ci
npm start
```

Start the frontend:

```bash
cd frontend
nvm use
npm ci
npm start
```

Open:

```text
http://localhost:3000
```

## Running with Docker Compose

From the repository root:

```bash
docker compose up --build
```

Available services:

| Service | URL |
|---|---|
| Frontend | `http://localhost:3000` |
| API | `http://localhost:3001` |

Stop the containers:

```bash
docker compose down
```

## Features

- Retrieves formatted CSV information from `GET /files/data`.
- Retrieves available file names from `GET /files/list`.
- Filters data using `GET /files/data?fileName=<fileName>`.
- Displays the information using a responsive React Bootstrap table.
- Provides loading, empty and error states.
- Uses functional React components.
- Uses Effect Hooks with request cleanup.
- Uses Redux Toolkit for centralized state management.
- Aborts obsolete HTTP requests when a component is unmounted or a filter changes.
- Supports local development and a production Docker build.

## Application flow

1. The application requests the available file list.
2. Redux stores the file names and current filter.
3. The application requests all formatted data.
4. Selecting a file updates the Redux filter.
5. An Effect Hook requests only the selected file.
6. The table renders the returned lines.
7. Loading and error states are updated centrally.

## State management

Redux Toolkit is the active state-management implementation.

It centralizes:

- Formatted file data.
- Available file names.
- Selected file name.
- Loading states.
- API errors.

Async requests are represented using Redux Toolkit async thunks, while React Effect Hooks dispatch those requests and cancel obsolete operations during cleanup.

## Demonstration alternatives

The custom hooks located in `src/hooks` are intentionally retained as an alternative implementation using local React state and Effect Hooks.

They are included solely for demonstration purposes and are not used by the active Redux implementation.

Because these modules are not imported by the application entry point, Webpack does not include them in the production bundle.

For a small screen like this one, local custom hooks would normally be sufficient. Redux Toolkit was included to demonstrate centralized state management and satisfy one of the optional challenge requirements.

## Error handling

The frontend handles:

- API connection failures.
- Unsuccessful HTTP responses.
- Empty datasets.
- Files without valid rows.
- File-list failures without preventing the main table from rendering.
- Obsolete requests using `AbortController`.

If the file-list request fails, the filter displays a warning while the data table remains independently available.

## Testing

The Jest test suite covers:

- Rendering formatted file rows.
- Rendering an empty state.
- Rendering available filter options.
- Selecting a file.
- Disabling the filter while loading.
- Building encoded API query parameters.
- Parsing API responses.
- Handling unsuccessful API responses.
- Redux state updates.
- Redux async-request results.

Run:

```bash
npm test
```

## Production build

Webpack generates the production assets in:

```text
dist/
```

The Docker image uses a multi-stage build:

1. Node.js 16 compiles the React application.
2. Nginx serves the generated static files.

The Nginx configuration also supports single-page application fallback routing.

## API configuration

The API base URL is defined in:

```text
src/config.js
```

Default value:

```js
export const API_BASE_URL = 'http://localhost:3001'
```

The challenge requires the application to run without environment variables, so the local API URL is included directly in the application configuration.

## Project structure

```text
frontend/
├── public/
│   └── index.html
├── src/
│   ├── components/
│   │   ├── FileFilter.jsx
│   │   ├── FileFilter.test.jsx
│   │   ├── FilesTable.jsx
│   │   └── FilesTable.test.jsx
│   ├── hooks/
│   │   ├── useFilesData.js
│   │   └── useFilesList.js
│   ├── services/
│   │   ├── filesApi.js
│   │   └── filesApi.test.js
│   ├── store/
│   │   ├── filesSlice.js
│   │   ├── filesSlice.test.js
│   │   └── index.js
│   ├── App.jsx
│   ├── config.js
│   ├── index.jsx
│   ├── setupTests.js
│   └── styles.css
├── .dockerignore
├── .nvmrc
├── babel.config.js
├── Dockerfile
├── jest.config.js
├── nginx.conf
├── package.json
├── package-lock.json
├── webpack.config.js
└── README.md
```

## Design decisions

- React Bootstrap was selected because it is explicitly required by the challenge.
- Redux Toolkit provides the Redux implementation with less boilerplate than classic Redux.
- API access is isolated in a service module.
- UI components remain focused on rendering and user interaction.
- The file table transforms the nested API response into renderable rows.
- Requests are cancelled during Effect Hook cleanup.
- Production assets are served by Nginx instead of Webpack Dev Server.