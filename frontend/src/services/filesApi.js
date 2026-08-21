import { API_BASE_URL } from '../config'

async function parseResponse (response, errorMessage) {
  if (!response.ok) {
    throw new Error(`${errorMessage}: HTTP ${response.status}`)
  }

  return response.json()
}

export async function getFilesData (fileName, signal) {
  const query = fileName
    ? `?fileName=${encodeURIComponent(fileName)}`
    : ''

  const response = await fetch(
    `${API_BASE_URL}/files/data${query}`,
    { signal }
  )

  return parseResponse(response, 'Unable to retrieve file data')
}

export async function getFilesList (signal) {
  const response = await fetch(
    `${API_BASE_URL}/files/list`,
    { signal }
  )

  const data = await parseResponse(
    response,
    'Unable to retrieve the file list'
  )

  return data.files
}
