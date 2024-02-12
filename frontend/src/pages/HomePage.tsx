import { useEffect, useReducer } from 'react'
import { Link } from 'react-router-dom'
import { Col, Row } from 'react-bootstrap'
import { Product } from '../types/Products'
import { formatoMoneda, getError } from '../utils/Utils'
import axios from 'axios'
import { ApiError } from '../types/ApiError'
import LoadingBox from '../components/LoadingBox'
import MessageBox from '../components/MessageBox'

type State = {
  products: Product[]
  loading: boolean
  error: string
}

type Action =
  | { type: 'FETCH_REQUEST' }
  | {
    type: 'FETCH_SUCCESS'
    payload: Product[]
  }
  | {
    type: 'FETCH_FAIL'
    payload: string
  }

const initialState: State = {
  products: [],
  loading: true,
  error: '',
}

const reducer = (state: State, action: Action) => {
  switch (action.type) {
    case 'FETCH_REQUEST':
      return { ...state, loading: true }
    case 'FETCH_SUCCESS':
      return { ...state, loading: false, products: action.payload }
    case 'FETCH_FAIL':
      return { ...state, loading: false, error: action.payload }
    default:
      return state
  }
}

export default function HomePage() {

  const [{ loading, products, error }, dispatch] = useReducer<React.Reducer<State, Action>>(reducer, initialState)

  useEffect(() => {
    const fetchProducts = async () => {
      dispatch({ type: 'FETCH_REQUEST' })
      try {

        const res = await axios.get('/api/products')

        dispatch({ type: 'FETCH_SUCCESS', payload: res.data })
      } catch (error) {
        dispatch({ type: 'FETCH_FAIL', payload: getError(error as ApiError) })
      }
    }

    fetchProducts()
  }, [])


  return (
    loading ? (
      <LoadingBox />
    ) : error ? (
      <MessageBox variant='danger'>{error}</MessageBox>
    ) : (
      <Row>
        {products.map((product) => (
          <Col
            key={product.slug}
            sm={6}
            md={4}
            lg={3}
          >
            <Link to={`/product/${product.slug}`}>
              <img src={product.image} alt={product.name} className='product-image' />
              <h2>{product.name}</h2>
              <p>{formatoMoneda(product.price)}</p>
            </Link>
          </Col>
        ))}
      </Row>
    )
  )
}