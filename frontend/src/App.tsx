import { Col, Container, Nav, Navbar, Row } from 'react-bootstrap'
import { Outlet } from 'react-router-dom'

function App() {


  return (
    <div className='d-flex flex-column vh-100'>
      <header>
        <Navbar bg='dark' variant='dark' expand='lg' >

          <Container>
            <Navbar.Brand href='/'>Music Store</Navbar.Brand>
          </Container>

          <Nav>
            <Nav.Link href='/cart'>Cart</Nav.Link>
            <Nav.Link href='/signin'>Sign In</Nav.Link>
          </Nav>

        </Navbar>
      </header>

      <main>
        <Container className='mt-3'>
          <Outlet />
        </Container>
      </main>

      <footer>
        <div className='text-center'>
          All rights reserved &copy; Juan Manuel Alvarez &#128640; {new Date().getFullYear()}
        </div>
      </footer>
    </div>
  )
}

export default App
