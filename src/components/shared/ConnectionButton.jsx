import { useState } from 'react';
import { useConnectionContext } from '../../contexts/ConnectionContext';

export default function ConnectionButton({
  isConnected,
  requestSent,
  requestReceived,
  userId,
  onConnect,
  onRespond,
  userData,
}) {
  const [showRespondOptions, setShowRespondOptions] = useState(false);
  const [localRequestSent, setLocalRequestSent] = useState(false);
  const [buttonClicked, setButtonClicked] = useState(false);

  const { showToast } = useConnectionContext();

  // either the prop from parent or local state
  const effectiveRequestSent = requestSent || localRequestSent;

  if (isConnected) {
    return (
      <button
        className="custom-button inline-flex items-center px-4 py-2 text-md font-medium text-white bg-green-800 rounded-lg"
        disabled
      >
        Connected
      </button>
    );
  }

  if (effectiveRequestSent) {
    return (
      <button
        className="custom-button inline-flex items-center px-4 py-2 text-md font-medium text-white bg-gray-400 rounded-lg"
        disabled
      >
        Request Sent
      </button>
    );
  }

  if (requestReceived) {
    if (showRespondOptions) {
      return (
        <div className="flex gap-2">
          <button
            onClick={(e) => {
              e.stopPropagation();
              const result = onRespond(userId, true); // Accept

              // Show Toast
              if (result?.success && userData) {
                showToast(
                  userData.name,
                  `You are connected with ${userData.name}!`,
                  userData.avatar || '/images/profiles/default-avt.png',
                  'success'
                );
              }
            }}
            className="px-3 py-1 text-sm font-medium text-white bg-green-500 rounded-lg"
          >
            Accept
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onRespond(userId, false); // Reject
            }}
            className="px-3 py-1 text-sm font-medium text-white bg-red-500 rounded-lg"
          >
            Reject
          </button>
        </div>
      );
    }

    return (
      <button
        className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-blue-500 rounded-lg"
        onClick={(e) => {
          e.stopPropagation();
          setShowRespondOptions(true);
        }}
      >
        Respond
      </button>
    );
  }

  // Default: Connect
  return (
    <button
      className={`inline-flex items-center px-4 py-2 text-sm font-medium text-white ${
        buttonClicked ? 'bg-pink-700' : 'bg-pink-500'
      } rounded-lg hover:bg-pink-600`}
      onClick={(e) => {
        e.stopPropagation();
        setButtonClicked(true);
        // console.log('Connect button clicked for user:', userId);

        // set local state
        setLocalRequestSent(true);

        const result = onConnect(userId);
        // console.log('Connection result:', result);

        if (!result) {
          // request failed, reset local state after 2s
          setTimeout(() => {
            setLocalRequestSent(false);
          }, 2000);
        }

        setTimeout(() => {
          setButtonClicked(false);
        }, 500);
      }}
    >
      Connect
    </button>
  );
}
