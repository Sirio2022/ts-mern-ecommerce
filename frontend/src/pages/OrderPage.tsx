import { useContext, useEffect, useState } from "react";
import { AppStateContext } from "../Store";
import { Link, useParams } from "react-router-dom";
import { useOrderDetailsQuery, usePaypalClientIdQuery, usePaypalPaymentMutation } from "../hooks/orderHooks";
import MessageBox from "../components/MessageBox";
import { formatoMoneda, getError } from "../utils/Utils";
import { ApiError } from "../types/ApiError";
import LoadingBox from "../components/LoadingBox";
import { Helmet } from "react-helmet-async";
import { Button, Card, Col, ListGroup, Row } from "react-bootstrap";
import { toast } from "react-toastify";
import { PayPalButtons, PayPalButtonsComponentProps, SCRIPT_LOADING_STATE, usePayPalScriptReducer } from "@paypal/react-paypal-js";
import { formatearFecha } from "../utils/Utils";


export default function OrderPage() {


    const [msg, setMsg] = useState(undefined as string | undefined);

    const params = useParams();
    const { orderId } = params as { orderId: string };

    const { state: { userInfo }, dispatch } = useContext(AppStateContext);

    const { data: order, isLoading, error, refetch } = useOrderDetailsQuery(orderId!);

    if (!order) {
        try {
        } catch (error) {
            setMsg(getError(error as ApiError));
        }
    }

    const { mutateAsync: payOrder, isPending: loadingPay } = usePaypalPaymentMutation();

    const testPaypalHandler = async () => {
        await payOrder({ orderId: orderId! });
        refetch();
        toast.success('Order Paid');
    };

    const [{ isPending, isRejected }, paypalDispatch] = usePayPalScriptReducer();

    const { data: paypalConfig } = usePaypalClientIdQuery();

    useEffect(() => {
        if (paypalConfig && paypalConfig.clientId) {
            const loadPaypalScript = async () => {

                paypalDispatch({
                    type: 'resetOptions',
                    value: { 'clientId': paypalConfig!.clientId, 'currency': 'USD' }
                });
                paypalDispatch({ type: 'setLoadingStatus', value: SCRIPT_LOADING_STATE.PENDING });
            };
            loadPaypalScript();
        }

    }, [paypalConfig]);

    const paypalButtonTransactionProps: PayPalButtonsComponentProps = {
        style: {
            layout: 'vertical',
        },
        createOrder: (data, actions) => {
            return actions.order.create({
                purchase_units: [
                    {
                        amount: {
                            value: order!.cartPrices.totalPrice.toString(),
                        },
                    },
                ],
            }).then((orderId: string) => {
                return orderId;

            })
        },
        onApprove: async (data, actions: any) => {
            return actions.order.capture().then(async (details: any) => {
                try {
                    payOrder({ orderId: orderId!, ...details });
                    refetch();
                    toast.success('Order Paid with PayPal');
                } catch (error) {
                    toast.error(getError(error as ApiError));
                }
            });
        },
        onError: (err) => {
            console.error('PayPal Error:', err);
            toast.error('PayPal Error');
        },
    };



    return isLoading ? (
        <LoadingBox />
    ) : error ? (
        <MessageBox variant="danger">{getError(error as ApiError)}</MessageBox>
    ) : !order ? (
        <MessageBox variant="danger">{msg}</MessageBox>
    ) : (
        <div>
            <Helmet>
                <title>Order {order._id}</title>
                <meta name="description" content="Order Details" />
            </Helmet>
            <h1 className="my-3">Order {order._id}</h1>

            <Row>
                <Col md={8}>
                    <Card className="mb-3">
                        <Card.Body>
                            <Card.Title>
                                Shipping
                            </Card.Title>
                            <Card.Text>
                                <strong>Name:</strong> {order!.shippingAddress.fullName}<br />
                                <strong>Address:</strong> {order!.shippingAddress.address},{' '}
                                {order!.shippingAddress.city}, {order!.shippingAddress.country}, Postal Code: {order!.shippingAddress.postalCode},
                            </Card.Text>
                            {order.isDelivered ? (
                                <MessageBox variant="success">Delivered at {order.deliveredAt}</MessageBox>
                            ) : (
                                <MessageBox variant="warning">Not Delivered</MessageBox>
                            )}
                        </Card.Body>


                    </Card>

                    <Card className="mb-3">
                        <Card.Body>
                            <Card.Title>
                                Payment Method
                            </Card.Title>
                            <Card.Text>
                                <strong>Method:</strong> {order.paymentMethod}
                            </Card.Text>

                            {order.isPaid ? (

                                <MessageBox variant="success">Paid at {formatearFecha(order.paidAt)}</MessageBox>
                            ) : (

                                <MessageBox variant="warning">Not Paid</MessageBox>
                            )}
                        </Card.Body>
                    </Card>

                    <Card className="mb-3">
                        <Card.Body>
                            <Card.Title>
                                Items
                            </Card.Title>

                            <ListGroup variant="flush">
                                {
                                    order.orderItems.map((item) => (
                                        <ListGroup.Item key={item._id}>
                                            <Row className="align-items-center">
                                                <Col md={6}>
                                                    <img
                                                        src={item.image}
                                                        alt={item.name}
                                                        className="img-fluid rounded thumbnail"
                                                    />
                                                    <Link to={`/product/${item.slug}`}>{item.name}</Link>

                                                </Col>

                                                <Col md={3}>
                                                    <span>{item.qty}</span>
                                                </Col>

                                                <Col md={3}>
                                                    {formatoMoneda(item.price)}
                                                </Col>
                                            </Row>

                                        </ListGroup.Item>
                                    ))
                                }
                            </ListGroup>

                        </Card.Body>
                    </Card>
                </Col>
                <Col md={4}>
                    <Card className="mb-3">
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
                                            {formatoMoneda(order.cartPrices.itemsPrice)}
                                        </Col>
                                    </Row>
                                </ListGroup.Item>

                                <ListGroup.Item>
                                    <Row>
                                        <Col>
                                            Shipping
                                        </Col>
                                        <Col>
                                            {formatoMoneda(order.cartPrices.shippingPrice)}
                                        </Col>
                                    </Row>
                                </ListGroup.Item>

                                <ListGroup.Item>
                                    <Row>
                                        <Col>
                                            Tax
                                        </Col>
                                        <Col>
                                            {formatoMoneda(order.cartPrices.taxPrice)}
                                        </Col>
                                    </Row>
                                </ListGroup.Item>

                                <ListGroup.Item>
                                    <Row>
                                        <Col>
                                            <strong>
                                                Order Total
                                            </strong>
                                        </Col>
                                        <Col>
                                            <strong>
                                                {formatoMoneda(order.cartPrices.totalPrice)}
                                            </strong>
                                        </Col>
                                    </Row>
                                </ListGroup.Item>
                                {!order.isPaid && (
                                    <ListGroup.Item>
                                        {isPending ? (
                                            <LoadingBox />
                                        ) : isRejected ? (
                                            <MessageBox variant="danger">PayPal Error</MessageBox>
                                        ) : (
                                            <div>
                                                <PayPalButtons {...paypalButtonTransactionProps} />
                                                <Button onClick={testPaypalHandler}>
                                                    Test PayPal
                                                </Button>
                                            </div>
                                        )}
                                        {loadingPay && <LoadingBox />}

                                    </ListGroup.Item>
                                )}
                            </ListGroup>

                        </Card.Body>
                    </Card>
                </Col>
            </Row>

        </div>
    )
}
