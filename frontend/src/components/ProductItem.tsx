import { Button, Card } from "react-bootstrap";
import { Product } from "../types/Products";
import { Link } from "react-router-dom";
import { formatoMoneda } from "../utils/Utils";
import Rating from "./Rating";
import { useContext } from "react";
import { AppStateContext } from "../Store";

function ProductItem({ product }: { product: Product }) {

    const { state: { mode } } = useContext(AppStateContext)

    return (
        <Card>
            <Link to={`/product/${product.slug}`}>
                <img src={product.image} alt={product.name} className="card-img-top" />
            </Link>

            <Card.Body>
                <Link
                    to={`/product/${product.slug}`}
                    className="card-link"
                >
                    <Card.Title className={mode === 'dark' ? 'text-white' : undefined}>
                        {product.name}
                    </Card.Title>
                </Link>

                <Rating rating={product.rating} numReviews={product.numReviews} />

                <Card.Text>
                    {formatoMoneda(product.price)}
                </Card.Text>
                {product.countInStock <= 0 ? (
                    <Button variant="danger" disabled>
                        Out of Stock
                    </Button>
                ) : (
                    <Button variant="primary">
                        Add to Cart
                    </Button>
                )}
            </Card.Body>
        </Card>
    );
}

export default ProductItem;