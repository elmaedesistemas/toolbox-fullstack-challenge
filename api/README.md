# Toolbox Full Stack Challenge — API

REST API built with Node.js and Express. It retrieves CSV files from the provided external API, validates and reformats their contents, and exposes the resulting data as JSON.

## Technical requirements

- Node.js 14.x
- npm 6 or newer
- No globally installed dependencies required
- No environment variables required

## Installation

From the `api` directory:

```bash
npm install
```

For reproducible installations using the lockfile:

```bash
npm ci
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

If the requested file does not exist, the API returns an empty array.

An empty `fileName` returns:

```json
{
  "error": "fileName must be a non-empty string"
}
```

with HTTP status `400`.

### List available files

```http
GET /files/list
```

Returns the available files using the same structure provided by the external API.

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

## CSV validation

Each CSV row must contain exactly these four columns:

```text
file,text,number,hex
```

A row is considered valid when:

- It contains exactly four values.
- The `file` value matches the downloaded file name.
- `text` is not empty.
- `number` is a valid number.
- `hex` contains exactly 32 hexadecimal characters.

Invalid rows are discarded without interrupting the processing of other rows.

Files containing no valid rows are omitted from the response.

## Error handling

- Failure to retrieve the external file list returns HTTP `502`.
- Failure to download an individual file does not interrupt other downloads.
- Invalid CSV rows are discarded.
- Empty files are ignored.
- Unknown application routes return HTTP `404`.
- All API responses use `application/json`.

## Implementation decisions

- `Promise.allSettled` allows downloads to run concurrently while tolerating individual failures.
- The external API client is isolated from the formatting logic.
- CSV parsing is implemented as a separate utility.
- Dependencies are injected into the Express application to make endpoint tests independent from the external API.
- The API key and external service configuration are contained in the application because the challenge requires the project to run without environment variables.

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
├── package.json
└── README.md
```

## Testing strategy

The test suite covers:

- CSV parsing and validation.
- Invalid and incomplete rows.
- Empty CSV files.
- External API client behavior.
- Individual download failures.
- Formatted file aggregation.
- File-name filtering-name filtering.
- File listing.
- HTTP response formats and status codes.
- API error handling.