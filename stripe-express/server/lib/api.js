"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.app = void 0;
const express_1 = __importDefault(require("express"));
exports.app = express_1.default();
const cors_1 = __importDefault(require("cors"));
const checkout_1 = require("./checkout");
exports.app.use(express_1.default.json());
exports.app.use(cors_1.default({ origin: true }));
exports.app.use(decodeJWT);
// app.use(function (req, res, next) {
//   res.header("Access-Control-Allow-Origin", process.env.PORT);
//   res.header(
//     "Access-Control-Allow-Headers",
//     "Origin, X-Requested-With, Content-Type, Accept"
//   );
//   next();
// });
// app.use("/", express.static("./public"));
exports.app.use(express_1.default.json({
    verify: (req, res, buffer) => (req["rawBody"] = buffer),
}));
exports.app.post("/test", (req, res) => {
    console.log("hellow");
    const amount = req.body.amount;
    res.status(200).send({ with_tax: amount * 7 });
});
exports.app.post("/checkouts", runAsync(async ({ body }, res) => {
    res.send(await checkout_1.createStripeCheckoutSession(body.line_items));
}));
function runAsync(Callback) {
    return (req, res, next) => {
        Callback(req, res, next).catch(next);
    };
}
const payments_1 = require("./payments");
// create a payment intent
exports.app.post("/payments", runAsync(async ({ body }, res) => {
    res.send(await payments_1.createPaymentIntent(body.amount));
}));
const webhooks_1 = require("./webhooks");
const firebase_1 = require("./firebase");
const customer_1 = require("./customer");
const billing_1 = require("./billing");
exports.app.post("/hooks", runAsync(webhooks_1.handleStripeWebhook));
exports.app.post("/wallet", runAsync(async (req, res) => {
    console.log("hellow");
    const user = validateUser(req);
    const setupIntent = await customer_1.createSetupIntent(user.uid);
    res.send(setupIntent);
}));
//retrive all cards attached to the customer
exports.app.get("/wallet", runAsync(async (req, res) => {
    const user = validateUser(req);
    const wallet = await customer_1.listPaymentMethods(user.uid);
    res.send(wallet.data);
}));
exports.app.post("/subscription", runAsync(async (req, res) => {
    const user = validateUser(req);
    const { plan, payment_method } = req.body;
    console.log(plan);
    const subscription = await billing_1.createSubscription(user.uid, plan, payment_method);
    console.log(subscription, "hekejekjekejee");
    res.send(subscription);
}));
async function decodeJWT(req, res, next) {
    var _a, _b;
    if ((_b = (_a = req.headers) === null || _a === void 0 ? void 0 : _a.authorization) === null || _b === void 0 ? void 0 : _b.startsWith("Bearer ")) {
        const idToken = req.headers.authorization.split("Bearer ")[1];
        // const decodedToken = await auth.verifyIdToken(idToken);
        try {
            const decodedToken = await firebase_1.auth.verifyIdToken(idToken);
            //current user auth record email id from firebase
            req["currentUser"] = decodedToken;
        }
        catch (err) {
            console.log(err);
        }
    }
    next();
}
function validateUser(req) {
    const user = req["currentUser"];
    if (!user) {
        throw new Error(`you must be logged in to make this request`);
    }
    return user;
}
exports.app.get("/subscriptions", runAsync(async (req, res) => {
    const user = validateUser(req);
    const subscription = await billing_1.listSubscriptions(user.uid);
    res.send(subscription.data);
}));
//unsubscripe a subscription
exports.app.patch("/subscriptions/:id", runAsync(async (req, res) => {
    const user = validateUser(req);
    res.send(await billing_1.cancelSubscription(user.uid, req.params.id));
}));
//# sourceMappingURL=api.js.map