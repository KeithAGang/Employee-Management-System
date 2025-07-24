import { createFileRoute } from "@tanstack/react-router";
import { Link } from "@tanstack/react-router";

export const Route = createFileRoute("/")({
  component: Index,
});

function Index() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-white text-black">
      <div className="flex flex-col items-center space-y-6 p-8 rounded-lg shadow-lg">
        <svg
          className="w-20 h-20 mb-4"
          fill="none"
          stroke="currentColor"
          strokeWidth={2}
          viewBox="0 0 48 48"
        >
          <rect
            x="8"
            y="16"
            width="32"
            height="24"
            rx="4"
            stroke="currentColor"
            strokeWidth="2"
            fill="#fff"
          />
          <circle
            cx="24"
            cy="12"
            r="6"
            stroke="currentColor"
            strokeWidth="2"
            fill="#fff"
          />
          <path
            d="M16 40v-4a8 8 0 0 1 16 0v4"
            stroke="currentColor"
            strokeWidth="2"
            fill="none"
          />
        </svg>
        <h1 className="text-3xl font-bold text-center">
          Welcome to the Employee Management System
        </h1>
        <p className="text-lg text-center max-w-md">
          Manage your team efficiently and securely. Please log in or sign up to
          get started.
        </p>
        <div className="flex space-x-4">
          <Link
            to="/auth/login"
            className="px-6 py-2 rounded bg-black text-white font-semibold hover:bg-gray-800 transition"
          >
            Log In
          </Link>
          <Link
            to="/auth/signup"
            className="px-6 py-2 rounded border border-black text-black font-semibold hover:bg-gray-100 transition"
          >
            Sign Up
          </Link>
        </div>
        <div className="mt-6">
          <Link
            to="/setup/employee-profile"
            className="px-6 py-2 rounded bg-black text-white font-semibold hover:bg-slate-700 transition"
          >
            Finish Signing Up
          </Link>
        </div>
      </div>
    </div>
  );
}
