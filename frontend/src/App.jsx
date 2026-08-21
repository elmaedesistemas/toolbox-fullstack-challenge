import { Container, Navbar } from 'react-bootstrap'

function App () {
  return (
    <>
      <Navbar bg='danger' variant='dark'>
        <Container fluid>
          <Navbar.Brand>React Test App</Navbar.Brand>
        </Container>
      </Navbar>

      <Container className='py-4'>
        <h1 className='h3'>Files data</h1>
        <p className='text-muted'>
          Toolbox Full Stack Challenge
        </p>
      </Container>
    </>
  )
}

export default App
