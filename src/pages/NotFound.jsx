import React from 'react';
import { Link } from 'react-router-dom';

const NotFound = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 px-4 text-center">
      <img
        src="https://illustrations.popsy.co/gray/error-404.svg"
        alt="404 Illustration"
        className="w-64 mb-6"
      />
      <h1 className="text-4xl font-bold text-red-600 mb-2">404 - Page Not Found</h1>
      <p className="text-gray-600 text-lg mb-6">
        The page you’re looking for doesn’t exist or has been moved.
      </p>
      <Link
        to="/"
        className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-6 rounded-full shadow-md transition"
      >
        🏠 Go Back Home
      </Link>
    </div>
  );
};

export default NotFound;
