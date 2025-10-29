import { useCallback, useState } from "react";

export const useModal = () => {
  const [modals, setModals] = useState({});

  const handleModal = useCallback((modalId, state) => {
    setModals((prev) => ({ ...prev, [modalId]: state }));
  }, []);

  const openModal = useCallback(
    (modalId) => {
      handleModal(modalId, true);
    },
    [handleModal]
  );

  const closeModal = useCallback(
    (modalId) => {
      handleModal(modalId, false);
    },
    [handleModal]
  );

  const toggleModal = useCallback((modalId) => {
    setModals((prev) => ({ ...prev, [modalId]: !prev[modalId] }));
  }, []);

  const isOpen = useCallback(
    (modalId) => {
      return !!modals[modalId];
    },
    [modals]
  );

  const getModalProps = useCallback(
    (modalId, openProp = "open", setOpenProp = "setOpen") => {
      return {
        [openProp]: isOpen(modalId),
        [setOpenProp]: (state) => handleModal(modalId, state),
      };
    },
    [isOpen, handleModal]
  );

  return {
    isOpen,
    openModal,
    closeModal,
    toggleModal,
    getModalProps,
  };
};
