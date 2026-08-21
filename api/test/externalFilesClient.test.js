/* eslint-env mocha */

const { expect } = require('chai')
const ExternalFilesClient = require(
  '../src/services/externalFilesClient'
)

describe('ExternalFilesClient', () => {
  it('returns the list of available files', async () => {
    const httpClient = {
      get: async path => {
        expect(path).to.equal('/files')

        return {
          data: {
            files: ['file1.csv', 'file2.csv']
          }
        }
      }
    }

    const client = new ExternalFilesClient(httpClient)
    const files = await client.listFiles()

    expect(files).to.deep.equal([
      'file1.csv',
      'file2.csv'
    ])
  })

  it('throws when the file list response is invalid', async () => {
    const httpClient = {
      get: async () => ({
        data: {
          invalid: []
        }
      })
    }

    const client = new ExternalFilesClient(httpClient)

    try {
      await client.listFiles()
      throw new Error('Expected listFiles to throw')
    } catch (error) {
      expect(error.message).to.equal(
        'The external API returned an invalid file list'
      )
    }
  })

  it('downloads a file as text', async () => {
    const httpClient = {
      get: async (path, options) => {
        expect(path).to.equal('/file/file1.csv')
        expect(options).to.deep.equal({
          responseType: 'text'
        })

        return {
          data: 'file,text,number,hex'
        }
      }
    }

    const client = new ExternalFilesClient(httpClient)
    const content = await client.downloadFile('file1.csv')

    expect(content).to.equal('file,text,number,hex')
  })

  it('encodes the file name before downloading it', async () => {
    const httpClient = {
      get: async path => {
        expect(path).to.equal('/file/file%20one.csv')

        return {
          data: ''
        }
      }
    }

    const client = new ExternalFilesClient(httpClient)

    await client.downloadFile('file one.csv')
  })
})
