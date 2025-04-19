import { useState } from 'react';
export default function Toast({
  onClose,
  name = 'Jese Leos',
  message = "Hi Neil, I would like to learn JS. Let's connect",
  avatar = 'src/assets/skillshare.svg',
}) {
  const [isVisible, setIsVisible] = useState(true);

  const handleDismiss = () => {
    setIsVisible(false);
    if (onClose) onClose();
  };

  return (
    isVisible && (
      <div className="w-full max-w-xs p-4 text-gray-500 bg-white rounded-lg shadow-sm dark:bg-gray-800 dark:text-gray-400">
        <div className="flex">
          <img className="w-8 h-8 rounded-full" src={avatar} alt={`${name}'s avatar`} />
          <div className="ms-3 text-sm font-normal">
            <span className="mb-1 text-sm font-semibold text-gray-900 dark:text-white">{name}</span>
            <div className="mb-2 text-sm font-normal">{message}</div>
            <a
              href="#"
              className="inline-flex px-2.5 py-1.5 text-xs font-medium text-center text-white bg-pink-200 rounded-lg"
            >
              Reply
            </a>
          </div>
          <button
            onClick={handleDismiss}
            className="ml-auto text-white bg-pink-500 hover:bg-pink-600 rounded-full w-7 h-7 flex items-center justify-center shadow"
            aria-label="Close"
          >
            ×
          </button>
        </div>
      </div>
    )
  );
}
