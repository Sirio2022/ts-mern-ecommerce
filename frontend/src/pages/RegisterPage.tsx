import { useContext, useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { AppStateContext } from "../Store";
import { useRegisterMutation } from "../hooks/userHooks";
import { toast } from "react-toastify";
import { ApiError } from "../types/ApiError";
import { getError } from "../utils/Utils";
import { Button, Container, Form } from "react-bootstrap";
import { Helmet } from "react-helmet-async";
import LoadingBox from "../components/LoadingBox";


export default function RegisterPage() {

    const navigate = useNavigate();

    const { search } = useLocation();

    const redirectInUrl = new URLSearchParams(search).get('redirect');

    const redirect = redirectInUrl ? redirectInUrl : '/';

    const [name, setName] = useState('');
    const [email, setEmail] = useState('')
    const [password, serPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')

    const { state: { userInfo }, dispatch } = useContext(AppStateContext)

    const { mutateAsync: register, isPending } = useRegisterMutation();

    useEffect(() => {
        if (userInfo) {
            navigate(redirect);
        }
    }, [userInfo, navigate, redirect]);

    const submitHandler = async (e: React.SyntheticEvent) => {
        e.preventDefault();

        if (!name || !email || !password || !confirmPassword) {
            toast.error('Please fill in all fields')
            return;
        }

        if (password !== confirmPassword) {
            toast.error('Passwords do not match')
            return;
        } else {
            try {
                const data = await register({ name, email, password });
                dispatch({ type: 'USER_SIGNIN', payload: data });
                navigate(redirect);
                toast.success('Welcome to the store!')
            } catch (error) {
                toast.error(getError(error as ApiError))
            }
        }
    }

    return (
        <Container className="small-container">
            <Helmet>
                <title>Music Store Register</title>
                <meta name="description" content="Register for an account" />
            </Helmet>
            <h1 className="my-3">
                Register
            </h1>
            <Form onSubmit={submitHandler} className="form" noValidate>
                <Form.Group controlId="name" className="mb-3">
                    <Form.Label>Name</Form.Label>

                    <Form.Control
                        type="text"
                        placeholder="Enter name"
                        value={name}
                        required
                        onChange={(e) => setName(e.target.value)}
                    />
                </Form.Group>

                <Form.Group controlId="email" className="mb-3">
                    <Form.Label>Email</Form.Label>

                    <Form.Control
                        type="email"
                        placeholder="Enter Email"
                        value={email}
                        required
                        onChange={(e) => setEmail(e.target.value)}
                    />

                </Form.Group>
                <Form.Group controlId="password" className="mb-3">
                    <Form.Label>Password</Form.Label>

                    <Form.Control
                        type="password"
                        placeholder="Enter your password"
                        value={password}
                        required
                        onChange={(e) => serPassword(e.target.value)}
                    />

                </Form.Group>

                <Form.Group controlId="confirmpassword" className="mb-3">
                    <Form.Label>Confirm Password</Form.Label>

                    <Form.Control
                        type="password"
                        placeholder="Confirm your password"
                        value={confirmPassword}
                        required
                        onChange={(e) => setConfirmPassword(e.target.value)}
                    />

                </Form.Group>

                <div className="mb-3">
                    <Button type="submit" variant="primary" disabled={isPending}>
                        Register
                    </Button>
                    {isPending && <LoadingBox />}
                </div>

                <div className="mb-3">
                    <span>Already have an account? </span>
                    <Link to={`/signin?redirect=${redirect}`}>Sign In</Link>
                </div>

            </Form>
        </Container>
    )
}
