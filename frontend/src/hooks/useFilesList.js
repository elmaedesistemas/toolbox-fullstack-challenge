import { useEffect, useState } from 'react'
import { getFilesList } from '../services/filesApi'

function useFilesList () {
  const [fileNames, setFileNames] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const controller = new AbortController()

    async function loadFileNames () {
      setIsLoading(true)
      setError(null)

      try {
        const files = await getFilesList(controller.signal)
        setFileNames(files)
      } catch (requestError) {
        if (requestError.name !== 'AbortError') {
          setFileNames([])
          setError(requestError.message)
        }
      } finally {
        if (!controller.signal.aborted) {
          setIsLoading(false)
        }
      }
    }

    loadFileNames()

    return () => {
      controller.abort()
    }
  }, [])

  return {
    fileNames,
    isLoading,
    error
  }
}

export default useFilesList
