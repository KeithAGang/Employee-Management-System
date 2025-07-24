import { createFileRoute, Link } from '@tanstack/react-router'

export const Route = createFileRoute('/unauthorized')({
  component: RouteComponent,
})

function RouteComponent() {
  return (
     <div className="min-h-screen flex flex-col items-center justify-center bg-white text-gray-900 p-6">
      <h1 className="text-4xl font-bold text-red-600 mb-4">Access Denied!</h1>
      <p className="text-lg text-gray-700 mb-6">
        You do not have the necessary permissions to view this page.
      </p>
      <Link
        className="py-2 px-4 rounded-md bg-black w-fit justify-center items-center text-white"
        to="/auth/login"
      >
        Go to Login
      </Link>
    </div>
  )
}
