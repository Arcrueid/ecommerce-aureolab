import Stripe from "stripe";

const stripeSecretKey = process.env.STRIPE_SECRET_KEY;

if (!stripeSecretKey) {
  throw new Error("Missing environment variables");
}

export const getStripeInstance = (): Stripe => {
  return new Stripe(stripeSecretKey);
};

export default getStripeInstance();
