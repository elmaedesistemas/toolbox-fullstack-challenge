const chai = require('chai')
const chaiHttp = require('chai-http')
const app = require('../src/app')

chai.use(chaiHttp)

const { expect } = chai

describe('GET /files/data', () => {
    it('returns an empty JSON array', async () => {
        const response = await chai
            .request(app)
            .get('/files/data')

        expect(response).to.have.status(200)
        expect(response).to.have.header(
            'content-type',
            /application\/json/
        )
        expect(response.body).to.deep.equal([])
    })
})

describe('Unknown routes', () => {
    it('returns a JSON 404 response', async () => {
        const response = await chai
            .request(app)
            .get('/unknown')

        expect(response).to.have.status(404)
        expect(response.body).to.deep.equal({
            error: 'Not found'
        })
    })
})