// s environment variables file. In simple term, it is a variable text file. In this file we set a variable with value and that you wouldn’t want to share with anyone, purpose of file is keep as secret and secure because in .env file we store our database password, username, API key etc…

import { config } from "dotenv";

if (process.env.NODE_ENV !== "production") {
  config();
}

// Initialize Stripe
import Stripe from "stripe";
export const stripe = new Stripe(process.env.STRIPE_SECRET, {
  apiVersion: "2020-08-27",
});

// Start the API with Express
import { app } from "./api";
const port = 2222;
app.listen(port, () =>
  console.log(`API available on http://localhost:${port}`)
);
