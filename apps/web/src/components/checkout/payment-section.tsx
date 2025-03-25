import React, { memo, useCallback, useEffect } from "react";

import {
  Elements,
  PaymentElement,
  useElements,
  useStripe,
} from "@stripe/react-stripe-js";
import { type Stripe, type StripeElements } from "@stripe/stripe-js";

import { Button } from "~/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { stripePromise } from "~/lib/stripe";

interface PaymentSectionProps {
  clientSecret: string | null;
  onStripeReady: (ready: boolean) => void;
  stripeRef: React.RefObject<{
    stripe: Stripe | null;
    elements: StripeElements | null;
  }>;
  onSubmit: (e: React.FormEvent) => Promise<void>;
  onBack: () => void;
  processing: boolean;
  stripeReady: boolean;
}

export const PaymentSection = ({
  clientSecret,
  onStripeReady,
  stripeRef,
  onSubmit,
  onBack,
  processing,
  stripeReady,
}: PaymentSectionProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle id="order-info-heading">Información de pago</CardTitle>
      </CardHeader>

      <form onSubmit={onSubmit} className="space-y-6">
        <CardContent className="space-y-6">
          <div className="space-y-4">
            {clientSecret ? (
              <StripePaymentSection
                clientSecret={clientSecret}
                onStripeReady={onStripeReady}
                stripeRef={stripeRef}
              />
            ) : (
              <div className="flex h-24 items-center justify-center rounded-md border p-3">
                <p className="text-muted-foreground text-sm">
                  Cargando opciones de pago...
                </p>
              </div>
            )}
          </div>
        </CardContent>

        <div className="flex space-x-4 px-4 pb-4">
          <Button
            type="button"
            variant="outline"
            className="flex-1"
            onClick={onBack}
            disabled={processing}
          >
            Volver
          </Button>

          {clientSecret ? (
            <Button
              type="submit"
              className="flex-1 hover:bg-[#fed137] hover:text-black"
              disabled={processing || !stripeReady}
            >
              {processing ? "Procesando..." : "Pagar ahora"}
            </Button>
          ) : (
            <Button
              disabled
              className="flex-1"
              aria-label="Cargando opciones de pago"
            >
              Cargando...
            </Button>
          )}
        </div>
      </form>
    </Card>
  );
};

const StripeElementsProvider = memo(function StripeElementsProvider({
  onReady,
  onElementsReady,
}: {
  onReady: (stripe: Stripe | null) => void;
  onElementsReady: (elements: StripeElements | null) => void;
}) {
  const stripe = useStripe();
  const elements = useElements();

  useEffect(() => {
    if (stripe) onReady(stripe);
    if (elements) onElementsReady(elements);
  }, [stripe, elements, onReady, onElementsReady]);

  return <PaymentElement />;
});

export const StripePaymentSection = memo(function StripePaymentSection({
  clientSecret,
  onStripeReady,
  stripeRef,
}: {
  clientSecret: string;
  onStripeReady: (ready: boolean) => void;
  stripeRef: React.RefObject<{
    stripe: Stripe | null;
    elements: StripeElements | null;
  }>;
}) {
  const handleStripeReady = useCallback(
    (stripe: Stripe | null) => {
      if (stripe) {
        stripeRef.current.stripe = stripe;
        if (stripeRef.current.elements) onStripeReady(true);
      }
    },
    [stripeRef, onStripeReady],
  );

  const handleElementsReady = useCallback(
    (elements: StripeElements | null) => {
      if (elements) {
        stripeRef.current.elements = elements;
        if (stripeRef.current.stripe) onStripeReady(true);
      }
    },
    [stripeRef, onStripeReady],
  );

  return (
    <Elements
      stripe={stripePromise}
      options={{ clientSecret }}
      key={clientSecret}
    >
      <div className="rounded-md border p-3">
        <StripeElementsProvider
          onReady={handleStripeReady}
          onElementsReady={handleElementsReady}
        />
      </div>
    </Elements>
  );
});
