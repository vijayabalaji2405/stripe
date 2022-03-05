import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import App from "./App";
import { Elements } from "@stripe/react-stripe-js";
import { FirebaseAppProvider } from "reactfire";
//element is a provider to access stripe js library in react
// Elements is a set of prebuilt UI components for building your web checkout flow
import { loadStripe } from "@stripe/stripe-js";
//add automaticaly the script tag to html head to connect stripe js library
//The loadStripe function asynchronously loads the Stripe.js script and initialises a Stripe object. Pass the returned Promise to Elements

// import { FirebaseAppProvider } from "reactfire";

export const firebaseConfig = {
  apiKey: "AIzaSyCxhsJVVewCB_moqPEn_-BLAzzIfW2H2PA",
  authDomain: "stripe-d68cb.firebaseapp.com",
  projectId: "stripe-d68cb",
  storageBucket: "stripe-d68cb.appspot.com",
  messagingSenderId: "257166316155",
  appId: "1:257166316155:web:07494a5d3d1821fcaf08de",
};

export const stripePromise = loadStripe(
  "pk_test_51KWvTGSAEfEC9jrMrBRa2jJxrwVXhwLPf9YHUpnFHUNyUiav1tVD30QP7uafxSjbaVALmevrWi7XDMzQnFkHoqW100OuS12tXG"
);

ReactDOM.render(
  <React.StrictMode>
    <FirebaseAppProvider firebaseConfig={firebaseConfig}>
      <Elements stripe={stripePromise}>
        <App />
      </Elements>
    </FirebaseAppProvider>
  </React.StrictMode>,
  document.getElementById("root")
);
