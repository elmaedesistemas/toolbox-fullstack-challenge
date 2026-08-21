import {
  Alert,
  Container,
  Navbar,
  Spinner
} from 'react-bootstrap'
import FilesTable from './components/FilesTable'
import useFilesData from './hooks/useFilesData'
import './styles.css'

function App () {
  const {
    files,
    isLoading,
    error
  } = useFilesData()

  return (
    <>
      <Navbar bg='danger' variant='dark'>
        <Container fluid>
          <Navbar.Brand>React Test App</Navbar.Brand>
        </Container>
      </Navbar>

      <Container fluid className='page-container'>
        <h1 className='h3 mb-4'>Files data</h1>

        {isLoading && (
          <div
            className='loading-container'
            role='status'
            aria-live='polite'
          >
            <Spinner animation='border' variant='danger' />
            <span>Loading files...</span>
          </div>
        )}

        {!isLoading && error && (
          <Alert variant='danger'>
            {error}
          </Alert>
        )}

        {!isLoading && !error && (
          <FilesTable files={files} />
        )}
      </Container>
    </>
  )
}

export default App
