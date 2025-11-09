import React, { useRef, useState } from 'react';
import { Upload, File as FileIcon, X } from 'lucide-react';

interface FileUploadProps {
    onFileSelect: (file: File) => void;
    onCancel?: () => void;
    accept?: string;
    label?: string;
    disabled?: boolean;
}

export const FileUpload: React.FC<FileUploadProps> = ({
    onFileSelect,
    onCancel,
    accept = '.pdf,.docx,.txt',
    label = 'Upload Resume',
    disabled = false,
}) => {
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [isDragging, setIsDragging] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            setSelectedFile(file);
            onFileSelect(file);
        }
    };

    const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
        event.preventDefault();
        setIsDragging(true);
    };

    const handleDragLeave = () => {
        setIsDragging(false);
    };

    const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
        event.preventDefault();
        setIsDragging(false);

        const file = event.dataTransfer.files[0];
        if (file) {
            setSelectedFile(file);
            onFileSelect(file);
        }
    };

    const handleClick = () => {
        fileInputRef.current?.click();
    };

    const handleRemove = () => {
        setSelectedFile(null);
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
        if (typeof onCancel === 'function') {
            onCancel();
        }
    };

    return (
        <div className="w-full">
            <label className="block text-sm font-medium text-gray-700 mb-2">
                {label}
            </label>

            <div
                onClick={handleClick}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                className={`
          relative border-2 border-dashed rounded-lg p-8 text-center cursor-pointer
          transition-all duration-200 hover:border-primary-500
          ${isDragging ? 'border-primary-500 bg-primary-50' : 'border-gray-300'}
          ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
        `}
            >
                <input
                    ref={fileInputRef}
                    type="file"
                    accept={accept}
                    onChange={handleFileChange}
                    disabled={disabled}
                    className="hidden"
                    aria-label={label}
                    title={`Upload ${label}`}
                />

                {selectedFile ? (
                    <div className="flex items-center justify-center gap-3">
                        <FileIcon className="w-8 h-8 text-primary-600" />
                        <div className="flex-1 text-left">
                            <p className="font-medium text-gray-900">{selectedFile.name}</p>
                            <p className="text-sm text-gray-500">
                                {(selectedFile.size / 1024).toFixed(2)} KB
                            </p>
                        </div>
                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                handleRemove();
                            }}
                            className="p-1 hover:bg-gray-100 rounded-full transition-colors"
                            aria-label="Remove file"
                            title="Remove selected file"
                        >
                            <X className="w-5 h-5 text-gray-500" />
                        </button>
                    </div>
                ) : (
                    <div className="space-y-2">
                        <Upload className="w-12 h-12 text-gray-400 mx-auto" />
                        <p className="text-gray-600">
                            Drag and drop your file here, or <span className="text-primary-600 font-semibold">browse</span>
                        </p>
                        <p className="text-xs text-gray-500">
                            Supported formats: PDF, DOCX, TXT
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
};
