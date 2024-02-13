import { Container, Nav, Navbar } from 'react-bootstrap'
import { Link, Outlet } from 'react-router-dom'

function App() {


  return (
    <div className='d-flex flex-column vh-100'>
      <header>
        <Navbar bg='dark' variant='dark' expand='lg' >

          <Container>
            <Link to='/' className='nav-bar-links'>
              <Navbar.Brand>Music Store</Navbar.Brand>
            </Link>
          </Container>

          <Nav>
            <Link to='/cart' className='nav-bar-links'>
              <Nav.Link>Cart</Nav.Link>
            </Link>
            <Link to='/signin' className='nav-bar-links'>
              <Nav.Link>Sign In</Nav.Link>
            </Link>
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
