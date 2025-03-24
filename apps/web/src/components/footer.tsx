import { Link } from "@tanstack/react-router";
import { FacebookIcon, LinkedinIcon } from "lucide-react";

import { LogoAureolab } from "./logo-aureolab";

export const Footer = () => {
  return (
    <footer className="mt-auto flex min-h-40 flex-col border-t border-gray-200 bg-[#161b1e]">
      <div className="container mx-auto flex items-center justify-center gap-2 p-8 sm:p-12">
        <div className="flex w-full flex-col items-center justify-between gap-8 sm:flex-row">
          <Link to="/" className="flex" aria-label="Ir a la página principal">
            <LogoAureolab className="w-36 hover:text-[#fed137]" />
          </Link>

          <div className="flex flex-1 items-center justify-end gap-2">
            <nav
              className="flex flex-row items-center justify-center gap-8"
              aria-label="Redes sociales"
            >
              <div className="text-sm text-gray-400">Síguenos</div>
              <ul className="flex items-center gap-4">
                <li>
                  <a
                    href="https://www.facebook.com/aureolabcl"
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="Facebook de Aureolab"
                  >
                    <FacebookIcon className="size-6 text-gray-400 hover:text-[#fed137]" />
                  </a>
                </li>
                <li>
                  <a
                    href="https://www.linkedin.com/company/aureolab"
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="LinkedIn de Aureolab"
                  >
                    <LinkedinIcon className="size-6 text-gray-400 hover:text-[#fed137]" />
                  </a>
                </li>
              </ul>
            </nav>
          </div>
        </div>
      </div>
      <div className="container mx-auto mt-auto mb-3 flex items-center justify-center gap-2 p-2 text-sm font-light text-gray-400">
        <small>© 2025 Aureolab. Todos los derechos reservados.</small>
      </div>
    </footer>
  );
};
