import {
  getFilesData,
  getFilesList
} from './filesApi'

describe('filesApi', () => {
  beforeEach(() => {
    global.fetch = jest.fn()
  })

  afterEach(() => {
    jest.restoreAllMocks()
  })

  it('requests file data using the selected file name', async () => {
    const responseData = [
      {
        file: 'test 1.csv',
        lines: []
      }
    ]

    global.fetch.mockResolvedValue({
      ok: true,
      json: async () => responseData
    })

    const result = await getFilesData('test 1.csv')

    expect(global.fetch).toHaveBeenCalledWith(
      'http://localhost:3001/files/data?fileName=test%201.csv',
      {
        signal: undefined
      }
    )

    expect(result).toEqual(responseData)
  })

  it('returns the available file list', async () => {
    global.fetch.mockResolvedValue({
      ok: true,
      json: async () => ({
        files: ['test1.csv', 'test2.csv']
      })
    })

    const result = await getFilesList()

    expect(result).toEqual([
      'test1.csv',
      'test2.csv'
    ])
  })

  it('rejects unsuccessful API responses', async () => {
    global.fetch.mockResolvedValue({
      ok: false,
      status: 502
    })

    await expect(
      getFilesData()
    ).rejects.toThrow(
      'Unable to retrieve file data: HTTP 502'
    )
  })
})
