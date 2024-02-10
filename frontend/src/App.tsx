

import { formatoMoneda } from './utils/Utils'
import { sampleProducts } from './data'
import { Col, Container, Nav, Navbar, Row } from 'react-bootstrap'

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
          <Row>
            {sampleProducts.map((product) => (
              <Col
                key={product.slug}
                sm={6}
                md={4}
                lg={3}
              >
                <img src={product.image} alt={product.name} className='product-image' />
                <h2>{product.name}</h2>
                <p>{formatoMoneda(product.price)}</p>
              </Col>
            ))}
          </Row>
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
