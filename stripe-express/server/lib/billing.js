"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.listSubscriptions = exports.cancelSubscription = exports.createSubscription = void 0;
const _1 = require("./");
const firebase_1 = require("./firebase");
const customer_1 = require("./customer");
const firebase_admin_1 = require("firebase-admin");
async function createSubscription(userId, plan, payment_method) {
    const customer = await customer_1.getOrCreateCustomer(userId);
    //Attach the payment method to the customer
    await _1.stripe.paymentMethods.attach(payment_method, { customer: customer.id });
    //set it as a default paymnet method
    await _1.stripe.customers.update(customer.id, {
        invoice_settings: { default_payment_method: payment_method },
    });
    //create a subscription
    const subscription = await _1.stripe.subscriptions.create({
        customer: customer.id,
        items: [{ plan }],
        expand: ["latest_invoice.payment_intent"],
    });
    const invoice = subscription.latest_invoice;
    const payment_intent = invoice.payment_intent;
    if (payment_intent.status === "succeeded") {
        await firebase_1.db
            .collection("users")
            .doc(userId)
            .set({
            stripeCustomerId: customer.id,
            activePlans: firebase_admin_1.firestore.FieldValue.arrayUnion(plan),
        }, { merge: true }
        //merge will confirms that it does not delete any existing items in it
        );
    }
    return subscription;
}
exports.createSubscription = createSubscription;
async function cancelSubscription(userId, subscriptionId) {
    const customer = await customer_1.getOrCreateCustomer(userId);
    if (customer.metadata.firebaseUID !== userId) {
        throw Error("Firebase UID does not match stripe customer");
    }
    const subscription = await _1.stripe.subscriptions.del(subscriptionId);
    if (subscription.status === "canceled") {
        await firebase_1.db
            .collection("users")
            .doc(userId)
            .update({
            activeplans: firebase_admin_1.firestore.FieldValue.arrayRemove(subscription.id),
        });
    }
    return subscription;
}
exports.cancelSubscription = cancelSubscription;
//return all the subscription linked to a firebase userid in stripe
async function listSubscriptions(userId) {
    const customer = await customer_1.getOrCreateCustomer(userId);
    const subscription = await _1.stripe.subscriptions.list({
        customer: customer.id,
    });
    return subscription;
}
exports.listSubscriptions = listSubscriptions;
//# sourceMappingURL=billing.js.map