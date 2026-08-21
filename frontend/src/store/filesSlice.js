import {
    createAsyncThunk,
    createSlice
} from '@reduxjs/toolkit'
import {
    getFilesData,
    getFilesList
} from '../services/filesApi'

export const loadFilesData = createAsyncThunk(
    'files/loadData',
    async (fileName, { signal }) => {
        return getFilesData(fileName, signal)
    }
)

export const loadFilesList = createAsyncThunk(
    'files/loadList',
    async (_, { signal }) => {
        return getFilesList(signal)
    }
)

const initialState = {
    files: [],
    fileNames: [],
    selectedFileName: '',
    isDataLoading: false,
    isListLoading: false,
    dataError: null,
    listError: null
}

const filesSlice = createSlice({
    name: 'files',
    initialState,

    reducers: {
        setSelectedFileName(state, action) {
            state.selectedFileName = action.payload
        }
    },

    extraReducers: builder => {
        builder
            .addCase(loadFilesData.pending, state => {
                state.isDataLoading = true
                state.dataError = null
            })
            .addCase(loadFilesData.fulfilled, (state, action) => {
                state.isDataLoading = false
                state.files = action.payload
            })
            .addCase(loadFilesData.rejected, (state, action) => {
                state.isDataLoading = false

                if (action.error.name !== 'AbortError') {
                    state.files = []
                    state.dataError = action.error.message
                }
            })
            .addCase(loadFilesList.pending, state => {
                state.isListLoading = true
                state.listError = null
            })
            .addCase(loadFilesList.fulfilled, (state, action) => {
                state.isListLoading = false
                state.fileNames = action.payload
            })
            .addCase(loadFilesList.rejected, (state, action) => {
                state.isListLoading = false

                if (action.error.name !== 'AbortError') {
                    state.fileNames = []
                    state.listError = action.error.message
                }
            })
    }
})

export const {
    setSelectedFileName
} = filesSlice.actions

export default filesSlice.reducer