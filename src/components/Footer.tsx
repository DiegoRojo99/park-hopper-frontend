
export function Footer() {
  return (
    <footer className="bg-green-600 text-white text-sm mt-auto">
      <div className="max-w-7xl mx-auto px-4 py-4 text-center">
        © {new Date().getFullYear()} Park Hopper. All rights reserved.
      </div>
    </footer>
  );
}