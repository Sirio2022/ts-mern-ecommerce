import { useNavigate, useParams } from "react-router-dom";
import MessageBox from "../components/MessageBox";
import Spinner from "../components/Spinner";
import { useGetAdminUserByIdQuery, useUpdateAdminUserMutation } from "../hooks/userHooks";
import { ApiError } from "../types/ApiError";
import { getError } from "../utils/Utils";
import { useEffect, useState } from "react";
import { Button, Container, Form } from "react-bootstrap";
import { Helmet } from "react-helmet-async";


export default function AdminUsersEditPage() {


    const { id } = useParams() as { id: string };

    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [isAdmin, setIsAdmin] = useState(false);

    const navigate = useNavigate();

    const { data: user, isLoading, error } = useGetAdminUserByIdQuery(id as string);

    const { mutateAsync: updateUser, isPending, error: updateError } = useUpdateAdminUserMutation();

    useEffect(() => {
        if (user) {
            setName(user.name);
            setEmail(user.email);
            setIsAdmin(user.isAdmin);
        }
    }, [user])

    if (isLoading || isPending) {
        return <Spinner />
    }

    if (error || updateError) {
        return <MessageBox variant='danger'>{getError(error as ApiError)}</MessageBox>

    }

    const userData = {
        _id: id,
        name,
        email,
        isAdmin
    }

    const submitHandler = async (e: React.FormEvent) => {
        e.preventDefault();
        await updateUser(userData);
        navigate('/adminusers');
    }


    return (
        <Container className="small-container">
            <Helmet>
                <title>Edit User</title>
                <meta
                    name="description"
                    content="Edit user"
                />

            </Helmet>

            <h1>Edit User {user?._id.substring(10, 25)}</h1>


            <Form className="form" noValidate onSubmit={submitHandler}>

                <Form.Group controlId='name' className="mb-3">
                    <Form.Label>Name</Form.Label>
                    <Form.Control
                        type='text'
                        placeholder='Enter name'
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                    />
                </Form.Group>

                <Form.Group>
                    <Form.Label>Email</Form.Label>
                    <Form.Control
                        type="email"
                        placeholder="Enter Email"
                        value={email}
                        required
                        onChange={(e) => setEmail(e.target.value)}
                    />

                </Form.Group>

                <Form.Group>
                    <Form.Label>Admin</Form.Label>
                    <Form.Check
                        type="checkbox"
                        checked={isAdmin}
                        onChange={(e) => setIsAdmin(e.target.checked)}
                    />


                </Form.Group>

                <Button
                    type="submit"
                    className="btn btn-dark w-100"
                >
                    Update
                </Button>

            </Form>

        </Container>
    )
}
