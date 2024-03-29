import { Col, Row } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import { useAdminUsersQuery, useDeleteAdminUserMutation } from "../hooks/userHooks";
import Spinner from "../components/Spinner";
import { useLocation } from "react-router-dom";
import { User } from "../types/User";
import Swal from "sweetalert2";
import MessageBox from "../components/MessageBox";
import { getError } from "../utils/Utils";
import { ApiError } from "../types/ApiError";



export default function AdminUsersPage() {

    const { pathname } = useLocation();

    const navigate = useNavigate();

    const { data: users, isLoading, error } = useAdminUsersQuery();

    const { mutateAsync: deleteAdminUser, isPending } = useDeleteAdminUserMutation();

    if (isLoading || isPending) {
        return <Spinner />
    }

    if (error) {
        return <MessageBox variant="danger">{getError(error as ApiError)}</MessageBox>
    }

    const deleteHandler = async (id: string, isAdmin: boolean) => {
        if (isAdmin) {
            Swal.fire('Error', 'Cannot delete admin user', 'error');
            return;
        }
        await deleteAdminUser(id);
        navigate('/adminusers');
    }

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
                <div>
                    <div className="my-2">
                        <h1>Users</h1>
                    </div>

                    <div className="table-overflow">
                        <table className="table table-success table-striped">
                            <thead>
                                <tr>
                                    <th>ID</th>
                                    <th>NAME</th>
                                    <th>EMAIL</th>
                                    <th>IS ADMIN</th>
                                    <th>ACTIONS</th>
                                </tr>
                            </thead>

                            <tbody>
                                {users?.map((user: User) => (
                                    <tr key={user._id}>
                                        <td>..{user._id.substring(10, 24)}</td>
                                        <td>{user.name}</td>
                                        <td>{user.email}</td>
                                        <td>{user.isAdmin ? 'YES' : 'NO'}</td>
                                        <td>
                                            <Link
                                                to={`/adminuser/${user._id}/edit`}
                                                className="btn btn-primary"
                                            >
                                                Edit
                                            </Link>
                                            &nbsp;
                                            <button
                                                onClick={() => deleteHandler(user._id, user.isAdmin)}
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
