import React from "react";

export const useOtherComponents = (props) => {
  const [components, setComponents] = React.useState(
    props?.initialComponents ?? []
  );

  // const addComponent = (component) => {
  //   const alreadyAdded = components.some((c) => c.id === component.id);

  //   if (!alreadyAdded) {
  //     const payload = [...components, component];
  //     setComponents(payload);
  //   } else {
  //     const payload = components.filter((c) => c.id !== component.id);

  //     setComponents(payload);
  //   }
  // };

  const addComponent = (component) => {
    const alreadyAdded = components.some((c) => c.id === component.id);

    if (!alreadyAdded) {
      setComponents((prev) => [...prev, component]);
    }
  };

  const removeComponent = (component) => {
    const payload = components.filter((c) => c.id !== component.id);
    setComponents(payload);
  };

  const clearAll = () => {
    setComponents([]);
  };

  return {
    components,
    addComponent,
    removeComponent,
    clearAll,
    setComponents
  };
};
