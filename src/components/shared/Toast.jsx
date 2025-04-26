import { useState, useEffect, useRef } from 'react';

export default function Toast({
  onClose,
  name = 'Jese Leos',
  message = 'Good match',
  avatar = '',
  type = 'success', // 'success', 'info', 'error' --> reuse for many cases
}) {
  const [isVisible, setIsVisible] = useState(true);
  const [showConfetti, _setShowConfetti] = useState(true);
  const toastRef = useRef(null);

  // Add confetti animation
  useEffect(() => {
    // style element for confetti animation
    // ref no.7: https://www.codewithrandom.com/2023/05/01/css-confetti-effects/
    const styleEl = document.createElement('style');
    styleEl.innerHTML = `
      @keyframes confetti {
        0% {
          transform: translateY(-20px) rotate(0deg);
          opacity: 1;
        }
        100% {
          transform: translateY(500px) rotate(720deg);
          opacity: 0;
        }
      }
    `;
    document.head.appendChild(styleEl);

    // Cleanup on unmount
    return () => {
      document.head.removeChild(styleEl);
    };
  }, []);

  // click outisde
  useEffect(() => {
    function handleClickOutside(event) {
      if (toastRef.current && !toastRef.current.contains(event.target)) {
        handleDismiss();
      }
    }
    //close by esc
    function handleEscKey(event) {
      if (event.key === 'Escape') {
        onClose();
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleEscKey);
    // lock scroll when modal is open
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscKey);
      document.body.style.overflow = 'auto';
    };
  }, [onClose]);

  const handleDismiss = () => {
    setIsVisible(false);
    if (onClose) onClose();
  };

  const getColors = () => {
    switch (type) {
      case 'success':
        return 'bg-gradient-to-r from-pink-300 to-purple-800 shadow-lg shadow-pink-400/50';
      case 'error':
        return 'bg-gradient-to-r from-red-400 to-pink-500 shadow-lg shadow-pink-500/50';
      default:
        return 'bg-gradient-to-r from-blue-400 to-purple-500 shadow-lg shadow-purple-500/50';
    }
  };

  const Confetti = () => (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      {/* Animated confetti particles */}
      {Array.from({ length: 50 }).map((_, i) => {
        const size = Math.random() * 10 + 5;
        const color = [
          'bg-pink-500',
          'bg-purple-500',
          'bg-yellow-400',
          'bg-green-400',
          'bg-blue-500',
        ][Math.floor(Math.random() * 5)];
        const left = `${Math.random() * 100}%`;
        // ref no.7: https://www.codewithrandom.com/2023/05/01/css-confetti-effects/
        const animationDuration = `${Math.random() * 4 + 3}s`; // duration
        const animationDelay = `${Math.random() * 2}s`; // random delays
        const animationIterationCount = Math.random() > 0.7 ? 'infinite' : '1'; // loop infinitely

        return (
          <div
            key={i}
            className={`absolute ${color} opacity-70`}
            style={{
              width: size,
              height: size,
              left,
              top: '-20px',
              animation: `confetti ${animationDuration} ease-in ${animationIterationCount} ${animationDelay}`,
            }}
          />
        );
      })}
    </div>
  );

  return (
    isVisible && (
      <div className="relative w-full max-w-md">
        <div ref={toastRef} className={`p-6 text-white rounded-lg ${getColors()}`}>
          {showConfetti && <Confetti />}

          <div className="flex items-center gap-4 my-3">
            <div className="relative">
              <img
                className="w-20 h-20 rounded-full border-4 border-white shadow-lg object-cover"
                src={avatar}
                alt={`${name}'s avatar`}
              />
            </div>

            <div className="flex-1">
              <span className="text-2xl font-bold text-white">{name}</span>
              <div className="text-xl font-medium text-white opacity-90 mt-1">{message} </div>
              <span className="text-2xl">🎉🎉🎉</span>
            </div>

            <button
              onClick={handleDismiss}
              className="custom-button text-white bg-black/40 hover:bg-black/70 rounded-full w-8 h-8 absolute top-4 right-4 flex items-center justify-center self-start transition-colors"
              aria-label="Close"
            >
              ×
            </button>
          </div>
        </div>
      </div>
    )
  );
}
