import React, { useRef, useState, ChangeEvent } from 'react';
import Button from './Button';

interface FileUploadProps {
  onFileSelect: (file: File | null) => void;
  acceptedFileTypes?: string; // e.g., "image/*,application/pdf,text/plain"
  maxFileSizeMB?: number;
  label?: string;
  error?: string;
}

const FileUpload: React.FC<FileUploadProps> = ({
  onFileSelect,
  acceptedFileTypes = "image/*,application/pdf,text/plain",
  maxFileSizeMB = 5,
  label = "رفع ملف (صورة، PDF، نص)",
  error,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [fileName, setFileName] = useState<string | null>(null);
  const [internalError, setInternalError] = useState<string | null>(null);

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    setInternalError(null);
    if (event.target.files && event.target.files.length > 0) {
      const file = event.target.files[0];

      if (file.size > maxFileSizeMB * 1024 * 1024) {
        setInternalError(`حجم الملف يتجاوز ${maxFileSizeMB} ميجابايت.`);
        onFileSelect(null);
        setFileName(null);
        return;
      }

      setFileName(file.name);
      onFileSelect(file);
    } else {
      setFileName(null);
      onFileSelect(null);
    }
  };

  const handleButtonClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="relative mb-4 text-right">
      <label className="block text-gray-700 text-sm font-bold mb-2">
        {label}
      </label>
      <div className="flex items-center space-x-2 space-x-reverse">
        <Button
          type="button"
          onClick={handleButtonClick}
          variant="outline"
          className="border-indigo-500 text-indigo-600 hover:bg-indigo-50"
        >
          اختيار ملف
        </Button>
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          accept={acceptedFileTypes}
          className="hidden"
        />
        {fileName && (
          <span className="text-gray-600 truncate max-w-full flex-grow">
            {fileName}
          </span>
        )}
      </div>
      {(error || internalError) && (
        <p className="text-red-500 text-xs mt-1">{error || internalError}</p>
      )}
    </div>
  );
};

export default FileUpload;
