import { Outlet } from 'react-router-dom';
import Nav from './Nav';
import Footer from './Footer';
import ToastContainer from '../shared/ToastContainer';

export default function Layout() {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-grow">
        <Outlet />
      </main>
      <Footer />
      <ToastContainer />
    </div>
  );
}
