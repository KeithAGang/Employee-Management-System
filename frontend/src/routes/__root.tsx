import { createRootRoute, Outlet, Link } from '@tanstack/react-router'

export const Route = createRootRoute({
  component: () => (
    <>
      {/* Simple Header/Navigation for Setup */}
      <header className="bg-white text-black p-4 shadow-md border-2 border-b-black">
        <nav className="container mx-auto flex justify-between items-center">
          <Link to="/" className="text-xl font-bold bg-white text-black hover:text-gray-300 transition-colors">
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

      <div className="flex-grow">
        <Outlet />
      </div>
    </>
  ),
})
