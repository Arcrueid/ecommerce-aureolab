import { Link } from "@tanstack/react-router";

import { CartButton } from "./cart-button";
import { LogoAureolab } from "./logo-aureolab";

export const Header = () => {
  return (
    <div className="border-b border-gray-200">
      <div className="container mx-auto flex h-16 items-center gap-2 px-5 md:pl-1">
        <div className="flex w-full flex-row gap-2">
          <div className="flex flex-1 md:hidden">Menu</div>

          <div className="flex flex-1 items-center justify-center md:justify-start">
            <Link to="/">
              <LogoAureolab className="w-36 text-black md:w-44" />
            </Link>
          </div>

          <div className="hidden items-center justify-center gap-8 md:flex"></div>

          <div className="flex flex-1 items-center justify-end gap-8">
            <Link
              to="/profile"
              className="hidden text-sm font-medium text-gray-400 hover:text-black md:flex [&.active]:text-black"
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
