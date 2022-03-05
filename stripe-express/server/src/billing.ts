import Stripe from "stripe";
import { stripe } from "./";
import { db } from "./firebase";
import { getOrCreateCustomer } from "./customer";
import { firestore } from "firebase-admin";

export async function createSubscription(
  userId: string,
  plan: string,
  payment_method: string
) {
  const customer = await getOrCreateCustomer(userId);
  //Attach the payment method to the customer
  await stripe.paymentMethods.attach(payment_method, { customer: customer.id });
  //set it as a default paymnet method
  await stripe.customers.update(customer.id, {
    invoice_settings: { default_payment_method: payment_method },
  });

  //create a subscription
  const subscription = await stripe.subscriptions.create({
    customer: customer.id,
    items: [{ plan }],
    expand: ["latest_invoice.payment_intent"],
  });

  const invoice = subscription.latest_invoice as Stripe.Invoice;
  const payment_intent = invoice.payment_intent as Stripe.PaymentIntent;

  if (payment_intent.status === "succeeded") {
    await db
      .collection("users")
      .doc(userId)
      .set(
        {
          stripeCustomerId: customer.id,
          activePlans: firestore.FieldValue.arrayUnion(plan),
        },
        { merge: true }
        //merge will confirms that it does not delete any existing items in it
      );
  }
  return subscription;
}

export async function cancelSubscription(
  userId: string,
  subscriptionId: string
) {
  const customer = await getOrCreateCustomer(userId);
  if (customer.metadata.firebaseUID !== userId) {
    throw Error("Firebase UID does not match stripe customer");
  }
  const subscription = await stripe.subscriptions.del(subscriptionId);

  if (subscription.status === "canceled") {
    await db
      .collection("users")
      .doc(userId)
      .update({
        activeplans: firestore.FieldValue.arrayRemove(subscription.id),
      });
  }
  return subscription;
}

//return all the subscription linked to a firebase userid in stripe
export async function listSubscriptions(userId: string) {
  const customer = await getOrCreateCustomer(userId);
  const subscription = await stripe.subscriptions.list({
    customer: customer.id,
  });
  return subscription;
}
