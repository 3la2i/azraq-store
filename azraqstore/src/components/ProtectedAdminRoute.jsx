import { Navigate } from 'react-router-dom';

const ProtectedAdminRoute = ({ children }) => {
  const user = JSON.parse(localStorage.getItem('user'));
  
  if (!user || user.role !== 'admin') {
    // Redirect non-admin users to home page
    return <Navigate to="/" replace />;
  }

  return children;
};

export default ProtectedAdminRoute; 