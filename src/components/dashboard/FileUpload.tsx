import React from 'react';
import { Image as ImageIcon } from 'lucide-react';

interface FileUploadProps {
  fileInputRef: React.RefObject<HTMLInputElement>;
  handleFileChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

const FileUpload: React.FC<FileUploadProps> = ({ fileInputRef, handleFileChange }) => {
  return (
    <>
      <button
        onClick={() => fileInputRef.current?.click()}
        className="p-2 bg-gray-200 hover:bg-gray-300"
      >
        <ImageIcon className="text-gray-600" />
      </button>
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept="image/*"
        className="hidden"
      />
    </>
  );
};

export default FileUpload;