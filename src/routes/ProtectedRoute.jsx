import { useUser } from '../contexts/UserContext';
import Spinner from '../components/shared/Spinner';
import { Navigate } from 'react-router-dom';
export default function ProtectedRoute({ children }) {
  const { user, ready } = useUser();
  if (!ready) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Spinner fullWidth />
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/landing" />;
  }

  return children;
}
