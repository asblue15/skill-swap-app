import './App.css';

// Import shared components
import Button from './components/shared/Button';
import UserCard from './components/shared/UserCard';
import Footer from './components/shared/Footer';
import Spinner from './components/shared/Spinner';
import Toast from './components/shared/Toast';

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
      <div className="flex flex-col min-h-screen">
        {/* Navigation Bar */}
        <Nav />

        {/* Main Content - will flex-grow to push footer down */}
        <main className="flex-grow">
          <div className="container mx-auto p-6 mt-10">
            <h1 className="text-red-500 mb-4">Font mình dùng: Unbounded h1</h1>
            <p className="text-red-500 mb-4">còn lại popins</p>
            <p className="text-red-500 mb-4 p-10">
              dưới đây là components chung, mn nếu có tạo ra các components riêng cho feature của
              mình trong folder components/feature
            </p>

            {/* Grid Layout for Components */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {/* Button Component */}
              <div className="flex flex-col items-center">
                <Button />
                <p className="mt-2 text-center text-gray-500">
                  This is a custom button with animations and effects.
                </p>
              </div>

              {/* Card Component */}
              <div className="flex flex-col items-center">
                <UserCard user={mockUser} />
                <p className="mt-2 text-center text-gray-500">
                  A card component to display information in a structured way.
                </p>
              </div>

              {/* Spinner Component */}
              <div className="flex flex-col items-center">
                <Spinner fullWidth={true} />
                <p className="mt-2 text-center text-gray-500">
                  A loading spinner to indicate processing or data loading.
                </p>
              </div>

              {/* Toast Component */}
              <div className="flex flex-col items-center">
                <Toast
                  name="Alice"
                  message="Hey! I want to teach you UI/UX"
                  avatar="src/assets/img-mock.webp"
                />
                <p className="mt-2 text-center text-gray-500">
                  A toast notification component to display messages or alerts.
                </p>
              </div>
            </div>
          </div>
        </main>
      </div>
      <Footer />
    </>
  );
}

export default App;
