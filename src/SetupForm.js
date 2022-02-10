import React, {useState} from 'react';
import {useStripe, useElements, PaymentElement} from '@stripe/react-stripe-js';

const SetupForm = () => {
  const stripe = useStripe();
  const elements = useElements();

  const [errorMessage, setErrorMessage] = useState(null);

  const handleSubmit = async (event) => {
    // We don't want to let default form submission happen here,
    // which would refresh the page.
    event.preventDefault();

    if (!stripe || !elements) {
      // Stripe.js has not yet loaded.
      // Make sure to disable form submission until Stripe.js has loaded.
      return;
    }

    const {error} = await stripe.confirmSetup({
      elements,
      confirmParams: {
        return_url: '',
      }
    });

    if (error) {
      setErrorMessage(error.message);
    }

  };

  return (
      <div className='stripe-form-wrapper'>
        <form className = "stripe-form" onSubmit={handleSubmit}>

        <PaymentElement />

        <div className = "form-submit">
          <button disabled={!stripe}><span>SAVE</span></button>
        </div>

        {errorMessage && <div>{errorMessage}</div>}
      </form>
    </div>
  )
};

export default SetupForm;