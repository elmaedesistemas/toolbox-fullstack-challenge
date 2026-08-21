# Toolbox Full Stack Challenge

Full Stack JavaScript application developed for the Toolbox technical challenge.

The project retrieves CSV files from a provided external API, validates and reformats their contents through a Node.js REST API, and displays the resulting information in a React application.

## Project overview

The repository is organized as a monorepo containing:

- A Node.js 14 and Express REST API.
- A Node.js 16, React and React Bootstrap frontend.
- API tests using Mocha and Chai.
- Frontend tests using Jest and React Testing Library.
- Redux Toolkit state management.
- Docker Compose support for running the complete application.

## Quick start with Docker

Docker is the recommended way to run the complete project because it automatically uses the required Node.js version for each application.

### Requirements

- Docker
- Docker Compose

### Start the application

From the repository root:

```bash
docker compose up --build
```

Once both containers are running:

| Service | URL |
|---|---|
| Frontend | [http://localhost:3000](http://localhost:3000) |
| API | [http://localhost:3001](http://localhost:3001) |
| Formatted data | [http://localhost:3001/files/data](http://localhost:3001/files/data) |
| Available files | [http://localhost:3001/files/list](http://localhost:3001/files/list) |

Stop the application:

```bash
docker compose down
```

## Architecture

The application follows this flow:

1. The frontend requests the available file list from the local API.
2. The local API requests the file list from the provided external API.
3. The local API downloads each CSV file concurrently.
4. Invalid or incomplete CSV rows are discarded.
5. Valid rows are formatted as JSON.
6. The frontend displays the results in a responsive table.
7. Selecting a file sends a filtered request to the local API.

## Repository structure

```text
toolbox-fullstack-challenge/
├── api/
│   ├── src/
│   ├── test/
│   ├── Dockerfile
│   ├── package.json
│   └── README.md
├── frontend/
│   ├── public/
│   ├── src/
│   ├── Dockerfile
│   ├── nginx.conf
│   ├── package.json
│   └── README.md
├── docker-compose.yml
└── README.md
```

Detailed documentation:

- [API documentation](./api/README.md)
- [Frontend documentation](./frontend/README.md)

## API

The API is built with:

- Node.js 14
- Express
- Axios
- csv-parse
- Mocha
- Chai
- JavaScript Standard Style

### Endpoints

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/files/data` | Returns all valid formatted file data |
| `GET` | `/files/data?fileName=<name>` | Returns data for a specific file |
| `GET` | `/files/list` | Returns the available file list |

Example:

```bash
curl http://localhost:3001/files/data
```

## Frontend

The frontend is built with:

- Node.js 16
- React 18
- React Bootstrap
- Bootstrap 5
- Redux Toolkit
- React Redux
- Webpack
- Jest
- React Testing Library
- JavaScript Standard Style

The application includes:

- Responsive file-data table.
- File-name selector.
- Loading state.
- Empty state.
- API error handling.
- Centralized Redux state.
- Functional components and Effect Hooks.

## Running locally without Docker

The API and frontend require different Node.js versions. Each project contains its own `.nvmrc`.

### Start the API

```bash
cd api
nvm install
nvm use
npm ci
npm start
```

The API will run at:

```text
http://localhost:3001
```

### Start the frontend

In another terminal:

```bash
cd frontend
nvm install
nvm use
npm ci
npm start
```

The frontend will run at:

```text
http://localhost:3000
```

No globally installed dependencies or environment variables are required.

## Testing and validation

### API

```bash
cd api
nvm use
npm run lint
npm test
```

### Frontend

```bash
cd frontend
nvm use
npm run lint
npm test
npm run build
```

## Error handling

The project handles:

- Empty external files.
- Invalid or incomplete CSV rows.
- Invalid numbers and hexadecimal values.
- Individual file-download failures.
- External file-list failures.
- Unknown file-name filters.
- Empty filter parameters.
- Unknown API routes.
- Frontend connection failures.
- Loading and empty states.
- Obsolete frontend requests.

An individual file-download failure does not prevent successfully downloaded files from being returned.

## Challenge requirements

### Required API features

- [x] Node.js 14
- [x] Express REST API
- [x] `GET /files/data`
- [x] External file listing and downloading
- [x] CSV parsing and validation
- [x] Invalid-line handling
- [x] Individual download-error handling
- [x] JSON responses
- [x] Mocha and Chai tests
- [x] `npm start`
- [x] `npm test`

### Required frontend features

- [x] Node.js 16
- [x] React
- [x] React Bootstrap
- [x] Webpack
- [x] Functional components
- [x] Effect Hooks
- [x] Formatted data table
- [x] Loading and error states

### Optional features

- [x] `GET /files/list`
- [x] Filter using `fileName`
- [x] JavaScript Standard Style
- [x] Frontend file-name filter
- [x] Redux Toolkit
- [x] Jest unit tests
- [x] Docker
- [x] Docker Compose

## Implementation decisions

- File downloads run concurrently using `Promise.allSettled`.
- Individual file failures are tolerated to provide partial successful results.
- CSV parsing is isolated from external API communication.
- Express dependencies are injectable for isolated testing.
- Redux Toolkit centralizes frontend data, filter and request state.
- HTTP requests are cancelled when their corresponding Effect Hook is cleaned up.
- React Bootstrap satisfies the required layout technology.
- Docker uses Node.js 14 for the API and Node.js 16 for the frontend.
- Nginx serves the frontend production build.
- No environment variables are required to run the project.

## Submission validation

Before submitting the repository:

```bash
docker compose up --build
```

Verify:

```bash
curl http://localhost:3001/files/list
curl http://localhost:3001/files/data
curl "http://localhost:3001/files/data?fileName=test2.csv"
```

Then open:

```text
http://localhost:3000
```