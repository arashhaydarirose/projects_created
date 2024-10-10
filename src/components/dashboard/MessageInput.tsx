import React from 'react';

interface MessageInputProps {
  message: string;
  setMessage: (message: string) => void;
  handleSendMessage: () => void;
  handlePaste: (event: React.ClipboardEvent) => void;
  messageInputRef: React.RefObject<HTMLTextAreaElement>;
}

const MessageInput: React.FC<MessageInputProps> = ({
  message,
  setMessage,
  handleSendMessage,
  handlePaste,
  messageInputRef
}) => {
  return (
    <textarea
      ref={messageInputRef}
      value={message}
      onChange={(e) => setMessage(e.target.value)}
      onPaste={handlePaste}
      onKeyDown={(e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
          e.preventDefault();
          handleSendMessage();
        }
      }}
      placeholder="Type a message..."
      className="flex-grow p-2 border rounded-l-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
      rows={1}
    />
  );
};

export default MessageInput;