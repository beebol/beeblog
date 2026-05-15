'use client';

import { useRef, useCallback } from 'react';

interface ImageUploaderProps {
  onUpload: (markdown: string) => void;
  children: React.ReactNode;
}

export default function ImageUploader({ onUpload, children }: ImageUploaderProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const uploadFile = useCallback(async (file: File) => {
    const formData = new FormData();
    formData.append('file', file);

    try {
      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      if (res.ok) {
        const { url } = await res.json();
        onUpload(`![${file.name}](${url})`);
      } else {
        alert('图片上传失败');
      }
    } catch (error) {
      console.error('Upload error:', error);
      alert('图片上传失败');
    }
  }, [onUpload]);

  const handlePaste = useCallback(async (e: React.ClipboardEvent) => {
    const items = e.clipboardData.items;
    for (const item of items) {
      if (item.type.startsWith('image/')) {
        e.preventDefault();
        const file = item.getAsFile();
        if (file) {
          uploadFile(file);
        }
        break;
      }
    }
  }, [uploadFile]);

  const handleDrop = useCallback(async (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();

    const files = e.dataTransfer.files;
    for (const file of files) {
      if (file.type.startsWith('image/')) {
        uploadFile(file);
      }
    }
  }, [uploadFile]);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      for (const file of files) {
        if (file.type.startsWith('image/')) {
          uploadFile(file);
        }
      }
    }
    e.target.value = '';
  };

  return (
    <div
      onPaste={handlePaste}
      onDrop={handleDrop}
      onDragOver={handleDragOver}
      onClick={handleClick}
      className="cursor-pointer"
    >
      {children}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        multiple
        onChange={handleFileChange}
        className="hidden"
      />
    </div>
  );
}
