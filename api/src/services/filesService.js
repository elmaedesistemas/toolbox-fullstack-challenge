const parseCsv = require('../utils/parseCsv')

class FilesService {
  constructor (externalFilesClient) {
    this.externalFilesClient = externalFilesClient
  }

  async getAvailableFiles () {
    return this.externalFilesClient.listFiles()
  }

  async getFormattedFiles (fileName) {
    const availableFiles = await this.getAvailableFiles()

    const fileNames = fileName
      ? availableFiles.filter(availableFile => availableFile === fileName)
      : availableFiles

    // we continue downloading files if we receive an error in a download of some file vs .all(), it reject all the process
    const results = await Promise.allSettled(
      fileNames.map(currentFileName =>
        this.downloadAndFormat(currentFileName)
      )
    )

    return results
      .filter(result => result.status === 'fulfilled')
      .map(result => result.value)
    // we filter files with 0 lines, empty files basically
      .filter(file => file.lines.length > 0)
  }

  async downloadAndFormat (fileName) {
    const content = await this.externalFilesClient.downloadFile(fileName)

    return {
      file: fileName,
      lines: parseCsv(content, fileName)
    }
  }
}

module.exports = FilesService
