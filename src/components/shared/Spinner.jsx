import { PuffLoader } from 'react-spinners';

export default function Spinner({ fullWidth }) {
  const spinnerStyle = {
    display: 'flex',
    justifyContent: 'center',
    width: fullWidth ? '100%' : 'auto',
  };
  return (
    <div style={spinnerStyle}>
      <PuffLoader color={'var(--accent-color)'} speedMultiplier={1} />
    </div>
  );
}
