import { Col, Row } from "react-bootstrap";
import Spinner from "../components/Spinner";
import { useAdminOrdersQuery } from "../hooks/orderHooks";
import { Link } from "react-router-dom";
import { formatearFecha, formatoMoneda } from "../utils/Utils";


export default function OrdersPage() {


    const { data: orders, isLoading, error } = useAdminOrdersQuery();

    if (isLoading) {
        return <Spinner />
    }

    if (error) {
        return 'An error occurred: ' + error.message
    }

    if (!orders) {
        return <Spinner />
    }

    const { pathname } = window.location;

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
                    to="/adminusers"
                    className={
                        pathname === '/adminusers'
                            ? 'btn btn-dark my-1 w-100 text-start active'
                            : 'btn btn-dark my-1 w-100 text-start'
                    }
                >Users</Link>
            </Col>
            <Col md={10}>
                <h1 className="my-3">Orders</h1>

                <div className="overflow-x-auto">
                    <table className="table">
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>USER</th>
                                <th>DATE</th>
                                <th>TOTAL</th>
                                <th>PAID AT</th>
                                <th>DELIVERED</th>
                                <th>ACTION</th>
                            </tr>
                        </thead>

                        <tbody>
                            {orders.map((order) => (
                                <tr key={order._id}>
                                    <td>
                                        ..{order._id.substring(20, 24)}
                                    </td>
                                    <td>{order.user?.name || 'Deleted user'}</td>
                                    <td>{order.createdAt.substring(0, 10)}</td>
                                    <td>{formatoMoneda(order.cartPrices.totalPrice)}</td>
                                    <td>{order.isPaid ? formatearFecha(order.paidAt) : 'No'}</td>
                                    <td>{order.isDelivered ? formatearFecha(order.deliveredAt) : 'Not delivered'}</td>
                                    <td>
                                        <Link to={`/order/${order._id}`}>Details</Link>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </Col>
        </Row>
    )
}
