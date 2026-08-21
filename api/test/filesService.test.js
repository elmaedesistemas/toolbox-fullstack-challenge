/* eslint-env mocha */

const { expect } = require('chai')
const FilesService = require('../src/services/filesService')

const validFileContent = [
  'file,text,number,hex',
  'file1.csv,hello,42,70ad29aacf0b690b0467fe2b2767f765'
].join('\n')

describe('FilesService', () => {
  it('downloads and formats the available files', async () => {
    const externalFilesClient = {
      listFiles: async () => ['file1.csv'],
      downloadFile: async () => validFileContent
    }

    const service = new FilesService(externalFilesClient)
    const result = await service.getFormattedFiles()

    expect(result).to.deep.equal([
      {
        file: 'file1.csv',
        lines: [
          {
            text: 'hello',
            number: 42,
            hex: '70ad29aacf0b690b0467fe2b2767f765'
          }
        ]
      }
    ])
  })

  it('continues when an individual download fails', async () => {
    const externalFilesClient = {
      listFiles: async () => [
        'file1.csv',
        'broken.csv'
      ],
      downloadFile: async fileName => {
        if (fileName === 'broken.csv') {
          throw new Error('Download failed')
        }

        return validFileContent
      }
    }

    const service = new FilesService(externalFilesClient)
    const result = await service.getFormattedFiles()

    expect(result).to.have.length(1)
    expect(result[0].file).to.equal('file1.csv')
  })

  it('omits empty files', async () => {
    const externalFilesClient = {
      listFiles: async () => ['empty.csv'],
      downloadFile: async () => ''
    }

    const service = new FilesService(externalFilesClient)
    const result = await service.getFormattedFiles()

    expect(result).to.deep.equal([])
  })

  it('omits files without valid rows', async () => {
    const externalFilesClient = {
      listFiles: async () => ['invalid.csv'],
      downloadFile: async () => [
        'file,text,number,hex',
        'invalid.csv,text,not-a-number,invalid-hex'
      ].join('\n')
    }

    const service = new FilesService(externalFilesClient)
    const result = await service.getFormattedFiles()

    expect(result).to.deep.equal([])
  })

  it('returns an empty array when the list is empty', async () => {
    const externalFilesClient = {
      listFiles: async () => [],
      downloadFile: async () => {
        throw new Error('Should not download any file')
      }
    }

    const service = new FilesService(externalFilesClient)
    const result = await service.getFormattedFiles()

    expect(result).to.deep.equal([])
  })

  it('propagates an error when listing files fails', async () => {
    const externalFilesClient = {
      listFiles: async () => {
        throw new Error('Unable to list files')
      }
    }

    const service = new FilesService(externalFilesClient)

    try {
      await service.getFormattedFiles()
      throw new Error('Expected getFormattedFiles to throw')
    } catch (error) {
      expect(error.message).to.equal('Unable to list files')
    }
  })
})
