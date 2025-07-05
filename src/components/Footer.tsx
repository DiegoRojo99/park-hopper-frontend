
export function Footer() {
  return (
    <footer className="bg-light-secondary dark:bg-dark-secondary text-white text-sm mt-auto">
      <div className="max-w-7xl mx-auto px-4 py-4 text-center">
        © {new Date().getFullYear()} Park Hopper. All rights reserved.
      </div>
    </footer>
  );
}