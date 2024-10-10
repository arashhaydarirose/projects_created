import React from 'react';

interface HeaderProps {
  handleLogout: () => void;
}

const Header: React.FC<HeaderProps> = ({ handleLogout }) => {
  return (
    <header className="bg-white shadow">
      <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8 flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <button
          onClick={handleLogout}
          className="px-4 py-2 font-bold text-white bg-blue-500 rounded-full hover:bg-blue-700 focus:outline-none focus:shadow-outline transition duration-300 ease-in-out transform hover:scale-105"
        >
          Logout
        </button>
      </div>
    </header>
  );
};

export default Header;