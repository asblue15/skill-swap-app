import { Outlet } from 'react-router-dom';
import Nav from './Nav';
import Footer from './Footer';
import ToastContainer from '../shared/ToastContainer';

export default function Layout() {
  return (
    <div className="flex flex-col min-h-screen w-full">
      <Nav />
      <main className="flex-grow pt-32 pb-8 w-full">
        <Outlet />
      </main>
      <Footer />
      <ToastContainer />
    </div>
  );
}
