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
        expect(response).to.be.json
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
        expect(response).to.be.json
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
        expect(response).to.be.json
        expect(response.body).to.deep.equal({
            error: 'Route not found'
        })
    })
})