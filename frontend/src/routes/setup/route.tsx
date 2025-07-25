import { createFileRoute, Link, Outlet } from "@tanstack/react-router";
import { GalleryVerticalEnd, Menu, X } from "lucide-react";
import * as React from "react";

export const Route = createFileRoute("/setup")({
  component: AuthLayout,
});

function AuthLayout() {
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <>
      <header className="bg-white text-black p-4 shadow-md border-2 border-b-black">
        <nav className="container mx-auto flex justify-between items-center relative">
          <Link
            to="/"
            className="text-xl font-bold bg-white text-black hover:text-gray-300 transition-colors z-20"
            onClick={() => setIsMenuOpen(false)}
          >
            Corp Inc.
          </Link>

          <button
            onClick={toggleMenu}
            className="md:hidden p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-black z-20"
            aria-label="Toggle navigation"
          >
            {isMenuOpen ? <X className="size-6" /> : <Menu className="size-6" />}
          </button>

          <div
            className={`
              absolute top-full left-0 w-full bg-white shadow-md border-t border-gray-200
              md:static md:w-auto md:shadow-none md:border-t-0
              flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-4 p-4 md:p-0
              transition-transform duration-300 ease-in-out
              ${isMenuOpen ? 'translate-y-0 opacity-100 visible' : '-translate-y-full opacity-0 invisible md:translate-y-0 md:opacity-100 md:visible'}
              md:flex
            `}
          >
            <Link
              to="/setup/employee-profile"
              className="py-2 px-4 rounded-md bg-black text-white hover:bg-blue-700 transition-colors text-sm font-medium text-center"
              onClick={() => setIsMenuOpen(false)}
            >
              Setup Employee Profile
            </Link>
            <Link
              to="/setup/manager-profile"
              className="py-2 px-4 rounded-md bg-black text-white hover:bg-green-700 transition-colors text-sm font-medium text-center"
              onClick={() => setIsMenuOpen(false)}
            >
              Setup Manager Profile
            </Link>
          </div>
        </nav>
      </header>

      <div className="bg-muted flex min-h-svh flex-col items-center justify-center gap-6 p-6 md:p-10">
        <div className="flex w-full max-w-sm flex-col gap-6">
          <a
            href="#"
            className="flex items-center gap-2 self-center font-medium"
          >
            <div className="bg-primary text-primary-foreground flex size-6 items-center justify-center rounded-md">
              <GalleryVerticalEnd className="size-4" />
            </div>
            Corp Inc.
          </a>
          <Outlet />
        </div>
      </div>
    </>
  );
}
