import { Col, Row } from "react-bootstrap";
import { useDeleteAdminProductMutation, useGetAdminProductsQuery } from "../hooks/productHooks";
import { Link, useLocation } from "react-router-dom";
import Spinner from "../components/Spinner";
import MessageBox from "../components/MessageBox";
import { formatoMoneda, getError } from "../utils/Utils";
import { ApiError } from "../types/ApiError";


export default function AdminProductsPage() {

    const { pathname } = useLocation();

    const { data: products, isLoading, error } = useGetAdminProductsQuery();

    const { mutateAsync: deleteProduct, isPending: deleteLoading, error: deleteError } = useDeleteAdminProductMutation();

    if (isLoading || deleteLoading) return <Spinner />

    if (error || deleteError) {
        return <MessageBox variant='danger'>{getError(error as ApiError)}</MessageBox>
    }

    if (products?.length === 0) return <MessageBox>No products found</MessageBox>


    return (
        <Row>
            <Col md={2}>
                <Link
                    to="/dashboard"
                    className={
                        pathname === '/dashboard'
                            ? 'btn btn-dark my-1 w-100 text-start active'
                            : 'btn btn-dark my-1 w-100 text-start'
                    }
                >Dashboard</Link>
                <Link
                    to="/adminorders"
                    className={
                        pathname === '/adminorders'
                            ? 'btn btn-dark my-1 w-100 text-start active'
                            : 'btn btn-dark my-1 w-100 text-start'
                    }
                >Orders</Link>
                <Link
                    to="/adminproducts"
                    className={
                        pathname === '/adminproducts'
                            ? 'btn btn-dark my-1 w-100 text-start active'
                            : 'btn btn-dark my-1 w-100 text-start'
                    }
                >Products</Link>
                <Link
                    to="/userlist"
                    className={
                        pathname === '/userlist'
                            ? 'btn btn-dark my-1 w-100 text-start active'
                            : 'btn btn-dark my-1 w-100 text-start'
                    }
                >Users</Link>
            </Col>

            <Col md={10}>
                <div>
                    <div className="d-flex justify-content-between align-content-center mb-4">
                        <h1>Products</h1>
                        <button
                            disabled={deleteLoading}
                            className='btn btn-info'
                        >
                            <Link
                                className="text-white text-decoration-none text-uppercase fon"

                                to="/admincreateproduct">Create Product</Link>
                        </button>

                    </div>

                    <div className="table-overflow">
                        <table className="table table-success table-striped">
                            <thead>
                                <tr>
                                    <th>ID</th>
                                    <th>Name</th>
                                    <th>Price</th>
                                    <th>Category</th>
                                    <th>Count in stock</th>
                                    <th>Rating</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>

                            <tbody>
                                {products?.map(product => (
                                    <tr key={product._id}>
                                        <td>{product._id && `...${product._id.substring(20, 24)}`}</td>
                                        <td>{product.name}</td>
                                        <td>{formatoMoneda(product.price)}</td>
                                        <td>{product.category}</td>
                                        <td>{product.countInStock}</td>
                                        <td>{product.rating}</td>
                                        <td>
                                            <Link
                                                to={`/adminproduct/${product._id}/edit`}
                                                className="btn btn-warning"
                                            >
                                                Edit
                                            </Link>
                                            &nbsp;
                                            <button
                                                onClick={() => deleteProduct(product._id as string)}
                                                className="btn btn-danger"
                                            >
                                                Delete
                                            </button>
                                        </td>


                                    </tr>
                                ))}
                            </tbody>
                        </table>

                    </div>
                </div>
            </Col>
        </Row>
    )
}
