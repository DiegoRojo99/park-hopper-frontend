import { Link } from "react-router-dom";

export default function Admin() {
  const links = [
    { title: "Manage Images", url: "/admin/images" },
    { title: "Countries", url: "/admin/countries" },
    // Add more admin links as needed
  ];

  return (
    <div className="w-full max-w-7xl mx-auto p-4">
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">Admin Panel</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {links.map((link) => (
          <AdminLink key={link.url} linkURL={link.url} title={link.title} />
        ))}
      </div>
    </div>
  );
}

function AdminLink({ linkURL, title }: { linkURL: string; title: string }) {
  return (
    <Link to={linkURL} className="text-blue-500">
      <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow hover:shadow-md transition-shadow cursor-pointer text-center border border-gray-200 dark:border-gray-700">
        {title}
      </div>
    </Link>
  );
}