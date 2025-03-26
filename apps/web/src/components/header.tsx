import { Link } from "@tanstack/react-router";

import { CartButton } from "./cart/cart-button";
import { InputSearch } from "./input-search";
import { LogoAureolab } from "./logo-aureolab";

export const Header = () => {
  return (
    <header className="sticky top-0 z-10 border-b border-gray-200 bg-white/85 backdrop-blur-md">
      <div className="container mx-auto flex h-16 items-center gap-2 px-5 md:pl-1">
        <nav className="flex w-full flex-row gap-2">
          <div className="flex flex-1 items-center md:hidden">
            <Link
              to="/orders"
              className="text-sm font-medium text-black [&.active]:text-black"
              aria-label="Ir a mis pedidos"
            >
              Mis pedidos
            </Link>
          </div>

          <div className="flex flex-1 items-center justify-center md:justify-start">
            <Link to="/" aria-label="Ir a la página principal">
              <LogoAureolab className="w-36 text-black md:w-44" />
            </Link>
          </div>

          <div className="hidden w-96 items-center justify-center md:flex">
            <InputSearch />
          </div>

          <div className="flex flex-1 items-center justify-end gap-8">
            <Link
              to="/orders"
              className="hidden text-sm font-medium text-gray-400 hover:text-black md:flex [&.active]:text-black"
              aria-label="Ir a mis pedidos"
            >
              Mis pedidos
            </Link>
            <div className="flex items-center gap-2 text-sm font-medium text-gray-400 [&.active]:text-black">
              <CartButton />
            </div>
          </div>
        </nav>
      </div>
    </header>
  );
};
