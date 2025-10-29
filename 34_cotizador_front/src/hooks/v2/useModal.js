import React from "react";

export const ACTIONS = {
  OPEN_MODAL: "OPEN_MODAL",
  CLOSE_MODAL: "CLOSE_MODAL",
};

export const useModal = () => {
  const reducer = (state, action) => {
    switch (action.type) {
      case ACTIONS.OPEN_MODAL: {
        const modalId = action.modalId;
        return {
          ...state,
          [modalId]: { isOpen: true },
        };
      }
      case ACTIONS.CLOSE_MODAL: {
        const modalId = action.modalId;
        return {
          ...state,
          [modalId]: { isOpen: false },
        };
      }

      default:
        return state;
    }
  };

  const [modals, dispatch] = React.useReducer(reducer, {});

  const openModal = (modalId) => {
    dispatch({ type: ACTIONS.OPEN_MODAL, modalId });
  };

  const closeModal = (modalId) => {
    dispatch({ type: ACTIONS.CLOSE_MODAL, modalId });
  };

  const setIsOpen = (modalId, isOpen) => {
    isOpen
      ? dispatch({ type: ACTIONS.OPEN_MODAL, modalId })
      : dispatch({ type: ACTIONS.CLOSE_MODAL, modalId });
  };

  // Función auxiliar para obtener el estado de un modal
  const getModalState = (modalId) => {
    return modals[modalId]?.isOpen || false;
  };

  return {
    openModal,
    closeModal,
    setIsOpen,
    getModalState,
  };
};
