import { Link } from 'react-router-dom';

export default function NotFoundPage() {
  return (
    <div className="h-screen overflow-hidden flex items-center justify-center bg-[#edf2f7]">
      <style jsx>{`
        .emoji-404 {
          position: relative;
          animation: mymove 2.5s infinite;
        }
        @keyframes mymove {
          33% { top: 0px; }
          66% { top: 20px; }
          100% { top: 0px; }
        }
      `}</style>

      <div className="bg-gray-100 h-screen w-full flex flex-col justify-center">
        <div className="h-[60vh] w-auto flex items-center justify-center">
          <svg
            className="emoji-404 mx-auto"
            width="100%"
            height="auto"
            viewBox="0 0 226 249.135"
          >
            <circle cx="113" cy="113" fill="#FFE585" r="109" />

            <circle cx="80" cy="90" r="10" fill="#6E6E96" />

            <circle cx="146" cy="90" r="10" fill="#6E6E96" />

            <path
              d="M 75 160 Q 113 190 151 160"
              stroke="#6E6E96"
              strokeWidth="5"
              fill="none"
              strokeLinecap="round"
            />
          </svg>

          <div className="tracking-widest mt-4">
            <span className="text-gray-500 text-6xl block">
              <span>4  0  4</span>
            </span>
            <span className="text-gray-500 text-xl">
              Sorry, We couldn't find what you are looking for!
            </span>
          </div>
        </div>
        <div className="mt-6 text-center">
          <Link
            to="/"
            className="text-gray-500 font-mono text-xl bg-gray-200 p-3 rounded-md hover:shadow-md"
          >
            Go back
          </Link>
        </div>
      </div>
    </div>
  );
}
