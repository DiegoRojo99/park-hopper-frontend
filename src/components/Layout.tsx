import { Outlet } from 'react-router-dom';
import Nav from './Nav';
import { Footer } from './Footer';

export function Layout() {
  return (
    <div className="min-h-screen flex flex-col">
      <Nav />
      
      <main className="flex flex-grow p-6 bg-gradient-to-br from-green-200 via-blue-100 to-yellow-100">
        <Outlet />
      </main>

      <Footer />
    </div>
  );
}
