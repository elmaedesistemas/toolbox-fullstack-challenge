import { useState } from 'react'
import {
  Alert,
  Container,
  Navbar,
  Spinner
} from 'react-bootstrap'
import FileFilter from './components/FileFilter'
import FilesTable from './components/FilesTable'
import useFilesData from './hooks/useFilesData'
import useFilesList from './hooks/useFilesList'
import './styles.css'

function App () {
  const [selectedFileName, setSelectedFileName] = useState('')

  const {
    fileNames,
    isLoading: isListLoading,
    error: listError
  } = useFilesList()

  const {
    files,
    isLoading: isDataLoading,
    error: dataError
  } = useFilesData(selectedFileName)

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
          onChange={setSelectedFileName}
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
