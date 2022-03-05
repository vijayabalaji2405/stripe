import express, { NextFunction, Request, Response } from "express";

export const app = express();

import cors from "cors";
import { createStripeCheckoutSession } from "./checkout";

app.use(express.json());

app.use(cors({ origin: true }));

app.use(decodeJWT);

// app.use(function (req, res, next) {
//   res.header("Access-Control-Allow-Origin", process.env.PORT);
//   res.header(
//     "Access-Control-Allow-Headers",
//     "Origin, X-Requested-With, Content-Type, Accept"
//   );
//   next();
// });

// app.use("/", express.static("./public"));

app.use(
  express.json({
    verify: (req, res, buffer) => (req["rawBody"] = buffer),
  })
);

app.post("/test", (req: Request, res: Response) => {
  console.log("hellow");
  const amount = req.body.amount;
  res.status(200).send({ with_tax: amount * 7 });
});

app.post(
  "/checkouts",
  runAsync(async ({ body }: Request, res: Response) => {
    res.send(await createStripeCheckoutSession(body.line_items));
  })
);

function runAsync(Callback: Function) {
  return (req: Request, res: Response, next: NextFunction) => {
    Callback(req, res, next).catch(next);
  };
}
import { createPaymentIntent } from "./payments";

// create a payment intent
app.post(
  "/payments",
  runAsync(async ({ body }: Request, res: Response) => {
    res.send(await createPaymentIntent(body.amount));
  })
);

import { handleStripeWebhook } from "./webhooks";
import { auth } from "./firebase";
import { createSetupIntent, listPaymentMethods } from "./customer";
import {
  cancelSubscription,
  createSubscription,
  listSubscriptions,
} from "./billing";

app.post("/hooks", runAsync(handleStripeWebhook));

app.post(
  "/wallet",
  runAsync(async (req: Request, res: Response) => {
    console.log("hellow");
    const user = validateUser(req);
    const setupIntent = await createSetupIntent(user.uid);
    res.send(setupIntent);
  })
);
//retrive all cards attached to the customer
app.get(
  "/wallet",
  runAsync(async (req: Request, res: Response) => {
    const user = validateUser(req);
    const wallet = await listPaymentMethods(user.uid);
    res.send(wallet.data);
  })
);

app.post(
  "/subscription",
  runAsync(async (req: Request, res: Response) => {
    const user = validateUser(req);
    const { plan, payment_method } = req.body;
    console.log(plan);
    const subscription = await createSubscription(
      user.uid,
      plan,
      payment_method
    );
    console.log(subscription, "hekejekjekejee");
    res.send(subscription);
  })
);

async function decodeJWT(req: Request, res: Response, next: NextFunction) {
  if (req.headers?.authorization?.startsWith("Bearer ")) {
    const idToken = req.headers.authorization.split("Bearer ")[1];
    // const decodedToken = await auth.verifyIdToken(idToken);
    try {
      const decodedToken = await auth.verifyIdToken(idToken);
      //current user auth record email id from firebase
      req["currentUser"] = decodedToken;
    } catch (err) {
      console.log(err);
    }
  }
  next();
}
function validateUser(req: Request) {
  const user = req["currentUser"];
  if (!user) {
    throw new Error(`you must be logged in to make this request`);
  }
  return user;
}

app.get(
  "/subscriptions",
  runAsync(async (req: Request, res: Response) => {
    const user = validateUser(req);
    const subscription = await listSubscriptions(user.uid);
    res.send(subscription.data);
  })
);

//unsubscripe a subscription
app.patch(
  "/subscriptions/:id",
  runAsync(async (req: Request, res: Response) => {
    const user = validateUser(req);
    res.send(await cancelSubscription(user.uid, req.params.id));
  })
);
