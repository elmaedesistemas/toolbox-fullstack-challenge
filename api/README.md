# Toolbox Full Stack Challenge — API

REST API built with Node.js and Express. It retrieves CSV files from the provided external API, validates and reformats their contents, and exposes the resulting data as JSON.

## Technical requirements

- Node.js 14.x
- npm 6 or newer
- No globally installed dependencies required
- No environment variables required

The expected Node.js version is defined in `.nvmrc`.

## Installation

From the `api` directory:

```bash
nvm use
npm ci
```

If Node.js 14 is not installed:

```bash
nvm install
nvm use
```

Alternatively, dependencies can be installed with:

```bash
npm install
```

## Available scripts

Start the API:

```bash
npm start
```

Run the test suite:

```bash
npm test
```

Run JavaScript Standard Style:

```bash
npm run lint
```

The API runs at:

```text
http://localhost:3001
```

## Running locally

From the `api` directory:

```bash
nvm use
npm ci
npm start
```

Verify the API:

```bash
curl -i http://localhost:3001/files/data
```

## Running with Docker Compose

From the repository root:

```bash
docker compose up --build
```

Available services:

| Service | URL |
|---|---|
| API | `http://localhost:3001` |
| Frontend | `http://localhost:3000` |

Verify the API container:

```bash
curl -i http://localhost:3001/files/list
```

Stop the containers:

```bash
docker compose down
```

## Endpoints

### Get formatted file data

```http
GET /files/data
```

Retrieves the available file list, downloads every file, discards invalid lines and returns the valid information formatted as JSON.

Example:

```bash
curl http://localhost:3001/files/data
```

Example response:

```json
[
  {
    "file": "test2.csv",
    "lines": [
      {
        "text": "example",
        "number": 123,
        "hex": "70ad29aacf0b690b0467fe2b2767f765"
      }
    ]
  }
]
```

### Filter by file name

```http
GET /files/data?fileName=<fileName>
```

Returns formatted data only for the requested file.

Example:

```bash
curl "http://localhost:3001/files/data?fileName=test2.csv"
```

If the requested file does not exist, the API returns:

```json
[]
```

An empty `fileName` returns HTTP `400`:

```json
{
  "error": "fileName must be a non-empty string"
}
```

### List available files

```http
GET /files/list
```

Returns the available files using the same response structure provided by the external API.

Example:

```bash
curl http://localhost:3001/files/list
```

Example response:

```json
{
  "files": [
    "test1.csv",
    "test2.csv"
  ]
}
```

## Data-processing flow

The API processes the external data using the following steps:

1. Retrieves the available file list.
2. Downloads the files concurrently.
3. Parses each CSV response.
4. Validates each CSV row.
5. Discards invalid rows.
6. Omits files without valid rows.
7. Returns the resulting information as JSON.

## CSV validation

Each CSV row must contain exactly these four columns:

```text
file,text,number,hex
```

A row is considered valid when:

- It contains exactly four values.
- The `file` value matches the downloaded file name.
- `text` is not empty.
- `number` is a valid finite number.
- `hex` contains exactly 32 hexadecimal characters.

Invalid rows are discarded without interrupting the processing of other rows.

Files containing no valid rows are omitted from the response.

## Error handling

- Failure to retrieve the external file list returns HTTP `502`.
- Failure to download an individual file does not interrupt other downloads.
- Invalid CSV rows are discarded.
- Empty files are ignored.
- An unknown file-name filter returns an empty array.
- An empty `fileName` query parameter returns HTTP `400`.
- Unknown application routes return HTTP `404`.
- All API responses use `application/json`.

## Architecture

The API separates its responsibilities into the following layers:

- **Routes:** Handle HTTP requests and responses.
- **Services:** Coordinate file listing, downloading and formatting.
- **External client:** Encapsulates communication with the provided external API.
- **CSV utility:** Parses and validates CSV content.
- **Application factory:** Creates the Express application with injectable dependencies.
- **Server:** Starts the HTTP listener.

## Implementation decisions

- `Promise.allSettled` allows file downloads to run concurrently while tolerating individual failures.
- The external API client is isolated from the formatting logic.
- CSV parsing is implemented as a separate utility.
- Dependencies are injected into the Express application so endpoint tests remain independent from the external API.
- The API returns partial successful results when individual files cannot be downloaded.
- CORS is enabled so the local frontend can consume the API.
- The external service configuration is included in the application because the challenge requires the project to run without environment variables.
- JavaScript Standard Style is used as an optional code-quality requirement.
- The Docker image uses the exact Node.js 14 runtime requested by the challenge.

## Project structure

```text
api/
├── src/
│   ├── routes/
│   │   └── files.js
│   ├── services/
│   │   ├── externalFilesClient.js
│   │   └── filesService.js
│   ├── utils/
│   │   └── parseCsv.js
│   ├── app.js
│   ├── config.js
│   └── server.js
├── test/
│   ├── externalFilesClient.test.js
│   ├── filesApi.test.js
│   ├── filesService.test.js
│   └── parseCsv.test.js
├── .dockerignore
├── .nvmrc
├── Dockerfile
├── package.json
├── package-lock.json
└── README.md
```

## Testing strategy

The test suite uses Mocha and Chai and covers:

- CSV parsing and validation.
- Quoted CSV values.
- Invalid and incomplete rows.
- Empty CSV files.
- External API client behavior.
- Individual download failures.
- Formatted file aggregation.
- File-name filtering.
- Unknown file-name filters.
- File listing.
- HTTP response content types and status codes.
- API error handling.
- Dependency-injected route behavior.

Run all tests with:

```bash
npm test
```

Before submitting changes, run:

```bash
npm run lint
npm test
```