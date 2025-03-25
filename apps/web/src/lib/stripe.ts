import { loadStripe } from "@stripe/stripe-js";

export const stripePromise = loadStripe(__STRIPE_PUBLISHABLE_KEY__);
