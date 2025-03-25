import { Card } from "~/components/ui/card";

export const PaymentSuccess = () => {
  return (
    <div className="container mx-auto max-w-4xl px-4 py-8">
      <Card className="p-8 text-center">
        <h1 className="mb-4 text-2xl font-bold">¡Pago Exitoso!</h1>
        <p className="mb-6">
          Tu pedido ha sido procesado correctamente. Redirigiendo a tus
          pedidos...
        </p>
      </Card>
    </div>
  );
};
