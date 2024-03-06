import { useState } from "react";
import { Col, Row } from "react-bootstrap";
import { useGetProductByIdQuery, useUpdateAdminProductMutation } from "../hooks/productHooks";
import Spinner from "../components/Spinner";
import MessageBox from "../components/MessageBox";
import { getError } from "../utils/Utils";
import { ApiError } from "../types/ApiError";
import { useNavigate, useParams } from "react-router-dom";


export default function CreateProductPage() {

    const navigate = useNavigate();
    const { id } = useParams();

    const { data: productById, isLoading, error: errorProduct, isPending: loadingProduct, refetch } = useGetProductByIdQuery(id as string);

    const { mutateAsync: updateProduct, isPending, error } = useUpdateAdminProductMutation();

    const [_id] = useState(productById?._id as string);
    const [name, setName] = useState(productById?.name as string);
    const [slug, setSlug] = useState(productById?.slug as string);;
    const [image, setImage] = useState(productById?.image as string);
    const [brand, setBrand] = useState(productById?.brand as string);
    const [category, setCategory] = useState(productById?.category as string)
    const [description, setDescription] = useState(productById?.description as string)
    const [price, setPrice] = useState(productById?.price as number || 0)
    const [countInStock, setCountInStock] = useState(productById?.countInStock as number)
    const [rating, setRating] = useState(productById?.rating as number)
    const [numReviews, setNumReviews] = useState(productById?.numReviews as number)

    if (isPending || isLoading || loadingProduct) return <Spinner />

    if (error || errorProduct) {
        return <MessageBox variant='danger'>{getError(error as ApiError)}</MessageBox>
    }

    const product = {
        _id: id,
        name,
        slug,
        image,
        brand,
        price,
        countInStock,
        description,
        category,
        rating,
        numReviews
    }

    const submitHandler = async (e: React.FormEvent) => {
        e.preventDefault();
        await updateProduct(product);
        refetch();
        navigate('/adminproducts');
    }

    return (
        <Row>
            <Col
                md={6}
                className='mx-auto'
            >
                <h1>Edit Product</h1>

                {productById ? (
                    <form
                        onSubmit={submitHandler}
                    >
                        <div className="mb-3">
                            <label htmlFor="name">Name</label>
                            <input
                                type="text"
                                className="form-control"
                                id="name"
                                aria-describedby="name"
                                placeholder="Enter your name"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                            />
                        </div>

                        <div className="mb-3">
                            <label htmlFor="slug">Slug</label>
                            <input
                                type="text"
                                className="form-control"
                                id="slug"
                                aria-describedby="slug"
                                placeholder="Enter your slug"
                                value={slug}
                                onChange={(e) => setSlug(e.target.value)}
                            />
                        </div>

                        <div className="mb-3">
                            <label htmlFor="image">Image</label>
                            <input
                                type="text"
                                className="form-control"
                                id="image"
                                aria-describedby="image"
                                placeholder="Enter your image"
                                value={image}
                                onChange={(e) => setImage(e.target.value)}
                            />
                        </div>

                        <div className="mb-3">
                            <label htmlFor="brand">Brand</label>
                            <input
                                type="text"
                                className="form-control"
                                id="brand"
                                aria-describedby="brand"
                                placeholder="Enter your brand"
                                value={brand}
                                onChange={(e) => setBrand(e.target.value)}
                            />
                        </div>

                        <div className="mb-3">
                            <label htmlFor="category">Category</label>
                            <input
                                type="text"
                                className="form-control"
                                id="category"
                                aria-describedby="category"
                                placeholder="Enter your category"
                                value={category}
                                onChange={(e) => setCategory(e.target.value)}
                            />
                        </div>

                        <div className="mb-3">
                            <label htmlFor="description">Description</label>
                            <textarea
                                className="form-control"
                                id="description"
                                aria-describedby="description"
                                placeholder="Enter your description"
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                            />
                        </div>

                        <div className="mb-3">
                            <label htmlFor="price">Price</label>
                            <input
                                type="number"
                                step="any"
                                className="form-control"
                                id="price"
                                aria-describedby="price"
                                placeholder="Enter your price"
                                value={price}
                                onChange={(e) => setPrice(Number(e.target.value))}
                            />
                        </div>

                        <div className="mb-3">
                            <label htmlFor="countInStock">Count In Stock</label>
                            <input
                                type="number"
                                className="form-control"
                                id="countInStock"
                                aria-describedby="countInStock"
                                placeholder="Enter your countInStock"
                                value={countInStock}
                                onChange={(e) => setCountInStock(Number(e.target.value))}
                            />
                        </div>

                        <div className="mb-3">
                            <label htmlFor="rating">Rating</label>
                            <input
                                type="number"
                                min="0"
                                max="5"
                                className="form-control"
                                id="rating"
                                aria-describedby="rating"
                                placeholder="Enter your rating"
                                value={rating}
                                onChange={(e) => setRating(Number(e.target.value))}
                            />
                        </div>

                        <div className="mb-3">
                            <label htmlFor="numReviews">Num Reviews</label>
                            <input
                                type="number"
                                className="form-control"
                                id="numReviews"
                                aria-describedby="numReviews"
                                placeholder="Enter your numReviews"
                                value={numReviews}
                                onChange={(e) => setNumReviews(Number(e.target.value))}
                            />
                        </div>

                        <button
                            type="submit"
                            className="btn btn-primary w-100 mb-2">
                            Update Product
                        </button>
                    </form>
                ) : <MessageBox variant='danger'>Product not found</MessageBox>}
            </Col>
        </Row>
    )
}
