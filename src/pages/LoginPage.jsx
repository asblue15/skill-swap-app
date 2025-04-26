import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useUser } from '../contexts/UserContext';
import { getUsers } from '../services/mockDataService';
import bgImage from '../assets/login.webp';
import logo from '../assets/logo1.png';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login, user } = useUser();
  const nav = useNavigate();

  useEffect(() => {
    if (user) {
      nav('/');
    }
  }, [user, nav]);

  const handleSubmit = (e) => {
    e.preventDefault();

    const users = getUsers();

    const foundUser = users.find(
      (u) => u.email === email && u.name.toLowerCase() === password.toLowerCase()
    );

    if (!foundUser) {
      alert('Invalid email or password');
      return;
    }

    login(foundUser);
  };

  return (
    <div
      className="min-h-screen w-full bg-cover bg-center bg-no-repeat flex items-center justify-center"
      style={{
        backgroundImage: `url(${bgImage})`,
      }}
    >
      <div className="absolute inset-0 bg-black/20"></div>

      <form
        className="bg-white/80 p-8 rounded-lg relative z-10 shadow-lg w-full max-w-sm space-y-4 backdrop-blur-2xl"
        onSubmit={handleSubmit}
      >
        <Link to="/" className="flex items-center rtl:space-x-reverse">
          <img src={logo} className="h-20" alt="Skillswap Logo" />
          <h1 className="font-semibold">Skillswap</h1>
        </Link>

        <button
          type="button"
          onClick={() => alert('For demo only')}
          className="w-full flex items-center justify-center gap-2 border border-gray-300 py-2 rounded transition"
        >
          <img
            src="https://www.svgrepo.com/show/475656/google-color.svg"
            alt="Google logo"
            className="w-5 h-5"
          />
          Log in with Google
        </button>

        <div className="flex items-center gap-2">
          <hr className="flex-grow border-gray-300" />
          <span className="text-gray-500 text-sm">or</span>
          <hr className="flex-grow border-gray-300" />
        </div>

        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
          className="w-full border border-amber-950 rounded px-3 py-2 text-gray-800"
          required
        />

        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
          className="w-full border border-amber-950 rounded px-3 py-2 text-gray-800"
          required
        />

        <button
          type="submit"
          className="w-full bg-amber-950 text-white py-2 rounded transition hover:bg-amber-900"
        >
          Log In
        </button>

        <div className="text-center text-gray-800">
          Don't have an account?
          <Link
            to="/signup"
            className="ml-1 font-medium hover:underline"
            style={{ color: 'var(--accent-color)' }}
          >
            Sign up
          </Link>
        </div>
      </form>
    </div>
  );
}
