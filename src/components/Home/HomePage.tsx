import React from "react";
import { Link } from "react-router-dom";

const HomePage: React.FC = () => {
  return (
    <section className="flex flex-col items-center justify-center px-4 h-full my-auto mx-auto">
      <div className="mb-10 text-center">
        <h1 className="text-5xl font-extrabold text-light-text dark:text-dark-text mb-4 drop-shadow-lg">
          Park Hopper
        </h1>
        <p className="text-xl text-gray-700 max-w-xl mx-auto">
          Discover, plan, and enjoy your next park adventure. Find the best parks, track your visits, and share your experiences!
        </p>
      </div>
      <div className="flex flex-col sm:flex-row gap-6">
        <Link
          to="/parks"
          className="bg-light-primary hover:bg-light-primary-dark text-white font-semibold py-3 px-8 rounded-lg shadow-lg transition text-center"
        >
          Explore Parks
        </Link>
        <Link
          to="/login"
          className="bg-white border border-light-primary text-light-primary font-semibold py-3 px-8 rounded-lg shadow-lg hover:bg-light-accent hover:text-white transition text-center"
        >
          Sign In
        </Link>
      </div>
    </section>
  );
};

export default HomePage;