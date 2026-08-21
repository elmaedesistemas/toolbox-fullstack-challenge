const express = require('express')

function createFilesRouter (filesService) {
  const router = express.Router()

  router.get('/list', async (req, res, next) => {
    try {
      const files = await filesService.getAvailableFiles()

      res.status(200).json({ files })
    } catch (error) {
      next(error)
    }
  })

  router.get('/data', async (req, res, next) => {
    try {
      const { fileName } = req.query

      if (
        fileName !== undefined &&
        (typeof fileName !== 'string' || fileName.trim() === '')
      ) {
        return res.status(400).json({
          error: 'fileName must be a non-empty string'
        })
      }

      const normalizedFileName = fileName
        ? fileName.trim()
        : undefined

      const files = await filesService.getFormattedFiles(normalizedFileName)

      res.status(200).json(files)
    } catch (error) {
      next(error)
    }
  })

  return router
}

module.exports = createFilesRouter
