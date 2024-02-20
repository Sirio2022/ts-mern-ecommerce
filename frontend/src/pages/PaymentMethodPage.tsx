import { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AppStateContext } from '../Store';
import CheckoutSteps from '../components/CheckoutSteps';
import { Helmet } from 'react-helmet-async';
import { Form } from 'react-bootstrap';

export default function PaymentMethodPage() {
  const navigate = useNavigate();

  const {
    state: {
      cart: { shippingAddress, paymentMethod },
    },
    dispatch,
  } = useContext(AppStateContext);

  const [paymantMethodName, setPaymentMethodName] = useState(
    paymentMethod || 'PayPal'
  );

  useEffect(() => {
    if (!shippingAddress.address) {
      navigate('/shipping');
    }
  }, [shippingAddress, navigate]);

  const submitHandler = (e: React.SyntheticEvent) => {
    e.preventDefault();
    dispatch({
      type: 'SAVE_PAYMENT_METHOD',
      payload: paymantMethodName,
    });
    navigate('/placeorder');
  };

  return (

    <div>
      <CheckoutSteps step1 step2 step3 />
      <div className="container small-container">
        <Helmet>
          <title>Payment Method</title>
          <meta name="description" content="Select payment method" />
        </Helmet>
        <h1 className="mb-3">Payment Method</h1>
        <Form onSubmit={submitHandler} className="form" noValidate>
          <div className='mb-3'>
            <Form.Check
              type="radio"
              label="PayPal"
              id="PayPal"
              name="paymentMethod"
              value="PayPal"
              checked={paymantMethodName === 'PayPal'}
              onChange={e => setPaymentMethodName(e.target.value)}
            />
          </div>

          <div className='mb-3'>
            <Form.Check
              type="radio"
              label="Stripe"
              id="Stripe"
              name="paymentMethod"
              value="Stripe"
              checked={paymantMethodName === 'Stripe'}
              onChange={e => setPaymentMethodName(e.target.value)}
            />
          </div>
          <div className="mb-3">
            <button type="submit" className="btn btn-primary">
              Continue
            </button>
          </div>
        </Form>


      </div>
    </div>


  )
}
