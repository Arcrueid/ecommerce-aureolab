import Stripe from "stripe";

export const getStripeInstance = (): Stripe => {
  return new Stripe(process.env.STRIPE_SECRET_KEY as string);
};

export default getStripeInstance();
