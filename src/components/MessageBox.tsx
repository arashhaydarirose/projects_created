import React, { useRef, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { tomorrow } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { motion, AnimatePresence } from 'framer-motion';

interface Message {
  role: 'user' | 'assistant' | 'system';
  content: string;
  file?: {
    url: string;
    type: string;
  };
}

interface MessageBoxProps {
  messages: Message[];
  isStreaming: boolean;
}

const MessageBox: React.FC<MessageBoxProps> = ({ messages, isStreaming }) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(scrollToBottom, [messages]);

  const renderFile = (file: { url: string; type: string }) => {
    if (file.type.startsWith('image/')) {
      return <img src={file.url} alt="Uploaded" className="mt-2 max-w-xs rounded shadow-lg" />;
    } else if (file.type === 'application/pdf') {
      return <a href={file.url} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">View PDF</a>;
    } else if (file.type === 'text/csv') {
      return <a href={file.url} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">View CSV</a>;
    } else {
      return <a href={file.url} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">Download File</a>;
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-4 mb-4 overflow-y-auto max-h-[calc(100vh-300px)]">
      <AnimatePresence>
        {messages.map((message, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className={`mb-4 ${
              message.role === 'user' ? 'text-right' : 'text-left'
            }`}
          >
            <div
              className={`inline-block p-3 rounded-lg max-w-[70%] ${
                message.role === 'user'
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-100 text-gray-800'
              } shadow-md`}
            >
              <p className="text-sm font-semibold mb-1">
                {message.role === 'user' ? 'You' : 'AI Assistant'}
              </p>
              <ReactMarkdown
                components={{
                  code({node, inline, className, children, ...props}) {
                    const match = /language-(\w+)/.exec(className || '')
                    return !inline && match ? (
                      <SyntaxHighlighter
                        style={tomorrow}
                        language={match[1]}
                        PreTag="div"
                        {...props}
                      >
                        {String(children).replace(/\n$/, '')}
                      </SyntaxHighlighter>
                    ) : (
                      <code className={className} {...props}>
                        {children}
                      </code>
                    )
                  }
                }}
                className="text-sm whitespace-pre-wrap"
              >
                {message.content}
              </ReactMarkdown>
              {message.file && (
                <div className="mt-2">
                  {renderFile(message.file)}
                </div>
              )}
            </div>
          </motion.div>
        ))}
      </AnimatePresence>
      {isStreaming && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="flex items-center justify-center py-2"
        >
          <div className="loader ease-linear rounded-full border-4 border-t-4 border-gray-200 h-8 w-8"></div>
        </motion.div>
      )}
      <div ref={messagesEndRef} />
    </div>
  );
};

export default MessageBox;