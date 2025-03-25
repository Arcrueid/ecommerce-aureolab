import React from "react";

import { ArrowRight } from "lucide-react";

import { Button } from "~/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { Textarea } from "~/components/ui/textarea";

import { type CustomerFormData } from "~/models/checkout";

interface CustomerFormProps {
  formData: CustomerFormData;
  onChange: (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => void;
  onSubmit: (e: React.FormEvent) => Promise<void>;
  processing: boolean;
}

export const CustomerForm = ({
  formData,
  onChange,
  onSubmit,
  processing,
}: CustomerFormProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle id="order-info-heading">Información de entrega</CardTitle>
      </CardHeader>

      <form onSubmit={onSubmit} className="space-y-6">
        <CardContent className="space-y-6">
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Nombre completo</Label>
              <Input
                id="name"
                name="name"
                value={formData.name}
                onChange={onChange}
                required
                disabled={processing}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={onChange}
                required
                disabled={processing}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="address">Dirección de entrega</Label>
              <Textarea
                id="address"
                name="address"
                value={formData.address}
                onChange={onChange}
                required
                disabled={processing}
              />
            </div>
          </div>
        </CardContent>

        <div className="px-4 pb-4">
          <Button
            type="submit"
            className="w-full hover:bg-[#fed137] hover:text-black"
            disabled={
              !formData.name ||
              !formData.email ||
              !formData.address ||
              processing
            }
          >
            Continuar al pago <ArrowRight className="ml-2" size={16} />
          </Button>
        </div>
      </form>
    </Card>
  );
};
