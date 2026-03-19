import React, { FC, ReactNode } from "react";
import { Navigate, useLocation } from "react-router";
import { useUserStore } from "stores/user";

type Props = {
  children: ReactNode;
};

export const ProtectedRoute: FC<Props> = ({ children }) => {
  const { isAuthenticated } = useUserStore();
  const location = useLocation();

  if (!isAuthenticated) {
    return (
      <Navigate
        to="/register"
        replace
        state={{ from: location.pathname + location.search }}
      />
    );
  }

  return <>{children}</>;
};

