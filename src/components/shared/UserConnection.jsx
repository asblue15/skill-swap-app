import { Link } from 'react-router-dom';
export default function UserConnection({
  connections = [],
  isCurrentUser = false,
  navigateToMatches = null,
}) {
  return (
    <div className="mb-8">
      <h3 className="text-lg font-semibold mb-4">Connections</h3>
      {connections && connections.length > 0 ? (
        <div className="grid grid-cols-3 sm:grid-cols-4 gap-4">
          {connections.map((conn) => (
            <div key={conn.id} className="text-center">
              <Link to={`/profile/${conn.id}`}>
                <img
                  src={conn.profilePicture}
                  alt={conn.name}
                  className="w-16 h-16 rounded-full mx-auto object-cover border-2 border-gray-200"
                />
              </Link>
              <p className="text-sm mt-1 font-medium">{conn.name}</p>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-6 bg-gray-50 rounded-lg">
          <p className="text-gray-500">No connections yet.</p>
          {isCurrentUser && navigateToMatches && (
            <button onClick={navigateToMatches} className="mt-2 font-medium">
              Find matches
            </button>
          )}
        </div>
      )}
    </div>
  );
}
