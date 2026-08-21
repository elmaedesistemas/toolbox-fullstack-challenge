import { API_BASE_URL } from '../config'

export async function getFilesData (fileName, signal) {
  const query = fileName
    ? `?fileName=${encodeURIComponent(fileName)}`
    : ''

  const response = await fetch(
        `${API_BASE_URL}/files/data${query}`,
        { signal }
  )

  if (!response.ok) {
    throw new Error(`Unable to retrieve files: HTTP ${response.status}`)
  }

  return response.json()
}
