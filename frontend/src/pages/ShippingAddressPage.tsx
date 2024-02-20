import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AppStateContext } from "../Store";
import { Helmet } from "react-helmet-async";
import CheckoutSteps from "../components/CheckoutSteps";
import { Form } from "react-bootstrap";

export default function ShippingAddressPage() {

    const navigate = useNavigate();

    const { state: {
        cart: { shippingAddress },
        userInfo,
    }, dispatch } = React.useContext(AppStateContext);

    useEffect(() => {
        if (!userInfo) {
            navigate('/signin?redirect=/shipping');
        }
    }, [userInfo, navigate]);

    const [fullName, setFullName] = useState(shippingAddress.fullName || '');
    const [address, setAddress] = useState(shippingAddress.address || '')
    const [city, setCity] = useState(shippingAddress.city || '');
    const [postalCode, setPostalCode] = useState(shippingAddress.postalCode || '');
    const [country, setCountry] = useState(shippingAddress.country || '');

    const submitHandler = ((e: React.SyntheticEvent) => {
        e.preventDefault();
        dispatch({
            type: 'SAVE_SHIPPING_ADDRESS',
            payload: { fullName, address, city, postalCode, country }
        });
        navigate('/payment');
    })

    return (
        <div>
            <Helmet>
                <title>Shipping Address</title>
                <meta name="description" content="Enter your shipping address" />
            </Helmet>

            <CheckoutSteps step1 step2 />

            <div className="container small-container">
                <h1 className="mb-3">
                    Shipping Address
                </h1>

                <Form onSubmit={submitHandler} className="form" noValidate>

                    <Form.Group controlId="fullName" className="mb-3">
                        <Form.Label>Full Name</Form.Label>
                        <Form.Control
                            type="text"
                            placeholder="Enter full name"
                            value={fullName}
                            onChange={e => setFullName(e.target.value)}
                        />
                    </Form.Group>

                    <Form.Group controlId="address" className="mb-3">
                        <Form.Label>Address</Form.Label>
                        <Form.Control
                            type="text"
                            placeholder="Enter address"
                            value={address}
                            onChange={e => setAddress(e.target.value)}
                        />
                    </Form.Group>

                    <Form.Group controlId="city" className="mb-3">
                        <Form.Label>City</Form.Label>
                        <Form.Control
                            type="text"
                            placeholder="Enter your city"
                            value={city}
                            onChange={e => setCity(e.target.value)}
                        />
                    </Form.Group>

                    <Form.Group controlId="postal-code  " className="mb-3">
                        <Form.Label>Postal Code</Form.Label>
                        <Form.Control
                            type="text"
                            placeholder="Enter your postal code"
                            value={postalCode}
                            onChange={e => setPostalCode(e.target.value)}
                        />
                    </Form.Group>

                    <Form.Group controlId="country" className="mb-3">
                        <Form.Label>Country</Form.Label>
                        <Form.Control
                            type="text"
                            placeholder="Enter your country"
                            value={country}
                            onChange={e => setCountry(e.target.value)}
                        />
                    </Form.Group>

                    <button type="submit" className="btn btn-primary">
                        Continue
                    </button>

                </Form>

            </div>
        </div>
    )
}
