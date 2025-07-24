import { StrictMode } from 'react'
import ReactDOM from 'react-dom/client'
import { RouterProvider, createRouter } from '@tanstack/react-router'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { useSignalRNotifications } from './hooks/useSignalRNotifications'
import './index.css'

// Import the generated route tree
import { routeTree } from './routeTree.gen'
import { Toaster } from 'react-hot-toast'

// Create a new router instance
const router = createRouter({ routeTree })

const queryClinet = new QueryClient();

function SignalRNotificationListener() {
  useSignalRNotifications();
  return null; // This component doesn't render anything visually
}

// Register the router instance for type safety
declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router
  }
}

// Render the app
const rootElement = document.getElementById('root')!
if (!rootElement.innerHTML) {
  const root = ReactDOM.createRoot(rootElement)
  root.render(
    <StrictMode>
      <QueryClientProvider client={queryClinet}>
        <SignalRNotificationListener />
        <RouterProvider router={router} />
      </QueryClientProvider>
      <Toaster position="bottom-right" reverseOrder={false} /> 
    </StrictMode>,
  )
}