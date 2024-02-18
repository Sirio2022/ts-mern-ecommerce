import { useContext, useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { AppStateContext } from "../Store";
import { useSignInMutation } from "../hooks/userHooks";
import { toast } from "react-toastify";
import { ApiError } from "../types/ApiError";
import { getError } from "../utils/Utils";
import { Button, Container, Form } from "react-bootstrap";
import { Helmet } from "react-helmet-async";
import LoadingBox from "../components/LoadingBox";


export default function SigninPage() {

    const navigate = useNavigate();

    const { search } = useLocation();

    const redirectInUrl = new URLSearchParams(search).get('redirect');

    const redirect = redirectInUrl ? redirectInUrl : '/';

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const { state, dispatch } = useContext(AppStateContext)

    const { userInfo } = state;

    const { mutateAsync: signin, isPending } = useSignInMutation();

    const submitHandler = async (e: React.SyntheticEvent) => {
        e.preventDefault();
        try {
            const data = await signin({ email, password });
            dispatch({ type: 'USER_SIGNIN', payload: data });
            navigate(redirect);
        } catch (error) {
            toast.error(getError(error as ApiError))
        }
    }

    useEffect(() => {
        if (userInfo) {
            navigate(redirect);
        }
    }, [userInfo, navigate, redirect]);

    return (
        <Container className="small-container">
            <Helmet>
                <title>Music Store Sign In</title>
                <meta name="description" content="Sign in to your account" />
            </Helmet>
            <h1 className="my-3">
                Sign In
            </h1>
            <Form onSubmit={submitHandler} className="form" noValidate>

                <Form.Group controlId="email" className="mb-3">

                    <Form.Label>Email address</Form.Label>

                    <Form.Control
                        type="email"
                        placeholder="Enter email"
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
                        onChange={(e) => setPassword(e.target.value)}
                    />

                </Form.Group>

                <div className="mb-3">
                    <Button type="submit" variant="primary" disabled={isPending}>
                        Sign In
                    </Button>
                    {isPending && <LoadingBox />}


                </div>

                <div className="mb-3">
                    <span>
                        New Customer?{' '}
                        <Link to={`/register?redirect=${redirect}`}>Create your account</Link>
                    </span>
                </div>
            </Form>


        </Container>
    )
}
