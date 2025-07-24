import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/manager/')({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <div
      className="flex flex-col items-center justify-center min-h-[calc(100vh-10rem)] text-center bg-white rounded-lg shadow-xl p-8 mx-auto max-w-4xl"
    >
      <h1
        className="text-5xl font-extrabold text-gray-900 mb-6"
      >
        Welcome, Manager!
      </h1>

      <p
        className="text-lg text-gray-700 mb-8 max-w-2xl"
      >
        On this dashboard, you have access to powerful tools and insights:
      </p>

      <ul
        className="text-left list-disc list-inside space-y-3 text-gray-800 text-lg"
      >
        <li className="flex items-center">
          <span className="mr-2 text-gray-700">➡️</span> See your subordinate employees
        </li>
        <li className="flex items-center">
          <span className="mr-2 text-gray-700">➡️</span> Review their leave applications
        </li>
        <li className="flex items-center">
          <span className="mr-2 text-gray-700">➡️</span> Promote managers
        </li>
        <li className="flex items-center">
          <span className="mr-2 text-gray-700">➡️</span> View comprehensive reports
        </li>
        <li className="flex items-center">
          <span className="mr-2 text-gray-700">➡️</span> Edit your personal profile
        </li>
        <li className="flex items-center">
          <span className="mr-2 text-gray-700">➡️</span> See any important notifications
        </li>
      </ul>

      <div className="mt-10">
        <p className="text-gray-500 text-sm">
          Navigate using the sidebar to explore these features.
        </p>
      </div>
    </div>
  );
}