import { useEffect, useReducer } from 'react'
import { Col, Row } from 'react-bootstrap'
import { Product } from '../types/Products'
import { getError } from '../utils/Utils'
import axios from 'axios'
import { ApiError } from '../types/ApiError'
import LoadingBox from '../components/LoadingBox'
import MessageBox from '../components/MessageBox'
import ProductItem from '../components/ProductItem'
import { Helmet } from 'react-helmet-async'

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
        <Helmet>
          <title>Music Store</title>
          <meta
            name='description'
            content='We sell the best Guitars, Pianos, Drums and more at the best prices.'
          />
          <meta
            name='keywords'
            content='Electic guitars, accoustic guitars, pianos, drums, music, music store, buy instruments, buy music instruments, buy guitars, buy pianos, buy drums, buy music gear, music gear, music equipment, music accessories, music store, music shop, music instruments, music instruments store, music instruments shop, music instruments online, music instruments for sale, music instruments near me, music instruments online store, music instruments online shop, music instruments online sale, music instruments online near me, music instruments online for sale'
          />
        </Helmet>
        {products.map((product) => (
          <Col
            key={product.slug}
            sm={6}
            md={4}
            lg={3}
          >
            <ProductItem product={product} />
          </Col>
        ))}
      </Row>
    )
  )
}
