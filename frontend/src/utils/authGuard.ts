import { redirect } from '@tanstack/react-router';
import { useAuthStore } from '@/store/authStore';

// Ensures the user is authenticated
export const ensureAuthenticated = () => {
  const { isAuthenticated } = useAuthStore.getState();

  if (!isAuthenticated) {
    throw redirect({ to: '/auth/login' });
  }
  return true;
};

// Ensures the user has a specific role (checks against the singular userRole)
export const ensureRole = (requiredRole: string) => {
  const { isAuthenticated, userRole } = useAuthStore.getState();

  if (!isAuthenticated) {
    throw redirect({ to: '/auth/login' });
  }

  if (userRole !== requiredRole) {
    throw redirect({ to: '/unauthorized' });
  }
  return true;
};

// Ensures the user has at least one of the specified roles
// Checks if the singular userRole is present in the list of required roles
export const ensureAnyRole = (requiredRoles: string[]) => {
  const { isAuthenticated, userRole } = useAuthStore.getState();

  if (!isAuthenticated) {
    throw redirect({ to: '/auth/login' });
  }

  // If userRole is null or not found in the requiredRoles array
  if (!userRole || !requiredRoles.includes(userRole)) {
    throw redirect({ to: '/unauthorized' });
  }
  return true;
};