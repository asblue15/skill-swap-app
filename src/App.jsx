import './App.css';
import {
  BrowserRouter,
  Routes,
  Route
} from "react-router-dom";

// Import shared components
import Button from './components/shared/Button';
import UserCard from './components/shared/UserCard';
import Footer from './components/shared/Footer';
import Spinner from './components/shared/Spinner';
import Toast from './components/shared/Toast';
import {SearchPage} from './pages';


// Import layout components
import Nav from './components/layout/Nav';

const mockUser = {
  id: 'u1',
  name: 'Alice',
  email: 'alice@example.com',
  profilePicture: '/src/assets/skillshare.svg',
  bio: 'Passionate about web development and design. I love creating beautiful and functional web applications.',
  facebook: 'https://facebook.com/alice',
  instagram: 'https://instagram.com/alice',
  x: 'https://x.com/alice',
  canTeach: [
    { skill: 'JavaScript', level: 'advanced' },
    { skill: 'UI/UX', level: 'intermediate' },
  ],
  wantsToLearn: [
    { skill: 'Python', level: 'beginner' },
    { skill: 'SEO', level: 'beginner' },
  ],
};

function App() {
  return (
    <>
      <div className="flex flex-col min-h-screen pt-20">
        {/* Navigation Bar */}
        <Nav />

        {/* Main Content - will flex-grow to push footer down */}
        <BrowserRouter>
          <Routes>
            <Route path="/search" element={<SearchPage />} />
          </Routes>
          <Button content='To search and filter' navigateLink='/search' />

        </BrowserRouter>
      </div>
      
      <Footer />
    </>
  );
}

export default App;
