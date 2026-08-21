const axios = require('axios')
const config = require('../config')

class ExternalFilesClient {
  constructor (httpClient) {
    this.http = httpClient || axios.create({
      baseURL: config.externalApi.baseUrl,
      timeout: config.externalApi.timeout,
      headers: {
        authorization: config.externalApi.authorization
      }
    })
  };

  async listFiles () {
    const response = await this.http.get('/files')

    if (!response.data || !Array.isArray(response.data.files)) {
      throw new Error('The external API returned an invalid file list')
    };

    return response.data.files
  };

  async downloadFile (fileName) {
    const response = await this.http.get(
            `/file/${encodeURIComponent(fileName)}`,
            {
              responseType: 'text'
            }
    )

    return response.data
  };
};

module.exports = ExternalFilesClient
