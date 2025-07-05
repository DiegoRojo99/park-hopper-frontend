import { Outlet } from 'react-router-dom';
import Nav from './Nav';
import { Footer } from './Footer';

export function Layout() {
  return (
    <div className="min-h-screen flex flex-col">
      <Nav />
      
      <main className="flex flex-grow bg-white">
        <Outlet />
      </main>

      <Footer />
    </div>
  );
}
