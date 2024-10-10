import React from 'react';
import { Send } from 'lucide-react';

interface SendButtonProps {
  handleSendMessage: () => void;
}

const SendButton: React.FC<SendButtonProps> = ({ handleSendMessage }) => {
  return (
    <button
      onClick={handleSendMessage}
      className="p-2 bg-blue-500 text-white rounded-r-lg hover:bg-blue-600"
    >
      <Send />
    </button>
  );
};

export default SendButton;