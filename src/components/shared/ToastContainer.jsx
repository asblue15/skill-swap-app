import { useConnectionContext } from './contexts/ConnectionContext';
import Toast from './Toast';

export default function ToastContainer() {
  const { toast, closeToast } = useConnectionContext();

  if (!toast?.show) return null;

  return (
    <div className="fixed top-4 right-4 z-50">
      <Toast
        onClose={closeToast}
        name={toast.name || ''}
        message={toast.message || ''}
        avatar={toast.avatar || '/images/profiles/default-avt.png'}
        type={toast.type || 'success'}
      />
    </div>
  );
}
