import { createFileRoute, Link, Outlet } from "@tanstack/react-router";
import { GalleryVerticalEnd } from "lucide-react";

export const Route = createFileRoute("/setup")({
  component: AuthLayout,
});

function AuthLayout() {
  return (
    <>
      <header className="bg-white text-black p-4 shadow-md border-2 border-b-black">
        <nav className="container mx-auto flex justify-between items-center">
          <Link
            to="/"
            className="text-xl font-bold bg-white text-black hover:text-gray-300 transition-colors"
          >
            Corp Inc.
          </Link>
          <div className="space-x-4">
            <Link
              to="/setup/employee-profile"
              className="py-2 px-4 rounded-md bg-black text-white hover:bg-blue-700 transition-colors text-sm font-medium"
            >
              Setup Employee Profile
            </Link>
            <Link
              to="/setup/manager-profile"
              className="py-2 px-4 rounded-md bg-black text-white hover:bg-green-700 transition-colors text-sm font-medium"
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
