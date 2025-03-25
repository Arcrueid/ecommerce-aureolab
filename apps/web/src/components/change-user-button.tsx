import { useCallback, useState } from "react";

import { useQueryClient } from "@tanstack/react-query";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "~/components/ui/alert-dialog";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { useCartStore } from "~/stores/cart-store";

export const ChangeUserButton = () => {
  const setEmail = useCartStore((state) => state.setEmail);
  const [newEmail, setNewEmail] = useState("");
  const [isEmailValid, setIsEmailValid] = useState(false);
  const [open, setOpen] = useState(false);
  const queryClient = useQueryClient();

  const handleEmailChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value;
      setNewEmail(value);
      setIsEmailValid(/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value));
    },
    [],
  );

  const handleUserChange = useCallback(() => {
    if (isEmailValid) {
      setEmail(newEmail);
      queryClient.invalidateQueries({ queryKey: ["orders"] });
      setNewEmail("");
      setOpen(false);
    }
  }, [isEmailValid, newEmail, queryClient, setEmail]);

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger asChild>
        <Button variant="outline" size="sm">
          Cambiar usuario
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Cambiar usuario</AlertDialogTitle>
          <AlertDialogDescription asChild>
            <div className="py-2">
              <p className="mb-3">
                Ingresa el email del usuario para ver sus pedidos:
              </p>
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  if (isEmailValid) handleUserChange();
                }}
              >
                <Input
                  type="email"
                  placeholder="correo@ejemplo.com"
                  value={newEmail}
                  onChange={handleEmailChange}
                  className="mb-2"
                />
              </form>
            </div>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={() => setNewEmail("")}>
            Cancelar
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={handleUserChange}
            disabled={!isEmailValid}
          >
            Confirmar
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
