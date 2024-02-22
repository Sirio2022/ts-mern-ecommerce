import { useNavigate } from "react-router-dom"
import { useOrdersHistoryQuery } from "../hooks/orderHooks"
import { useState } from "react"
import { formatearFecha, formatoMoneda, getError } from "../utils/Utils"
import { ApiError } from "../types/ApiError"
import { Helmet } from "react-helmet-async"
import LoadingBox from "../components/LoadingBox"
import MessageBox from "../components/MessageBox"
import { table } from "console"
import { Button } from "react-bootstrap"




export default function OrderHistoryPage() {

    const [msg, setMsg] = useState(undefined as string | undefined)

    const mavigate = useNavigate()

    const { data: orders, isLoading, error } = useOrdersHistoryQuery()

    if (!orders) {
        try {
        } catch (error) {
            setMsg(getError(error as ApiError))
        }
    }



    return (
        <div>
            <Helmet>
                <title>Order History</title>
                <meta
                    name="description"
                    content="Order History"
                />
            </Helmet>

            <h1>Order History</h1>

            {isLoading ? (
                <LoadingBox />
            ) : error ? (
                <MessageBox variant="danger" >{msg}</MessageBox>
            ) : (
                <table className="table">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>DATE</th>
                            <th>TOTAL</th>
                            <th>PAID</th>
                            <th>DELIVERED</th>
                            <th>ACTIONS</th>
                        </tr>
                    </thead>

                    <tbody>
                        {
                            orders!.map((order) => (
                                <tr key={order._id}>
                                    <td>{order._id}</td>
                                    <td>{formatearFecha(order.createdAt)}</td>
                                    <td>{formatoMoneda(order.cartPrices.totalPrice)}</td>
                                    <td>{formatearFecha(order.isPaid ? order.paidAt : 'No')}</td>
                                    <td>{order.isDelivered ? order.deliveredAt : 'No'}</td>
                                    <td>
                                        <Button
                                            type="button"
                                            variant="primary"
                                            onClick={() => mavigate(`/order/${order._id}`)}
                                        >
                                            Details
                                        </Button>
                                    </td>
                                </tr>
                            ))
                        }
                    </tbody>
                </table>
            )}
        </div>
    )
}
