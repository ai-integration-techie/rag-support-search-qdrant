import React, { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload as UploadIcon, FileText, CheckCircle, AlertCircle, X } from 'lucide-react';
import { uploadAPI } from '../services/api';

const Upload = () => {
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [uploading, setUploading] = useState(false);

  const onDrop = useCallback(async (acceptedFiles) => {
    if (acceptedFiles.length === 0) return;

    setUploading(true);
    const newFiles = [];

    try {
      if (acceptedFiles.length === 1) {
        // Single file upload
        const file = acceptedFiles[0];
        const fileInfo = {
          file,
          status: 'uploading',
          progress: 0,
        };
        newFiles.push(fileInfo);
        setUploadedFiles(prev => [...prev, fileInfo]);

        try {
          const response = await uploadAPI.uploadFile(file);
          const updatedFile = {
            ...fileInfo,
            status: 'success',
            progress: 100,
            response,
          };
          setUploadedFiles(prev => 
            prev.map(f => f.file === file ? updatedFile : f)
          );
        } catch (error) {
          const updatedFile = {
            ...fileInfo,
            status: 'error',
            error: error.message,
          };
          setUploadedFiles(prev => 
            prev.map(f => f.file === file ? updatedFile : f)
          );
        }
      } else {
        // Multiple files upload
        const fileInfos = acceptedFiles.map(file => ({
          file,
          status: 'uploading',
          progress: 0,
        }));
        newFiles.push(...fileInfos);
        setUploadedFiles(prev => [...prev, ...fileInfos]);

        try {
          const response = await uploadAPI.uploadMultiple(acceptedFiles);
          
          // Update each file with response
          response.results.forEach((result, index) => {
            const file = acceptedFiles[index];
            const updatedFile = {
              ...fileInfos[index],
              status: result.status === 'processing' ? 'success' : 'error',
              progress: 100,
              response: result,
            };
            setUploadedFiles(prev => 
              prev.map(f => f.file === file ? updatedFile : f)
            );
          });
        } catch (error) {
          // Mark all files as error
          acceptedFiles.forEach(file => {
            const updatedFile = {
              file,
              status: 'error',
              error: error.message,
            };
            setUploadedFiles(prev => 
              prev.map(f => f.file === file ? updatedFile : f)
            );
          });
        }
      }
    } finally {
      setUploading(false);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'text/csv': ['.csv'],
      'application/pdf': ['.pdf'],
      'text/plain': ['.txt'],
    },
    multiple: true,
    disabled: uploading,
  });

  const removeFile = (fileToRemove) => {
    setUploadedFiles(prev => prev.filter(f => f.file !== fileToRemove));
  };

  const clearAll = () => {
    setUploadedFiles([]);
  };

  const getFileIcon = (file) => {
    const extension = file.name.split('.').pop()?.toLowerCase();
    switch (extension) {
      case 'pdf':
        return <FileText className="text-red-600" size={20} />;
      case 'csv':
        return <FileText className="text-green-600" size={20} />;
      case 'txt':
        return <FileText className="text-blue-600" size={20} />;
      default:
        return <FileText className="text-gray-600" size={20} />;
    }
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className="container">
      {/* Upload Zone */}
      <div className="card">
        <div className="card-header">
          <h2 className="card-title">Upload Documents</h2>
          <p className="card-subtitle">
            Upload CSV, PDF, or TXT files to add them to the knowledge base
          </p>
        </div>

        <div
          {...getRootProps()}
          className={`upload-zone ${isDragActive ? 'dragover' : ''} ${
            uploading ? 'opacity-50 cursor-not-allowed' : ''
          }`}
        >
          <input {...getInputProps()} />
          <div className="upload-icon">
            <UploadIcon size={48} />
          </div>
          <div className="upload-text">
            {isDragActive
              ? 'Drop the files here...'
              : 'Drag & drop files here, or click to select files'}
          </div>
          <div className="upload-hint">
            Supports CSV, PDF, and TXT files up to 50MB
          </div>
        </div>

        {/* File Type Information */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
          <div className="p-4 bg-blue-50 rounded-lg">
            <h4 className="font-semibold mb-2 flex items-center gap-2">
              <FileText className="text-blue-600" size={16} />
              CSV Files
            </h4>
            <p className="text-sm text-gray-600">
              Knowledge base articles with columns: title, content, category
            </p>
          </div>
          
          <div className="p-4 bg-green-50 rounded-lg">
            <h4 className="font-semibold mb-2 flex items-center gap-2">
              <FileText className="text-green-600" size={16} />
              PDF Documents
            </h4>
            <p className="text-sm text-gray-600">
              Manuals, guides, and technical documentation
            </p>
          </div>
          
          <div className="p-4 bg-purple-50 rounded-lg">
            <h4 className="font-semibold mb-2 flex items-center gap-2">
              <FileText className="text-purple-600" size={16} />
              Text Files
            </h4>
            <p className="text-sm text-gray-600">
              Support cases and general documentation
            </p>
          </div>
        </div>
      </div>

      {/* Uploaded Files */}
      {uploadedFiles.length > 0 && (
        <div className="card">
          <div className="card-header">
            <div className="flex justify-between items-center">
              <h3 className="card-title">Uploaded Files</h3>
              <button
                onClick={clearAll}
                className="btn btn-outline btn-sm"
                disabled={uploading}
              >
                Clear All
              </button>
            </div>
          </div>

          <div className="space-y-4">
            {uploadedFiles.map((fileInfo, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-4 border border-gray-200 rounded-lg"
              >
                <div className="flex items-center gap-3 flex-1">
                  {getFileIcon(fileInfo.file)}
                  
                  <div className="flex-1">
                    <div className="font-semibold">{fileInfo.file.name}</div>
                    <div className="text-sm text-gray-600">
                      {formatFileSize(fileInfo.file.size)}
                    </div>
                    {/* Show error message if upload failed */}
                    {fileInfo.status === 'error' && fileInfo.error && (
                      <div className="text-xs text-red-600 mt-1">{fileInfo.error}</div>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  {/* Status */}
                  {fileInfo.status === 'uploading' && (
                    <div className="flex items-center gap-2 text-blue-600">
                      <div className="spinner w-4 h-4"></div>
                      <span className="text-sm">Uploading...</span>
                    </div>
                  )}
                  
                  {fileInfo.status === 'success' && (
                    <div className="flex items-center gap-2 text-green-600">
                      <CheckCircle size={16} />
                      <span className="text-sm">Success</span>
                    </div>
                  )}
                  
                  {fileInfo.status === 'error' && (
                    <div className="flex items-center gap-2 text-red-600">
                      <AlertCircle size={16} />
                      <span className="text-sm">Error</span>
                    </div>
                  )}

                  {/* Remove button */}
                  <button
                    onClick={() => removeFile(fileInfo.file)}
                    className="text-gray-400 hover:text-red-600 transition-colors"
                    disabled={uploading}
                  >
                    <X size={16} />
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Processing Status */}
          {uploadedFiles.some(f => f.status === 'success') && (
            <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-lg">
              <div className="flex items-center gap-2 text-green-700">
                <CheckCircle size={16} />
                <span className="font-semibold">Processing Complete</span>
              </div>
              <p className="text-sm text-green-600 mt-1">
                Files have been uploaded and are being processed. You can now search for content from these documents.
              </p>
            </div>
          )}

          {/* Error Summary */}
          {uploadedFiles.some(f => f.status === 'error') && (
            <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
              <div className="flex items-center gap-2 text-red-700">
                <AlertCircle size={16} />
                <span className="font-semibold">Upload Errors</span>
              </div>
              <p className="text-sm text-red-600 mt-1">
                Some files failed to upload. Please check the error message(s) below for details.
              </p>
            </div>
          )}
        </div>
      )}

      {/* Instructions */}
      <div className="card">
        <div className="card-header">
          <h3 className="card-title">Upload Instructions</h3>
        </div>
        
        <div className="space-y-4">
          <div>
            <h4 className="font-semibold mb-2">CSV Format</h4>
            <p className="text-sm text-gray-600 mb-2">
              For knowledge base articles, include these columns:
            </p>
            <ul className="text-sm text-gray-600 list-disc list-inside space-y-1">
              <li><code>title</code> - Article title</li>
              <li><code>content</code> - Article content</li>
              <li><code>category</code> - Article category (optional)</li>
              <li><code>tags</code> - Comma-separated tags (optional)</li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-semibold mb-2">Support Cases Format</h4>
            <p className="text-sm text-gray-600 mb-2">
              For support cases, include these columns:
            </p>
            <ul className="text-sm text-gray-600 list-disc list-inside space-y-1">
              <li><code>issue</code> - Issue title</li>
              <li><code>description</code> - Issue description</li>
              <li><code>resolution</code> - Resolution steps</li>
              <li><code>status</code> - Case status</li>
              <li><code>customer</code> - Customer name (optional)</li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-semibold mb-2">Text Files</h4>
            <p className="text-sm text-gray-600">
              Text files should contain support cases in the format:
            </p>
            <pre className="text-xs bg-gray-100 p-2 rounded mt-2 overflow-x-auto">
{`Support Case #001
Customer: John Doe
Issue: Unable to login
Description: Customer reports login issues
Resolution: Cleared browser cache
Status: Closed
Date: 2024-01-20`}
            </pre>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Upload; 