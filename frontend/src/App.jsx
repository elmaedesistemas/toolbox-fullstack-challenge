import { useEffect } from 'react'
import {
    Alert,
    Container,
    Navbar,
    Spinner
} from 'react-bootstrap'
import {
    useDispatch,
    useSelector
} from 'react-redux'
import FileFilter from './components/FileFilter'
import FilesTable from './components/FilesTable'
import {
    loadFilesData,
    loadFilesList,
    setSelectedFileName
} from './store/filesSlice'
import './styles.css'

function App() {
    const dispatch = useDispatch()

    const {
        files,
        fileNames,
        selectedFileName,
        isDataLoading,
        isListLoading,
        dataError,
        listError
    } = useSelector(state => state.files)

    useEffect(() => {
        const request = dispatch(loadFilesList())

        return () => {
            request.abort()
        }
    }, [dispatch])

    useEffect(() => {
        const request = dispatch(
            loadFilesData(selectedFileName)
        )

        return () => {
            request.abort()
        }
    }, [dispatch, selectedFileName])

    function handleFileChange(fileName) {
        dispatch(setSelectedFileName(fileName))
    }

    return (
        <>
            <Navbar bg='danger' variant='dark'>
                <Container fluid>
                    <Navbar.Brand>React Test App</Navbar.Brand>
                </Container>
            </Navbar>

            <Container fluid className='page-container'>
                <h1 className='h3 mb-4'>Files data</h1>

                <FileFilter
                    fileNames={fileNames}
                    selectedFileName={selectedFileName}
                    isLoading={isListLoading}
                    onChange={handleFileChange}
                />

                {listError && (
                    <Alert variant='warning'>
                        The file filter is currently unavailable.
                    </Alert>
                )}

                {isDataLoading && (
                    <div
                        className='loading-container'
                        role='status'
                        aria-live='polite'
                    >
                        <Spinner animation='border' variant='danger' />
                        <span>Loading files...</span>
                    </div>
                )}

                {!isDataLoading && dataError && (
                    <Alert variant='danger'>
                        {dataError}
                    </Alert>
                )}

                {!isDataLoading && !dataError && (
                    <FilesTable files={files} />
                )}
            </Container>
        </>
    )
}

export default App