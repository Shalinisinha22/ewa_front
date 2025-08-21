import { Navigate, useLocation } from 'react-router-dom';
import { useCustomer } from '../context/CustomerContext';

const ProtectedRoute = ({ children }) => {
  const { customer, loading } = useCustomer();
  const location = useLocation();
  
  if (loading) {
    return <div>Loading...</div>; // Or your loading component
  }

  if (!customer) {
    // Save the attempted URL
    return <Navigate to="/login" state={{ from: location.pathname }} replace />;
  }

  return children;
};

export default ProtectedRoute;