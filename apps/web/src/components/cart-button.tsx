import { useMemo } from "react";

import { ShoppingCartIcon, XIcon } from "lucide-react";

import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerPortal,
  DrawerTitle,
  DrawerTrigger,
} from "~/components/ui/drawer";
import { cn, formatCurrency } from "~/lib/utils";
import { useCartStore } from "~/stores/cart-store";

import { CartListItem } from "./cart-list-item";
import { Button } from "./ui/button";

export const CartButton = () => {
  const {
    items,
    totalItems,
    totalPrice,
    removeItem,
    updateQuantity,
    showCart,
    setShowCart,
  } = useCartStore();
  const isEmpty = useMemo(() => items.length === 0, [items]);

  return (
    <Drawer
      direction="right"
      open={showCart}
      onOpenChange={setShowCart}
      container={document.body.querySelector("#root") as HTMLElement}
      modal={false}
    >
      <DrawerTrigger>
        <button
          className="group flex cursor-pointer flex-row items-center gap-3"
          aria-label={`Ver carrito con ${totalItems} productos`}
        >
          <ShoppingCartIcon
            strokeWidth={1.5}
            className={cn(
              "size-6 transition-all duration-200 group-hover:text-black",
              isEmpty ? "text-gray-400" : "text-black",
            )}
          />
          <span
            className={cn(
              "font-mono text-base font-light text-gray-400 transition-all duration-200 group-hover:text-black",
              isEmpty ? "text-gray-400" : "text-black",
            )}
          >
            {totalItems}
          </span>
        </button>
      </DrawerTrigger>

      <DrawerContent
        className="xs:w-[360px] fixed top-2 right-2 bottom-2 z-60 flex !w-full max-w-full border-none bg-transparent p-2 outline-none"
        style={
          { "--initial-transform": "calc(100% + 8px)" } as React.CSSProperties
        }
      >
        <div className="flex h-full w-full grow flex-col rounded-xl bg-zinc-50 p-5">
          <DrawerHeader className="relative p-2">
            <DrawerTitle className="flex items-center gap-2 text-xl font-bold">
              <ShoppingCartIcon className="-ml-1 size-6" strokeWidth={3} />{" "}
              Carrito
            </DrawerTitle>
            {!isEmpty ? (
              <DrawerDescription>
                Listado de productos ({totalItems})
              </DrawerDescription>
            ) : null}
            <DrawerClose className="absolute top-1 right-1">
              <Button variant="ghost" size="icon" aria-label="Cerrar carrito">
                <XIcon className="size-6" />
              </Button>
            </DrawerClose>
          </DrawerHeader>

          {isEmpty ? (
            <div className="flex flex-1 flex-col items-center justify-center gap-2 p-2">
              <div className="flex flex-col gap-2 text-xl font-bold text-gray-300">
                Aún no hay productos
              </div>
            </div>
          ) : (
            <div className="flex-1 overflow-y-auto py-2">
              <div className="flex flex-col gap-3">
                {items.map((item) => (
                  <CartListItem
                    key={item.product.id}
                    item={item}
                    removeItem={removeItem}
                    updateQuantity={updateQuantity}
                  />
                ))}
              </div>
            </div>
          )}

          <DrawerFooter className="p-2">
            {!isEmpty ? (
              <>
                <div className="mb-4 flex justify-between text-xl font-medium text-gray-900">
                  <p>Total</p>
                  <p>{formatCurrency(totalPrice)}</p>
                </div>
                <Button className="w-full cursor-pointer hover:bg-[#fed137] hover:text-black">
                  Finalizar compra
                </Button>
              </>
            ) : null}
            <DrawerClose>
              <Button variant="outline" className="w-full cursor-pointer">
                Seguir comprando
              </Button>
            </DrawerClose>
          </DrawerFooter>
        </div>
      </DrawerContent>

      {showCart ? (
        <DrawerPortal>
          <DrawerClose className="fixed inset-0 z-20 bg-black/60" />
        </DrawerPortal>
      ) : null}
    </Drawer>
  );
};
