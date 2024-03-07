import { useState } from "react";
import { Col, Row } from "react-bootstrap";
import { useCreateAdminProductMutation } from "../hooks/productHooks";
import Spinner from "../components/Spinner";
import MessageBox from "../components/MessageBox";
import { getError } from "../utils/Utils";
import { ApiError } from "../types/ApiError";
import { useNavigate } from "react-router-dom";
import apiClient from "../apiClient";


export default function CreateProductPage() {

  const navigate = useNavigate();

  const [name, setName] = useState('');
  const [slug, setSlug] = useState('');
  const [image, setImage] = useState('');
  const [brand, setBrand] = useState('');
  const [category, setCategory] = useState('')
  const [description, setDescription] = useState('')
  const [price, setPrice] = useState(0)
  const [countInStock, setCountInStock] = useState(0)
  const [rating, setRating] = useState(0)
  const [numReviews, setNumReviews] = useState(0)
  const [loadingUpload, setLoadingUpload] = useState(false);
  const [errorUpload, setErrorUpload] = useState('');

  const { mutateAsync: createProduct, isPending, error } = useCreateAdminProductMutation();

  if (isPending) return <Spinner />

  if (error) {
    return <MessageBox variant='danger'>{getError(error as ApiError)}</MessageBox>
  }

  const product = {
    name,
    slug,
    image,
    brand,
    category,
    description,
    price,
    countInStock,
    rating,
    numReviews
  }

  const submitHandler = (e: React.FormEvent) => {
    e.preventDefault();
    createProduct(product);
    navigate('/adminproducts');
  }

  const uploadHandler = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.item(0);
    if (file) {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('upload_preset', 'ts_mern_ecommerce'); // replace 'your_upload_preset' with your actual upload preset

      // Fetch the signature and timestamp from the server
      const signatureResponse = await apiClient.get('api/cloudinary/signature');
      const { signature, timestamp } = signatureResponse.data;

      // Add the signature and timestamp to the form data
      formData.append('signature', signature);
      formData.append('timestamp', `${timestamp}`);

      // Add the API key to the form data
      formData.append('api_key', import.meta.env.VITE_CLOUDINARY_API_KEY); // replace 'your_api_key' with your actual API key

      setLoadingUpload(true);
      try {
        const response = await fetch(`https://api.cloudinary.com/v1_1/${import.meta.env.VITE_CLOUDINARY_CLOUD_NAME}/image/upload`, {
          method: 'POST',
          body: formData,
        });
        if (!response.ok) {
          const errorResponse = await response.text();
          console.log('Error response:', errorResponse);
          throw new Error('Upload failed');
        }
        const data = await response.json();
        setImage(data.secure_url);
        setLoadingUpload(false);
      } catch (err) {
        setErrorUpload(getError(err as ApiError) || 'Something went wrong');
        setLoadingUpload(false);
      }
    }
  }

  return (
    <Row>
      <Col
        md={6}
        className='mx-auto'
      >
        <h1>Create Product</h1>

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
              onChange={(e) => setName(e.target.value)} />
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
            <label htmlFor="imageFile">Image File</label>
            <input
              type="file"
              className="form-control"
              id="imageFile"
              aria-describedby="imageFile"
              placeholder="Choose your image file"
              onChange={uploadHandler}
            />
            {loadingUpload && <Spinner />}
            {errorUpload && (
              <MessageBox
                variant='danger'
                children={errorUpload}
              />
            )}
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
            Add Product
          </button>
        </form>
      </Col>
    </Row>
  )
}
