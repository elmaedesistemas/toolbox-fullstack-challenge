const parseCsv = require('../utils/parseCsv')

class FilesService {
  constructor (externalFilesClient) {
    this.externalFilesClient = externalFilesClient
  };

  async getFormattedFiles () {
    const fileNames = await this.externalFilesClient.listFiles()

    // we continue downloading files if we receive an error in a download of some file vs .all(), it reject all the process
    const results = await Promise.allSettled(
      fileNames.map(fileName => {
        return this.downloadAndFormat(fileName)
      })
    )

    return results
      .filter(result => result.status === 'fulfilled')
      .map(result => result.value)
    // we filter files with 0 lines, empty files basically
      .filter(file => file.lines.length > 0)
  };

  async downloadAndFormat (fileName) {
    const content = await this.externalFilesClient.downloadFile(fileName)

    return {
      file: fileName,
      lines: parseCsv(content, fileName)
    }
  };
};

module.exports = FilesService
