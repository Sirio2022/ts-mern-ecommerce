import { useContext, useState } from "react";
import { useUpdateProfileMutation } from "../hooks/userHooks";
import { AppStateContext } from "../Store";
import { toast } from "react-toastify";
import { getError } from "../utils/Utils";
import { ApiError } from "../types/ApiError";
import { Helmet } from "react-helmet-async";
import { Button, Form } from "react-bootstrap";
import LoadingBox from "../components/LoadingBox";
import { useNavigate } from "react-router-dom";



export default function ProfilePage() {
    const navigate = useNavigate();

    const { state: { userInfo }, dispatch } = useContext(AppStateContext);

    const [name, setName] = useState(userInfo!.name || '');
    const [email, setEmail] = useState(userInfo!.email || '');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('')

    const { mutateAsync: updateProfile, isPending } = useUpdateProfileMutation();

    const handleSubmit = async (e: React.SyntheticEvent) => {
        e.preventDefault();


        try {
            if (password !== confirmPassword) {
                toast.error('Passwords do not match');
                return;
            }
            const updatedUser = await updateProfile({ name, email, password });
            dispatch({ type: 'USER_SIGNIN', payload: updatedUser });
            toast.success('Profile Updated Successfully');
            navigate('/');
        } catch (err) {
            toast.error(getError(err as ApiError));
        }
    }

    return (
        <div className="container small-container">

            <Helmet>
                <title>Profile</title>
                <meta
                    name="description"
                    content="Update your profile"
                />
            </Helmet>

            <h1 className="my-3">User Profile</h1>

            <Form onSubmit={handleSubmit} className="form">

                <Form.Group controlId="name" className="mb-3">
                    <Form.Label>Name</Form.Label>

                    <Form.Control
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                    />
                </Form.Group>

                <Form.Group controlId="email" className="mb-3">
                    <Form.Label>Email</Form.Label>

                    <Form.Control
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                </Form.Group>

                <Form.Group controlId="password" className="mb-3">
                    <Form.Label>Password</Form.Label>

                    <Form.Control
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                </Form.Group>

                <Form.Group controlId="confirmPassword" className="mb-3">
                    <Form.Label>Confirm Password</Form.Label>

                    <Form.Control
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        required
                    />
                </Form.Group>

                <div>
                    <Button
                        type="submit"
                        className="btn btn-primary"
                        disabled={isPending}
                    >
                        Update
                    </Button>
                    {isPending && <LoadingBox />}
                </div>

            </Form>

        </div>
    )
}
