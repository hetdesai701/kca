import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';
import Footer from './Footer';
import ScrollToTop from './ScrollToTop';

export default function Layout() {
  return (
    <div className="flex min-h-screen flex-col bg-ink-950">
      <ScrollToTop />
      <Navbar />
      <main className="flex-1 pt-16 lg:pt-[72px]">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}
