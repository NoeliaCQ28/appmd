import { useEffect, useRef, useState } from "react";

export const useEditData = (initialData = {}, saveFunction) => {
  const [editData, setEditData] = useState(initialData);
  const lastInitialDataRef = useRef(initialData);

  useEffect(() => {
    const hasChanged =
      JSON.stringify(lastInitialDataRef.current) !==
      JSON.stringify(initialData);
    if (hasChanged) {
      setEditData(initialData);
      lastInitialDataRef.current = initialData;
    }
  }, [initialData]);

  const handleChange = (key, value) => {
    setEditData((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const handleSave = () => {
    saveFunction({ ...editData });
  };

  return {
    editData,
    handleChange,
    handleSave,
  };
};
