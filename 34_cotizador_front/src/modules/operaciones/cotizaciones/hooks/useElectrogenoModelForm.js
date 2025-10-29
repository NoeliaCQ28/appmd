import React from "react";

export const useElectrogenoModelForm = (initialValues = {}) => {
  const [data, setData] = React.useState(initialValues);

  const onHandleChange = (key, value) => {
    setData((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  return {
    data,
    onHandleChange,
  };
};
