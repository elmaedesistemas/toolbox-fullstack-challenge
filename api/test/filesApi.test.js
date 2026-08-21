/* eslint-env mocha */

const chai = require('chai')
const chaiHttp = require('chai-http')
const createApp = require('../src/app')

chai.use(chaiHttp)

const { expect } = chai

describe('GET /files/data', () => {
  it('returns the formatted files', async () => {
    const expectedFiles = [
      {
        file: 'file1.csv',
        lines: [
          {
            text: 'hello',
            number: 123,
            hex: '70ad29aacf0b690b0467fe2b2767f765'
          }
        ]
      }
    ]

    const filesService = {
      getFormattedFiles: async () => expectedFiles
    }

    const app = createApp({ filesService })
    const response = await chai.request(app).get('/files/data')

    expect(response).to.have.status(200)
    expect(response.headers['content-type']).to.match(/^application\/json/)
    expect(response.body).to.deep.equal(expectedFiles)
  })

  it('returns 502 when the service fails', async () => {
    const filesService = {
      getFormattedFiles: async () => {
        throw new Error('External API error')
      }
    }

    const app = createApp({ filesService })
    const response = await chai.request(app).get('/files/data')

    expect(response).to.have.status(502)
    expect(response.headers['content-type']).to.match(/^application\/json/)
    expect(response.body).to.deep.equal({
      error: 'Unable to retrieve files from the external API'
    })
  })
})

describe('Unknown routes', () => {
  it('returns 404 as JSON', async () => {
    const filesService = {
      getFormattedFiles: async () => []
    }

    const app = createApp({ filesService })
    const response = await chai.request(app).get('/unknown')

    expect(response).to.have.status(404)
    expect(response.headers['content-type']).to.match(/^application\/json/)
    expect(response.body).to.deep.equal({
      error: 'Route not found'
    })
  })
})

describe('GET /files/list', () => {
  it('returns the available files using the external API format', async () => {
    const filesService = {
      getAvailableFiles: async () => [
        'file1.csv',
        'file2.csv'
      ]
    }

    const app = createApp({ filesService })
    const response = await chai.request(app).get('/files/list')

    expect(response).to.have.status(200)
    expect(response.headers['content-type']).to.match(/^application\/json/)
    expect(response.body).to.deep.equal({
      files: ['file1.csv', 'file2.csv']
    })
  })
})

describe('GET /files/data with fileName', () => {
  it('passes the fileName filter to the service', async () => {
    let receivedFileName

    const filesService = {
      getFormattedFiles: async fileName => {
        receivedFileName = fileName
        return []
      }
    }

    const app = createApp({ filesService })

    const response = await chai
      .request(app)
      .get('/files/data?fileName=file2.csv')

    expect(response).to.have.status(200)
    expect(receivedFileName).to.equal('file2.csv')
    expect(response.body).to.deep.equal([])
  })

  it('rejects an empty fileName', async () => {
    const filesService = {
      getFormattedFiles: async () => []
    }

    const app = createApp({ filesService })
    const response = await chai
      .request(app)
      .get('/files/data?fileName=')

    expect(response).to.have.status(400)
    expect(response.body).to.deep.equal({
      error: 'fileName must be a non-empty string'
    })
  })
})
