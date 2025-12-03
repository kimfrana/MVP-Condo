import PublicLayout from '../layouts/PublicLayout';
import PrivateLayout from '../layouts/PrivateLayout';
import PrivateRoute from './PrivateRoute';

import Login from '../pages/Login';
import Dashboard from '../pages/Dashboard';
import { Navigate, Route, Routes } from 'react-router';

const isAuthenticated = !!localStorage.getItem('user');

const AppRoutes = () => {
  return (
    <Routes>
      <Route element={<PublicLayout />}>
        <Route path="/login" element={<Login />} />
      </Route>

      <Route element={<PrivateRoute isAuthenticated={isAuthenticated} />}>
        <Route element={<PrivateLayout />}>
          <Route path="/" element={<Dashboard />} />
        </Route>
      </Route>
      
      <Route path="*" element={<Navigate to={isAuthenticated ? '/' : '/login'} />} />
    </Routes>
  );
};

export default AppRoutes;
