import React, { FC } from "react";
import { Navigate } from "react-router-dom";
import { Box } from "zmp-ui";
import { useUserStore } from "stores/user";

interface ProtectedRouteProps {
  element: React.ReactElement;
  redirectTo?: string;
}

export const ProtectedRoute: FC<ProtectedRouteProps> = ({
  element,
  redirectTo = "/profile",
}) => {
  const { isAuthenticated, authLoading } = useUserStore();

  // While auth is loading, show loading screen
  if (authLoading) {
    return (
      <Box flex flexDirection="column" className="h-screen items-center justify-center">
        <Box className="text-center">
          <div className="text-lg font-semibold">Đang tải...</div>
        </Box>
      </Box>
    );
  }

  // If not authenticated, redirect to login page
  if (!isAuthenticated) {
    return <Navigate to={redirectTo} replace />;
  }

  // User is authenticated, render the protected component
  return element;
};
