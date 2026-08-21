import { useEffect, useState } from 'react'
import { getFilesData } from '../services/filesApi'

function useFilesData (fileName) {
  const [files, setFiles] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const controller = new AbortController()

    async function loadFiles () {
      setIsLoading(true)
      setError(null)

      try {
        const data = await getFilesData(
          fileName,
          controller.signal
        )

        setFiles(data)
      } catch (requestError) {
        if (requestError.name !== 'AbortError') {
          setFiles([])
          setError(requestError.message)
        }
      } finally {
        if (!controller.signal.aborted) {
          setIsLoading(false)
        }
      }
    }

    loadFiles()

    return () => {
      controller.abort()
    }
  }, [fileName])

  return {
    files,
    isLoading,
    error
  }
}

export default useFilesData
