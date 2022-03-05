"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getOrCreateCustomer = exports.listPaymentMethods = exports.createSetupIntent = void 0;
const _1 = require("./");
const firebase_1 = require("./firebase");
//used to save a credit card  for later use
async function createSetupIntent(userId) {
    const customer = await getOrCreateCustomer(userId);
    return _1.stripe.setupIntents.create({
        customer: customer.id,
    });
}
exports.createSetupIntent = createSetupIntent;
//return all payment sources associated to the user
async function listPaymentMethods(userId) {
    const customer = await getOrCreateCustomer(userId);
    return _1.stripe.paymentMethods.list({
        customer: customer.id,
        type: "card",
    });
}
exports.listPaymentMethods = listPaymentMethods;
async function getOrCreateCustomer(userId, params) {
    const userSnapShot = await firebase_1.db.collection("users").doc(userId).get();
    const { stripeCustomerId, email } = userSnapShot.data();
    if (!stripeCustomerId) {
        //create a customer
        const customer = await _1.stripe.customers.create(Object.assign({ email, metadata: {
                firebaseUID: userId,
            } }, params));
        await userSnapShot.ref.update({ stripeCustomerId: customer.id });
        return customer;
    }
    else {
        return (await _1.stripe.customers.retrieve(stripeCustomerId));
    }
}
exports.getOrCreateCustomer = getOrCreateCustomer;
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
//# sourceMappingURL=customer.js.map