const express = require('express')

function createFilesRouter (filesService) {
  const router = express.Router()

  router.get('/data', async (req, res, next) => {
    try {
      const files = await filesService.getFormattedFiles()

      res.status(200).json(files)
    } catch (error) {
      next(error)
    }
  })

  return router
}

module.exports = createFilesRouter
