import { Navigate, Outlet } from "react-router";

interface PrivateRouteProps {
  isAuthenticated: boolean;
  redirectPath?: string;
}

const PrivateRoute = ({ isAuthenticated, redirectPath = '/login' }: PrivateRouteProps) => {
  if (!isAuthenticated) {
    return <Navigate to={redirectPath} replace />;
  }

  return <Outlet />;
};

export default PrivateRoute;
