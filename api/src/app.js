const express = require('express')
const cors = require('cors')
const ExternalFilesClient = require('./services/externalFilesClient')
const FilesService = require('./services/filesService')
const createFilesRouter = require('./routes/files')

function createApp (dependencies = {}) {
  const externalFilesClient =
        dependencies.externalFilesClient || new ExternalFilesClient()

  const filesService =
        dependencies.filesService || new FilesService(externalFilesClient)

  const app = express()

  app.disable('x-powered-by')
  app.use(cors())
  app.use(express.json())

  app.use('/files', createFilesRouter(filesService))

  app.use((req, res) => {
    res.status(404).json({
      error: 'Route not found'
    })
  })

  app.use((error, req, res, next) => {
    if (res.headersSent) {
      return next(error)
    }

    res.status(502).json({
      error: 'Unable to retrieve files from the external API'
    })
  })

  return app
};

module.exports = createApp
