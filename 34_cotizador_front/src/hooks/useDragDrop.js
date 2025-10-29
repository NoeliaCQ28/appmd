import { useState, useCallback } from "react";

export const useDragDrop = (onFileSelect) => {

  const [isDragging, setIsDragging] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);

  const validateFile = (file) => {
    return file.type === "text/csv" || file.name.endsWith(".csv");
  }

  const handleDragOver = useCallback((e) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    setIsDragging(false);

    const file = e.dataTransfer.files[0]
    if (file && validateFile(file)) {
      setSelectedFile(file);
    }
  }, []);

  const handleFileSelect = useCallback((e) => {
    const file = e.target.files?.[0];
    if (file && validateFile(file)) {
      setSelectedFile(file);
    }
  }, []);

  const handleSave = () => {
    if (selectedFile) {
      onFileSelect(selectedFile);
    }
  };

  const reset = () => {
    setSelectedFile(null);
    setIsDragging(false);
  };

  return {
    isDragging,
    selectedFile,
    handleDragOver,
    handleDragLeave,
    handleDrop,
    handleFileSelect,
    handleSave,
    reset,
  }
}
