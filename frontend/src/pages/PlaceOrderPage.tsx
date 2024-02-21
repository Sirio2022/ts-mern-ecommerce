import { useContext, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AppStateContext } from "../Store";
import { useCreateOrderMutation } from "../hooks/orderHooks";
import { toast } from "react-toastify";
import { formatoMoneda, getError } from "../utils/Utils";
import { ApiError } from "../types/ApiError";
import CheckoutSteps from "../components/CheckoutSteps";
import { Helmet } from "react-helmet-async";
import { Button, Card, Col, ListGroup, Row } from "react-bootstrap";
import LoadingBox from "../components/LoadingBox";


export default function PlaceOrderPage() {

    const navigate = useNavigate();

    const { state: { cart, userInfo }, dispatch } = useContext(AppStateContext);

    const round2 = (num: number) => Math.round(num * 100 + Number.EPSILON) / 100;

    cart.cartPrices = {
        itemsPrice: round2(cart.cartItems.reduce((a, c) => a + c.price * c.qty, 0)),
        shippingPrice: cart.cartItems.length > 100 ? round2(0) : round2(10),
        taxPrice: round2(0.15 * cart.cartItems.reduce((a, c) => a + c.price * c.qty, 0)),
        totalPrice: round2(
            cart.cartItems.reduce((a, c) => a + c.price * c.qty, 0) +
            (cart.cartItems.length > 100 ? 0 : 10) +
            0.15 * cart.cartItems.reduce((a, c) => a + c.price * c.qty, 0)
        ),
    };

    const { mutateAsync: placeOrder, isPending } = useCreateOrderMutation();

    const placeOrderHandler = async () => {
        try {
            const response = await placeOrder({
                orderItems: cart.cartItems,
                shippingAddress: cart.shippingAddress,
                paymentMethod: cart.paymentMethod,
                cartPrices: {
                    itemsPrice: cart.cartPrices.itemsPrice,
                    shippingPrice: cart.cartPrices.shippingPrice,
                    taxPrice: cart.cartPrices.taxPrice,
                    totalPrice: cart.cartPrices.totalPrice,
                }
            });
            dispatch({ type: 'CART_CLEAR' });
            navigate(`/order/${response.order._id}`);
        } catch (error) {
            toast.error(getError(error as ApiError));
        }
    };

    useEffect(() => {
        if (!cart.paymentMethod) {
            navigate('/payment');
        }
    }, [cart, navigate]);



    return (
        <div>
            <CheckoutSteps step1 step2 step3 step4 />

            <Helmet>
                <title className="mb-3">Place Order</title>
                <meta name="description" content="Place Order" />
            </Helmet>

            <Row>
                <Col md={8}>
                    <Card className="mb-3">
                        <Card.Body>
                            <Card.Title>
                                Shpping
                            </Card.Title>

                            <Card.Text>
                                <strong>Name:</strong> {cart.shippingAddress.fullName}<br />
                                <strong>Address:</strong> {cart.shippingAddress.address},{' '}
                                {cart.shippingAddress.city}, {cart.shippingAddress.country}, Postal Code: {cart.shippingAddress.postalCode},
                            </Card.Text>
                            <Link to="/shipping">Change</Link>
                        </Card.Body>
                    </Card>

                    <Card className="mb-3">
                        <Card.Body>
                            <Card.Title>
                                Payment Method
                            </Card.Title>

                            <Card.Text>
                                <strong>Method:</strong> {cart.paymentMethod}
                            </Card.Text>
                            <Link to="/payment">Change</Link>
                        </Card.Body>
                    </Card>

                    <Card className="mb-3">
                        <Card.Body>
                            <Card.Title>
                                Order Items
                            </Card.Title>

                            <ListGroup variant="flush">
                                {cart.cartItems.map((item) => (
                                    <ListGroup.Item key={item._id}>
                                        <Row className="aling-items-center">
                                            <Col md={8} className="px-1 d-flex justify-content-start">
                                                <img
                                                    src={item.image}
                                                    alt={item.name}
                                                    className="img-fluid rounded thumbnail"
                                                />
                                                <Link to={`/product/${item.slug}`} className="cart-link">{item.name}</Link>
                                            </Col>

                                            <Col md={2} className="text-center m-auto">
                                                <span>{item.qty}</span>
                                            </Col>

                                            <Col md={2} className="text-center m-auto">
                                                {formatoMoneda(item.price)}
                                            </Col>
                                        </Row>
                                    </ListGroup.Item>
                                ))}
                            </ListGroup>
                            <Link to="/cart">Change</Link>
                        </Card.Body>
                    </Card>

                </Col>
                <Col md={4}>
                    <Card>
                        <Card.Body>
                            <Card.Title>
                                Order Summary
                            </Card.Title>

                            <ListGroup variant="flush">
                                <ListGroup.Item>
                                    <Row>
                                        <Col>
                                            Items
                                        </Col>
                                        <Col>
                                            {formatoMoneda(cart.cartPrices.itemsPrice)}
                                        </Col>
                                    </Row>
                                </ListGroup.Item>

                                <ListGroup.Item>
                                    <Row>
                                        <Col>
                                            Shipping
                                        </Col>
                                        <Col>
                                            {formatoMoneda(cart.cartPrices.shippingPrice)}
                                        </Col>
                                    </Row>
                                </ListGroup.Item>

                                <ListGroup.Item>
                                    <Row>
                                        <Col>
                                            Tax
                                        </Col>
                                        <Col>
                                            {formatoMoneda(cart.cartPrices.taxPrice)}
                                        </Col>
                                    </Row>
                                </ListGroup.Item>

                                <ListGroup.Item>
                                    <Row>
                                        <Col>
                                            Total
                                        </Col>
                                        <Col>
                                            {formatoMoneda(cart.cartPrices.totalPrice)}
                                        </Col>
                                    </Row>
                                </ListGroup.Item>

                                <ListGroup.Item>
                                    <Button
                                        type="button"
                                        className="btn btn-primary w-100"
                                        onClick={placeOrderHandler}
                                        disabled={cart.cartItems.length === 0 || isPending}
                                    >
                                        Place Order
                                    </Button>
                                    {isPending && <LoadingBox />}
                                </ListGroup.Item>
                            </ListGroup>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </div>
    )
}
