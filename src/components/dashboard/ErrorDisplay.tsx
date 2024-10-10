import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface ErrorDisplayProps {
  error: string | null;
}

const ErrorDisplay: React.FC<ErrorDisplayProps> = ({ error }) => {
  return (
    <AnimatePresence>
      {error && (
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" 
          role="alert"
        >
          <strong className="font-bold">Error: </strong>
          <span className="block sm:inline">{error}</span>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ErrorDisplay;