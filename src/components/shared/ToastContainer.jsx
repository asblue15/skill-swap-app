import { useConnectionContext } from '../../contexts/ConnectionContext';
import Toast from './Toast';

export default function ToastContainer() {
  const { toast, closeToast } = useConnectionContext();

  console.log('Toast data in container:', toast);
  if (!toast?.show) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm">
      <Toast
        onClose={closeToast}
        name={toast.name || ''}
        message={toast.message || ''}
        avatar={
          toast.avatar && toast.avatar !== '' ? toast.avatar : '/images/profiles/default-avt.png'
        }
        type={toast.type || 'success'}
      />
    </div>
  );
}
