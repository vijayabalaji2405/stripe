import { stripe } from "./";
import Stripe from "stripe";

export async function createStripeCheckoutSession(
  line_items: Stripe.Checkout.SessionCreateParams.LineItem[]
) {
  // const url = process.env.WEBAPP_URL;
  const session = await stripe.checkout.sessions.create({
    payment_method_types: ["card"],
    line_items,
    // success_url: `${url}/success?success_id={CHECKOUT_SESSION_ID}`,
    // cancel_url: `${url}failes`,
    success_url: `http://sitename.com/checkout-success`,
    cancel_url: `http://sitename.com/checkout-cancel`,
  });

  return session;
}
