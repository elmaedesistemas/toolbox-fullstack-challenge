import { configureStore } from '@reduxjs/toolkit'
import filesReducer, {
  loadFilesData,
  loadFilesList,
  setSelectedFileName
} from './filesSlice'
import {
  getFilesData,
  getFilesList
} from '../services/filesApi'

jest.mock('../services/filesApi')

function createStore () {
  return configureStore({
    reducer: {
      files: filesReducer
    }
  })
}

describe('filesSlice', () => {
  afterEach(() => {
    jest.resetAllMocks()
  })

  it('stores the selected file name', () => {
    const store = createStore()

    store.dispatch(setSelectedFileName('test2.csv'))

    expect(store.getState().files.selectedFileName).toBe('test2.csv')
  })

  it('stores the formatted files returned by the API', async () => {
    const files = [
      {
        file: 'test2.csv',
        lines: [
          {
            text: 'example',
            number: 123,
            hex: '70ad29aacf0b690b0467fe2b2767f765'
          }
        ]
      }
    ]

    getFilesData.mockResolvedValue(files)

    const store = createStore()

    await store.dispatch(loadFilesData('test2.csv'))

    const state = store.getState().files

    expect(state.files).toEqual(files)
    expect(state.isDataLoading).toBe(false)
    expect(state.dataError).toBeNull()
  })

  it('stores the error when the data request fails', async () => {
    getFilesData.mockRejectedValue(
      new Error('Unable to retrieve file data: HTTP 502')
    )

    const store = createStore()

    await store.dispatch(loadFilesData())

    const state = store.getState().files

    expect(state.files).toEqual([])
    expect(state.isDataLoading).toBe(false)
    expect(state.dataError).toBe(
      'Unable to retrieve file data: HTTP 502'
    )
  })

  it('stores the available file names', async () => {
    getFilesList.mockResolvedValue(['test1.csv', 'test2.csv'])

    const store = createStore()

    await store.dispatch(loadFilesList())

    const state = store.getState().files

    expect(state.fileNames).toEqual(['test1.csv', 'test2.csv'])
    expect(state.isListLoading).toBe(false)
    expect(state.listError).toBeNull()
  })

  it('stores the error when the file list request fails', async () => {
    getFilesList.mockRejectedValue(
      new Error('Unable to retrieve the file list: HTTP 500')
    )

    const store = createStore()

    await store.dispatch(loadFilesList())

    const state = store.getState().files

    expect(state.fileNames).toEqual([])
    expect(state.listError).toBe(
      'Unable to retrieve the file list: HTTP 500'
    )
  })

  it('keeps the previous data when a request is aborted', async () => {
    const abortError = new Error('Aborted')
    abortError.name = 'AbortError'

    getFilesData
      .mockResolvedValueOnce([{ file: 'test1.csv', lines: [] }])
      .mockRejectedValueOnce(abortError)

    const store = createStore()

    await store.dispatch(loadFilesData())
    await store.dispatch(loadFilesData())

    const state = store.getState().files

    expect(state.files).toEqual([{ file: 'test1.csv', lines: [] }])
    expect(state.dataError).toBeNull()
  })
})
