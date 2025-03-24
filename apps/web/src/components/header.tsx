import { Link } from "@tanstack/react-router";

import { CartButton } from "./cart-button";

export const Header = () => {
  return (
    <div className="border-b border-gray-200">
      <div className="container mx-auto flex h-16 items-center gap-2 px-2">
        <div className="flex w-full flex-row gap-2">
          <Link to="/" className="flex flex-1">
            <img
              src="/logo-aureolab-black.svg"
              alt="Aureolab"
              className="w-44"
            />
          </Link>

          <nav className="flex items-center justify-center gap-8">
            <Link
              to="/"
              className="text-sm font-medium text-gray-400 [&.active]:text-black"
            >
              Categorias
            </Link>
          </nav>

          <div className="flex flex-1 items-center justify-end gap-8">
            <Link
              to="/profile"
              className="text-sm font-medium text-gray-400 [&.active]:text-black"
            >
              Perfil
            </Link>
            <div className="flex items-center gap-2 text-sm font-medium text-gray-400 [&.active]:text-black">
              <CartButton />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
