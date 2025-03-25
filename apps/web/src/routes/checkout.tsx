import React, { useCallback, useRef, useState } from "react";

import {
  type PaymentIntent,
  type Stripe,
  type StripeElements,
} from "@stripe/stripe-js";
import { useMutation } from "@tanstack/react-query";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { toast } from "sonner";

import { CustomerForm } from "~/components/checkout/customer-form";
import { EmptyCart } from "~/components/checkout/empty-cart";
import { OrderSummary } from "~/components/checkout/order-summary";
import { PaymentSection } from "~/components/checkout/payment-section";
import { PaymentSuccess } from "~/components/checkout/payment-success";
import { createOrder } from "~/services/orders";
import { createPaymentIntent } from "~/services/payments";
import { useCartStore } from "~/stores/cart-store";

import { CheckoutItemSchema, type CheckoutData } from "~/models/checkout";

function CheckoutPage() {
  const navigate = useNavigate();
  const {
    items,
    totalItems,
    totalPrice,
    updateQuantity,
    removeItem,
    clearCart,
    setEmail,
  } = useCartStore();

  const [currentStep, setCurrentStep] = useState<"customer-info" | "payment">(
    "customer-info",
  );
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    address: "",
  });
  const [stripeReady, setStripeReady] = useState(false);
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [processing, setProcessing] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);

  const stripeRef = useRef<{
    stripe: Stripe | null;
    elements: StripeElements | null;
  }>({ stripe: null, elements: null });

  const { mutateAsync: createPaymentIntentMutation } = useMutation({
    mutationFn: (checkoutData: CheckoutData) =>
      createPaymentIntent(checkoutData),
  });

  const { mutateAsync: createOrderMutation } = useMutation({
    mutationFn: (params: {
      checkoutData: CheckoutData;
      paymentIntent: PaymentIntent;
    }) => createOrder(params.checkoutData, params.paymentIntent),
  });

  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      const { name, value } = e.target;

      if (name === "email") {
        setEmail(value);
      }

      setFormData((prev) => ({ ...prev, [name]: value }));
    },
    [setEmail],
  );

  const handlePaymentSuccess = useCallback(() => {
    setPaymentSuccess(true);
    clearCart();
    setTimeout(() => navigate({ to: "/orders" }), 3000);
  }, [clearCart, navigate]);

  const handleCreatePaymentIntent = useCallback(async () => {
    if (items.length === 0) return;

    try {
      const paymentData = {
        ...formData,
        items: items.map((item) =>
          CheckoutItemSchema.parse({
            id: item.product.id,
            name: item.product.name,
            price: item.product.price,
            quantity: item.quantity,
          }),
        ),
      };

      const { clientSecret } = await createPaymentIntentMutation(paymentData);
      setClientSecret(clientSecret);
    } catch (error) {
      console.error("Error al crear intención de pago:", error);
      toast.error("Error al crear la intención de pago. Inténtalo de nuevo.");
    }
  }, [formData, items, createPaymentIntentMutation]);

  const handleCustomerFormSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      if (formData.name && formData.email && formData.address) {
        setProcessing(true);
        try {
          await handleCreatePaymentIntent();
          setCurrentStep("payment");
        } catch (error: unknown) {
          console.error("Error al preparar pago:", error);
          toast.error("Error al preparar el pago. Inténtalo de nuevo.");
        } finally {
          setProcessing(false);
        }
      }
    },
    [formData, handleCreatePaymentIntent, setCurrentStep, setProcessing],
  );

  const handlePayment = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();

      if (!formData.name || !formData.email || !formData.address) {
        toast.error("Por favor completa todos los campos requeridos");
        return;
      }

      if (
        !stripeRef.current.stripe ||
        !stripeRef.current.elements ||
        !clientSecret
      ) {
        toast.error("El sistema de pago no está listo aún");
        return;
      }

      setProcessing(true);

      try {
        const { error: paymentError, paymentIntent } =
          await stripeRef.current.stripe.confirmPayment({
            elements: stripeRef.current.elements,
            confirmParams: {
              return_url: window.location.origin + "/orders",
              payment_method_data: {
                billing_details: {
                  address: { line1: formData.address },
                  name: formData.name,
                  email: formData.email,
                },
              },
            },
            redirect: "if_required",
          });

        if (paymentError) {
          toast.error(paymentError.message || "Error en el pago");
          return;
        }

        if (
          paymentIntent?.status === "succeeded" ||
          paymentIntent?.status === "requires_capture"
        ) {
          await createOrderMutation({
            checkoutData: {
              name: formData.name,
              email: formData.email,
              address: formData.address,
              items: items.map((item) => ({
                id: item.product.id,
                name: item.product.name,
                price: item.product.price,
                quantity: item.quantity,
              })),
            },
            paymentIntent,
          });

          toast.success("¡Pago realizado con éxito!");
          handlePaymentSuccess();
        } else {
          toast.error("El pago falló por una razón desconocida");
        }
      } catch (error) {
        console.error("Error al procesar el pago:", error);
        toast.error("Error al procesar el pago");
      } finally {
        setProcessing(false);
      }
    },
    [formData, clientSecret, createOrderMutation, items, handlePaymentSuccess],
  );

  if (paymentSuccess) {
    return <PaymentSuccess />;
  }

  if (items.length === 0) {
    return <EmptyCart />;
  }

  return (
    <div className="container mx-auto max-w-5xl px-4 py-8">
      <h1 className="mb-6 text-2xl font-bold">Checkout</h1>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <section aria-labelledby="order-info-heading">
          {currentStep === "customer-info" ? (
            <CustomerForm
              formData={formData}
              onChange={handleInputChange}
              onSubmit={handleCustomerFormSubmit}
              processing={processing}
            />
          ) : (
            <PaymentSection
              clientSecret={clientSecret}
              onStripeReady={setStripeReady}
              stripeRef={stripeRef}
              onSubmit={handlePayment}
              onBack={() => setCurrentStep("customer-info")}
              processing={processing}
              stripeReady={stripeReady}
            />
          )}
        </section>

        <section aria-labelledby="order-summary-heading">
          <OrderSummary
            items={items}
            totalItems={totalItems}
            totalPrice={totalPrice}
            removeItem={removeItem}
            updateQuantity={updateQuantity}
            readOnly={currentStep === "payment"}
          />
        </section>
      </div>
    </div>
  );
}

export const Route = createFileRoute("/checkout")({
  component: CheckoutPage,
});
