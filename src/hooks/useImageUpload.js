import { useState } from 'react';

export const useImageUpload = () => {
  const [preview, setPreview] = useState(null);
  const [file, setFile] = useState(null);

  const handleImageSelect = (event) => {
    const selectedFile = event.target.files?.[0];
    
    if (selectedFile && selectedFile.type.startsWith('image/')) {
      setFile(selectedFile);
      
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result);
      };
      reader.readAsDataURL(selectedFile);
    }
  };

  const handleImageCapture = (event) => {
    handleImageSelect(event);
  };

  const clearImage = () => {
    setPreview(null);
    setFile(null);
  };

  return {
    preview,
    file,
    handleImageSelect,
    handleImageCapture,
    clearImage,
  };
};
