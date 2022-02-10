// React Imports
import React, { useEffect, useState } from "react";
import {BrowserRouter as Router, Route, Switch} from 'react-router-dom';

// Component Imports
import Home from './Home';
import SetupFormWelcome from './SetupFormWelcome';

//AWS Imports
import Amplify, { Auth, Hub } from "aws-amplify";
import config from './aws-exports';

//Stripe Imports
import {Elements} from '@stripe/react-stripe-js';
import {loadStripe} from '@stripe/stripe-js';
import SetupForm from './SetupForm';

//Configure AWS Amplify
Amplify.configure(config);

//Configure Stripe
//TODO: Move Stripe API key to .env file
// THIS IS WHERE THE STRIPE API KEY WOULD GO, 
// APP CURRENTLY NON-FUNCTIONAL AS API KEY WAS REMOVED.
const stripePromise = loadStripe('STRIPE_API_KEY');

//Define initial state of the form
const initialFormState = {
  username: "",
  password: "",
  email: "",
  authCode: "",
  formType: "signIn",
};

const presetOptions = {
  clientSecret: null,
  fonts: [
    {
      family: '"Lato"',
      src: 'local("Lato Regular"), local("Lato-Regular"), url(https://fonts.gstatic.com/s/lato/v13/MDadn8DQ_3oT6kvnUq_2r_esZW2xOQ-xsNqO47m55DA.woff2) format("woff2")',
      weight: 300,
      style: 'normal',
      unicodeRange: 'U+0000-00FF, U+0131, U+0152-0153, U+02C6, U+02DA, U+02DC, U+2000-206F, U+2074, U+20AC, U+2212, U+2215'
    }
  ],

  appearance: {
    labels: "floating",

    variables: {
      colorText: "white",
      fontFamily: "Lato",
      colorBackground: "#192028",
      //Color of Placeholder text (shown when field is in focus)
      colorTextPlaceholder: "#3d4a58",
      spacingUnit: "5px",
      colorTextPlaceholder: "#3d4a58"
    },

    rules: {
      '.Input': {
        border: "none",
      },

      '.Label':{
        //Color of Field Labels
        color: "#3d4a58",
      },
    }
  },
};

function App() {
  const [formState, updateFormState] = useState(initialFormState);
  const [options, setOptions] = useState(presetOptions);

  useEffect(() => {
    const fetchClientSecret = async () => {
      if(true){
        console.log('ran');
        const res = await Auth.currentAuthenticatedUser();
        presetOptions.clientSecret = res.attributes["custom:StripeClientSecret"];
        setOptions(presetOptions);
      }
    }
    fetchClientSecret();
    console.log(options.clientSecret);
  });

  const onChange = (e) => {
    e.persist();
    updateFormState(() => ({ ...formState, [e.target.name]: e.target.value }));
    console.log(formState);
  };

   const signIn = async () => {
    const { username, password } = formState;
    console.log(username);
    console.log(password);
    await Auth.signIn(username, password);
    updateFormState(() => ({ ...formState, formType: "signedIn" }));
    console.log(options.clientSecret);
    window.location.href = "/SetupCardInfo";
    }

  return (
    <div className = "app">


      <Router>
        <div className = "app">
          <Switch>
            <Route exact path = "/">
              <Home/>
              <div className="LoginForm">
        <input
        name = "username"
        id = "login"
        type="text"
        className="login"
        placeholder = "Email"
        onChange={onChange}
        />
        <input
        name = "password"
        id = "password"
        type="password"
        className="password"
        placeholder = "Password"
        onChange={onChange}
        />
        <button
        name ="submit"
        id = "submit"
        type="submit"
        className = "submit"
        onClick = {signIn}>
        LOG IN
        </button>
        <a className = "forgotPass" href="">Forgot Password</a>
        </div>
            </Route>
              <Route path = "/SetupCardInfo" render={() => 
              <>
              <SetupFormWelcome/>
                <Elements stripe={stripePromise} options={options}>
                  <SetupForm />
               </Elements>
              </>
              } />
          </Switch>
        </div>
     </Router>
    </div>
  );
}


export default App;
