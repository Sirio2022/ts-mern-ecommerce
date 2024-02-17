import { useContext } from "react"
import { Link, useNavigate } from "react-router-dom"
import { AppStateContext } from "../Store"
import { CartItem } from "../types/Cart"
import { toast } from "react-toastify"
import { Helmet } from "react-helmet-async"
import { Button, Card, Col, ListGroup, Row } from "react-bootstrap"
import MessageBox from "../components/MessageBox"
import { formatoMoneda } from "../utils/Utils"


export default function CartPage() {


    const navigate = useNavigate()

    const { state: { mode, cart: {
        cartItems,
        cartPrices: { itemsPrice, shippingPrice, taxPrice, totalPrice }
    } }, dispatch } = useContext(AppStateContext)

    const updateCartHandler = (item: CartItem, qty: number) => {
        if (item.countInStock < qty) {
            toast.warn('Sorry, this product is out of stock');
            return;
        }
        dispatch({
            type: 'ADD_TO_CART',
            payload: { ...item, qty },
        })
    }

    return (
        <div>
            <Helmet>
                <title>Shopping Cart</title>

                <meta
                    name='description'
                    content='Shopping Cart'
                />
                <meta
                    name='keywords'
                    content='Shopping Cart, Cart, Shopping, Buy, Buy Cart, Buy Shopping Cart, Buy Shopping'
                />
            </Helmet>

            <h1>Shopping Cart</h1>

            <Row>

                <Col md={8}>
                    {cartItems.length === 0 ? (
                        <MessageBox>
                            Cart is empty. <Link to='/'>Go Shopping</Link>
                        </MessageBox>
                    ) : (
                        <ListGroup variant='flush'>
                            {Array.isArray(cartItems) && cartItems.map((item: CartItem) => (
                                <ListGroup.Item key={item._id}>

                                    <Row className="align-items-center my-5">
                                        <Col md={2} className="d-flex flex-lg-row align-items-center">
                                            <img
                                                src={item.image}
                                                alt={item.name}
                                                className="img-fluid rounded thumbnail align-items-center"
                                            ></img>
                                        </Col>
                                        <Col md={4}>
                                            <Link
                                                to={`/product/${item.slug}`}
                                                className={mode === 'dark' ? 'card-link-black d-flex align-items-center' : 'card-link  d-flex align-items-center'}
                                            >
                                                {item.name}
                                            </Link>
                                        </Col>

                                        <Col md={3}>

                                            <Button
                                                onClick={() => updateCartHandler(item, item.qty - 1)}
                                                variant="secondary"
                                                disabled={item.qty === 1}
                                                className="me-2"
                                            >
                                                <i className="fas fa-minus-circle"></i>
                                            </Button>

                                            <span>{item.qty}</span>

                                            <Button
                                                onClick={() => updateCartHandler(item, item.qty + 1)}
                                                variant="secondary"
                                                disabled={item.qty === item.countInStock}
                                                className="ms-2"
                                            >
                                                <i className="fas fa-plus-circle"></i>
                                            </Button>
                                        </Col>

                                        <Col md={2}>
                                            {item.price}
                                        </Col>

                                        <Col md={1}>
                                            <Button variant="secondary">
                                                <i className="fas fa-trash"></i>
                                            </Button>
                                        </Col>
                                    </Row>
                                </ListGroup.Item>
                            ))}
                        </ListGroup>
                    )}
                </Col>

                <Col md={4}>
                    <Card>
                        <Card.Body>
                            <ListGroup variant="flush">
                                <ListGroup.Item className="my-container">

                                    <span>Subtotal ({(Array.isArray(cartItems) && cartItems.reduce((a, c) => a + c.qty, 0))} Items)</span>


                                    {formatoMoneda(itemsPrice)}


                                </ListGroup.Item>

                                <ListGroup.Item className="my-container">
                                    <span>Shipping: </span>  {formatoMoneda(shippingPrice)}
                                </ListGroup.Item>

                                <ListGroup.Item className="my-container">
                                    <span>Tax: </span> {formatoMoneda(taxPrice)}

                                </ListGroup.Item>

                                <ListGroup.Item className="my-container">
                                    <span>Total: </span>
                                    <div className="cart-value">

                                        {formatoMoneda(totalPrice)}
                                    </div>
                                </ListGroup.Item>

                                <ListGroup.Item>
                                    <div className="d-grid">
                                        <Button
                                            type="button"
                                            className="primary mt-4"
                                            disabled={cartItems.length === 0}
                                            onClick={() => navigate('/signin?redirect=/shipping')}
                                        >
                                            Proceed to Checkout
                                        </Button>
                                    </div>
                                </ListGroup.Item>

                            </ListGroup>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </div >
    )
}
