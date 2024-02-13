import { Helmet } from "react-helmet-async";
import { useGetProductDetailsBySlugQuery } from "../hooks/productHooks";
import { useParams } from "react-router-dom";
import LoadingBox from "../components/LoadingBox";
import MessageBox from "../components/MessageBox";
import { ApiError } from "../types/ApiError";
import { formatoMoneda, getError } from "../utils/Utils";
import { Badge, Button, Card, Col, ListGroup, Row } from "react-bootstrap";
import Rating from "../components/Rating";


export default function ProductPage() {

    const params = useParams();
    const { slug } = params;

    const { data: product, isLoading, error } = useGetProductDetailsBySlugQuery(slug!);

    return (
        isLoading ? (
            <LoadingBox />
        ) : error ? (
            <MessageBox variant="danger">{getError(error as ApiError)}</MessageBox>
        ) : !product ? (
            <MessageBox variant="danger">Product not found</MessageBox>
        ) : (
            <>
                <Row>
                    <Col md={6}>
                        <img
                            src={product.image}
                            alt={product.name}
                            className="img-fluid"
                        />
                    </Col>
                    <Col md={3}>
                        <ListGroup className="list-group list-group-flush">
                            <ListGroup.Item>
                                <Helmet>
                                    <title>{product.name} - Music Store</title>
                                    <meta
                                        name="description"
                                        content={product.description}
                                    />
                                </Helmet>
                                <h1>{product.name}</h1>
                            </ListGroup.Item>

                            <ListGroup.Item>
                                <Rating
                                    rating={product.rating}
                                    numReviews={product.numReviews}
                                />
                            </ListGroup.Item>

                            <ListGroup.Item>
                                Price: {formatoMoneda(product.price)}
                            </ListGroup.Item>

                            <ListGroup.Item>
                                Description: <p>{product.description}</p>
                            </ListGroup.Item>

                        </ListGroup>
                    </Col>
                    <Col md={3}>
                        <Card>
                            <Card.Body>
                                <ListGroup variant="flush" >
                                    <ListGroup.Item >
                                        <Row>
                                            <Col><strong>Price:</strong> </Col>
                                            <Col>
                                                <strong>{formatoMoneda(product.price)}</strong>
                                            </Col>
                                        </Row>
                                    </ListGroup.Item>

                                    <ListGroup.Item>
                                        <Row>
                                            <Col><strong>Status:</strong></Col>
                                            <Col>
                                                {product.countInStock > 0 ? <Badge bg="success">In Stock</Badge> : <Badge bg="danger">Out of Stock</Badge>}
                                            </Col>
                                        </Row>
                                    </ListGroup.Item>

                                    {product.countInStock > 0 && (
                                        <ListGroup.Item>
                                            <div className="d-grid">
                                                <Button variant="primary">
                                                    Add to cart
                                                </Button>
                                            </div>
                                        </ListGroup.Item>
                                    )}
                                </ListGroup>
                            </Card.Body>
                        </Card>
                    </Col>
                </Row >
            </>
        )
    )
}
