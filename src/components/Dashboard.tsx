import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Header from './dashboard/Header';
import MainContent from './dashboard/MainContent';
import { motion } from 'framer-motion';

const Dashboard: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!user) {
      navigate('/');
    }
  }, [user, navigate]);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="flex flex-col h-screen bg-gray-100"
    >
      <Header handleLogout={handleLogout} />
      {user && user.username === 'Arash' && (
        <div className="bg-yellow-100 p-2 text-center">
          <Link to="/admin" className="text-blue-600 hover:underline">Access Admin Panel</Link>
        </div>
      )}
      <MainContent user={user} error={error} setError={setError} />
    </motion.div>
  );
};

export default Dashboard;