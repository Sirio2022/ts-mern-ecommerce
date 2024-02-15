import { useContext, useEffect } from 'react'
import { Button, Container, Nav, Navbar } from 'react-bootstrap'
import { Link, Outlet } from 'react-router-dom'
import { AppStateContext } from './Store'

function App() {

  const { state: { mode }, dispatch } = useContext(AppStateContext)

  useEffect(() => {
    document.body.setAttribute('data-bs-theme', mode)
  }, [mode])

  const toggleMode = () => {
    dispatch({ type: 'TOGGLE_MODE' })
  }

  return (



    <div className='d-flex flex-column vh-100'>
      <header>
        <Navbar expand='lg'>

          <Container>
            <Link to='/' className='nav-bar-links'>
              <Navbar.Brand>Music Store</Navbar.Brand>
            </Link>
          </Container>

          <Nav className='w-25'>
            <div>
              <Button
                variant={mode}
                onClick={toggleMode}
                className='m-auto me-2'
              >
                <i className={mode === 'light' ? 'fa fa-sun' : 'fa fa-moon'}></i>
              </Button>
            </div>
            <div>
              <Link to='/cart' className='nav-bar-links'>
                <Nav.Link>Cart</Nav.Link>
              </Link>
            </div>
            <div>
              <Link to='/signin' className='nav-bar-links'>
                <Nav.Link>Sign In</Nav.Link>
              </Link>
            </div>
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
