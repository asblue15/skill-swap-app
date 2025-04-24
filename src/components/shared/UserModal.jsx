// not updated yet

export default function UserModal({ user, onClose }) {
  if (!user) return null;

  const { name, email, profilePicture, bio, facebook, instagram, x, canTeach, wantsToLearn } = user;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg w-full max-w-md">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">{name}</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-700 dark:hover:text-white"
          >
            ✕
          </button>
        </div>
        <img
          src={profilePicture}
          alt={name}
          className="w-24 h-24 rounded-full object-cover mb-4 mx-auto"
        />
        <p className="text-sm text-gray-600 dark:text-gray-300 text-center">{email}</p>
        <p className="text-sm text-gray-600 dark:text-gray-300 mt-4">{bio}</p>

        {canTeach.length > 0 && (
          <div className="mt-4">
            <h4 className="font-medium text-gray-800 dark:text-gray-200">Can Teach:</h4>
            <p className="text-sm text-gray-600 dark:text-gray-300">
              {canTeach.map((item, i) => (
                <span key={i} className="block">
                  {item.skill} ({item.level})
                </span>
              ))}
            </p>
          </div>
        )}

        {wantsToLearn.length > 0 && (
          <div className="mt-4">
            <h4 className="font-medium text-gray-800 dark:text-gray-200">Wants to Learn:</h4>
            <p className="text-sm text-gray-600 dark:text-gray-300">
              {wantsToLearn.map((item, i) => (
                <span key={i} className="block">
                  {item.skill} ({item.level})
                </span>
              ))}
            </p>
          </div>
        )}

        {/* Social Media Links */}
        <div className="mt-4 flex gap-4 justify-center">
          {facebook && (
            <a href={facebook} target="_blank" rel="noopener noreferrer">
              Facebook
            </a>
          )}
          {instagram && (
            <a href={instagram} target="_blank" rel="noopener noreferrer">
              Instagram
            </a>
          )}
          {x && (
            <a href={x} target="_blank" rel="noopener noreferrer">
              X
            </a>
          )}
        </div>
      </div>
    </div>
  );
}
