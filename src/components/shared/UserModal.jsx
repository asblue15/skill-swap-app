import { useRef, useEffect } from 'react';

export default function UserModal({ user, onClose }) {
  const modalRef = useRef(null);

  useEffect(() => {
    // close by clicking outsie
    function handleClickOutside(event) {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        onClose();
      }
    }

    // close by esc
    function handleEscKey(event) {
      if (event.key === 'Escape') {
        onClose();
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleEscKey);

    // lock scroll when modal is open
    document.body.style.overflow = 'hidden';

    // Cleanup on unmount
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscKey);
      document.body.style.overflow = 'auto';
    };
  }, [onClose]);

  // null if no user
  if (!user) return null;

  const {
    name,
    email,
    profilePicture = '/images/profiles/default-avt.png',
    bio,
    link1,
    link2,
    link3,
    canTeach = [],
    wantsToLearn = [],
    matchType,
    canTeachUser = [],
    canLearnFromUser = [],
  } = user;

  const formatLinks = (url) => {
    if (!url) return null;
    try {
      const domain = new URL(url).hostname.replace('www.', '');
      return {
        url,
        domain,
      };
    } catch (error) {
      console.log('Invalid URL format:', error);
      return { url, domain: url };
    }
  };
  const links = [link1, link2, link3].filter(Boolean).map(formatLinks);

  // match badge style
  const getBadgeStyle = () => {
    switch (matchType) {
      case 'perfect':
        return 'bg-green-100 text-green-800 border-green-500';
      case 'good':
        return 'bg-blue-100 text-blue-800 border-blue-500';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-500';
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm">
      <div
        ref={modalRef}
        className="bg-white dark:bg-gray-800 rounded-lg w-full max-w-lg shadow-2xl overflow-hidden transform transition-all"
      >
        {/* profile pic on header - from tailwind */}
        <div className="relative bg-gradient-to-r from-purple-500 to-pink-500 h-48">
          <button
            onClick={onClose}
            className="custom-button absolute top-4 right-4 bg-black/50 hover:bg-black/70 rounded-full w-8 h-8 flex items-center justify-center text-white transition-colors"
            aria-label="Close"
          >
            ✕
          </button>

          <div className="absolute -bottom-16 left-6">
            <div className="relative">
              <img
                src={profilePicture}
                alt={name}
                className="w-32 h-32 rounded-full border-4 border-white shadow-lg object-cover"
              />
              {matchType && (
                <span
                  className={`absolute -top-2 -right-2 px-2 py-1 rounded-full text-xs font-bold border ${getBadgeStyle()}`}
                >
                  {matchType === 'perfect'
                    ? 'Perfect Match'
                    : matchType === 'good'
                      ? 'Good Match'
                      : ''}
                </span>
              )}
            </div>
          </div>
        </div>
        {/* card contetnt */}
        <div className="pt-4 pb-6 px-6">
          {/* info */}
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">{name}</h2>
            <p className="text-sm text-gray-600 dark:text-gray-400">{email}</p>
          </div>

          {/* links */}
          {links.length > 0 && (
            <div className="mb-6 flex gap-3">
              {links.map((link, index) => (
                <a
                  key={index}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3 py-1 bg-gray-100 rounded-full font-medium text-sm hover:bg-gray-200 transition-colors"
                >
                  {link.domain}
                </a>
              ))}
            </div>
          )}

          {/* bio */}
          {bio && (
            <div className="mb-6 text-left">
              <p className="text-gray-700 dark:text-gray-300">{bio}</p>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* teach skills */}
            {canTeach.length > 0 && (
              <div className="bg-gray-50 dark:bg-gray-700/30 p-4 rounded-lg">
                <h4 className="font-medium text-gray-900 dark:text-gray-100 mb-3 flex items-center">
                  <svg
                    className="w-5 h-5 mr-2 text-purple-500"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                    />
                  </svg>
                  Teaching
                </h4>
                <div className="space-y-2">
                  {canTeach.map((item, i) => (
                    <div key={i} className="flex items-center">
                      <span className="flex-1 text-gray-800 dark:text-gray-200 text-left">
                        {item.skill}
                      </span>
                      <span
                        className={`px-2 py-1 text-xs rounded-full ${
                          item.level === 'expert'
                            ? 'bg-purple-100 text-purple-800 dark:bg-purple-800/20 dark:text-purple-300'
                            : item.level === 'intermediate'
                              ? 'bg-blue-100 text-blue-800 dark:bg-blue-800/20 dark:text-blue-300'
                              : 'bg-green-100 text-green-800 dark:bg-green-800/20 dark:text-green-300'
                        }`}
                      >
                        {item.level}
                      </span>
                    </div>
                  ))}
                </div>

                {/* skills that match currentUser's learning */}
                {canTeachUser.length > 0 && (
                  <div className="mt-3 p-2 bg-yellow-50 dark:bg-yellow-900/20 rounded border border-yellow-200 dark:border-yellow-800/30">
                    <p className="text-xs text-yellow-800 dark:text-yellow-300 font-medium">
                      Can teach you: {canTeachUser.map((skill) => skill.skill).join(', ')}
                    </p>
                  </div>
                )}
              </div>
            )}

            {/* show skills currentUser can LEARN from the matched person */}
            {wantsToLearn.length > 0 && (
              <div className="bg-gray-50 dark:bg-gray-700/30 p-4 rounded-lg text-left">
                <h4 className="font-medium text-gray-900 dark:text-gray-100 mb-3 flex items-center">
                  <svg
                    className="w-5 h-5 mr-2 text-blue-500"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
                    />
                  </svg>
                  Learning
                </h4>
                <div className="space-y-2">
                  {wantsToLearn.map((item, i) => (
                    <div key={i} className="flex items-center">
                      <span className="flex-1 text-gray-800 dark:text-gray-200">{item.skill}</span>
                      <span
                        className={`px-2 py-1 text-xs rounded-full ${
                          item.level === 'expert'
                            ? 'bg-red-100 text-red-800 dark:bg-red-800/20 dark:text-red-300'
                            : item.level === 'intermediate'
                              ? 'bg-orange-100 text-orange-800 dark:bg-orange-800/20 dark:text-orange-300'
                              : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-800/20 dark:text-yellow-300'
                        }`}
                      >
                        {item.level}
                      </span>
                    </div>
                  ))}
                </div>

                {/* show skills currentUser can TEACH the matched person  */}
                {canLearnFromUser.length > 0 && (
                  <div className="mt-3 p-2 bg-green-50 dark:bg-green-900/20 rounded border border-green-200 dark:border-green-800/30">
                    <p className="text-xs text-green-800 dark:text-green-300 font-medium">
                      You can teach: {canLearnFromUser.map((skill) => skill.skill).join(', ')}
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* demo for chat - bonus feature (if time allowed) */}
          <div className="mt-6 text-center flex justify-center gap-5">
            <button
              onClick={() => alert('for demo only')}
              className="px-6 py-3 bg-gradient-to-r from-pink-700 to-purple-900 hover:from-pink-600 hover:to-purple-700 text-white font-medium rounded-lg shadow-md hover:shadow-lg transition-all transform hover:-translate-y-0.5"
            >
              Say Hi!
            </button>
            <a
              href={`/profile/${user.id}`}
              className="py-2 px-4 text-sm font-medium text-gray-900 focus:outline-none bg-white rounded-lg border border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:ring-4 focus:ring-gray-100 "
              onClick={(e) => e.stopPropagation()}
            >
              Visit Page
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
