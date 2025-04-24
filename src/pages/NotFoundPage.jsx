import { Link } from 'react-router-dom';
import Nav from '../components/layout/Nav';
import backgroundImage from '../assets/404.png';

export default function NotFound() {
  return (
    <div
      className="min-h-screen bg-cover bg-no-repeat flex items-center justify-center"
      style={{
        backgroundImage: `url(${backgroundImage})`,
        top: '0',
        left: '0',
        right: '0',
        bottom: '0',
        position: 'absolute',
      }}
    >
      <Nav />
      <div className="mx-auto px-4 flex justify-between items-center w-full h-screen">
        <div className="text-left ml-40">
          <h1
            className="text-[122px] font-bold text-pink-600 mb-4 leading-none"
            style={{
              fontFamily: "'Clash Grotesk', sans-serif",
              fontWeight: 700,
              fontSize: '122px',
              letterSpacing: '0%',
            }}
          >
            404
          </h1>
          <h3
            className="text-[46px] text-gray-800 mb-4 leading-none"
            style={{
              fontFamily: "'Clash Grotesk', sans-serif",
              fontWeight: 300,
              letterSpacing: '0%',
            }}
          >
            OOOps!
          </h3>
          <h3
            className="text-[46px] text-gray-800 mb-4 leading-none"
            style={{
              fontFamily: "'Clash Grotesk', sans-serif",
              fontWeight: 300,
              letterSpacing: '0%',
            }}
          >
            Page Not Found
          </h3>
          <Link
            to="/"
            className="inline-block px-6 py-3 text-white bg-gray-800 rounded-full hover:bg-gray-700"
          >
            Back to homepage
          </Link>
        </div>
        <div className="w-1/2"></div>
      </div>
    </div>
  );
}
