import { Button, Card } from "react-bootstrap";
import { Product } from "../types/Products";
import { Link } from "react-router-dom";
import { convertProductToCartItem, formatoMoneda } from "../utils/Utils";
import Rating from "./Rating";
import { useContext } from "react";
import { AppStateContext } from "../Store";
import { CartItem } from "../types/Cart";
import { toast } from "react-toastify";

function ProductItem({ product }: { product: Product }) {

    const {
        state: { mode,
            cart: { cartItems } }, dispatch } = useContext(AppStateContext)

    const addToCartHandler = async (item: CartItem) => {
        const existItem = cartItems.find((x: CartItem) => x._id === product._id);
        const quantity = existItem ? existItem.qty + 1 : 1;
        if (product.countInStock < quantity) {
            toast.warn('Sorry, this product is out of stock');
            return;
        }
        dispatch({
            type: 'ADD_TO_CART',
            payload: { ...item, qty: quantity },
        })
        toast.success('Product added to cart');
    }


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
                    <Card.Title className={mode === 'dark' ? 'card-link-black' : undefined}>
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
                    <Button
                        variant="primary"
                        onClick={() => addToCartHandler(convertProductToCartItem(product))}>
                        Add to Cart
                    </Button>
                )}
            </Card.Body>
        </Card>
    );
}

export default ProductItem;