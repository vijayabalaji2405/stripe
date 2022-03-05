import { stripe } from "./";
import { db } from "./firebase";
import Stripe from "stripe";

//used to save a credit card  for later use

export async function createSetupIntent(userId: string) {
  const customer = await getOrCreateCustomer(userId);
  return stripe.setupIntents.create({
    customer: customer.id,
  });
}

//return all payment sources associated to the user
export async function listPaymentMethods(userId: string) {
  const customer = await getOrCreateCustomer(userId);

  return stripe.paymentMethods.list({
    customer: customer.id,
    type: "card",
  });
}

export async function getOrCreateCustomer(
  userId: string,
  params?: Stripe.CustomerCreateParams
) {
  const userSnapShot = await db.collection("users").doc(userId).get();
  const { stripeCustomerId, email } = userSnapShot.data();

  if (!stripeCustomerId) {
    //create a customer
    const customer = await stripe.customers.create({
      email,
      metadata: {
        firebaseUID: userId,
      },
      ...params,
    });
    await userSnapShot.ref.update({ stripeCustomerId: customer.id });
    return customer;
  } else {
    return (await stripe.customers.retrieve(
      stripeCustomerId
    )) as Stripe.Customer;
  }
}

//stripe.setupIntents.create
//Callback(req, res, next).catch(next);
//buffer
//const event = stripe.webhooks.constructEvent(
//   req["rawBody"],
//   sig,
//   process.env.STRIPE_WEBHOOK_SECRET
// );
//payment intent
//setup intent
//return (await stripe.customers.retrieve(
// stripeCustomerId
// )) as Stripe.Customer;
//The as keyword is a Type Assertion in TypeScript which tells the compiler to consider the object as another type than the type the compiler infers the object to be.
