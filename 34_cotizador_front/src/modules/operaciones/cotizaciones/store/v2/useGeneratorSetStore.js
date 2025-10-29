import { create } from "zustand";
import { devtools } from "zustand/middleware";

const STORE_NAME = "useGeneratorSetStore";

const ACTIONS = Object.freeze({
  ADD_GENERATOR_SET: "ADD_GENERATOR_SET",
  COMMIT_GENERATOR_SETS_ADDED: "COMMIT_GENERATOR_SETS_ADDED",
  REMOVE_GENERATOR_SET_UNCONFIRMED: "REMOVE_GENERATOR_SET_UNCONFIRMED",
  REMOVE_GENERATOR_SET: "REMOVE_GENERATOR_SET",
  UPDATE_GENERATOR_SET_QUANTITY: "UPDATE_GENERATOR_SET_QUANTITY",
  CLEAR_DETAILS: "CLEAR_DETAILS",
});

const SAVE_STATUS = Object.freeze({
  UNCONFIRMED: "UNCONFIRMED",
  COMMITTED: "COMMITTED",
});

const initialState = {
  generatorSetsAdded: [],
};

export const useGeneratorSetStore = create(
  devtools(
    (set) => ({
      ...initialState,

      addGeneratorSet(generatorSet) {
        set(
          (state) => ({
            generatorSetsAdded: [
              ...state.generatorSetsAdded,
              {
                ...generatorSet,
                _meta: { saveStatus: SAVE_STATUS.UNCONFIRMED },
              },
            ],
          }),
          null,
          ACTIONS.ADD_GENERATOR_SET
        );
      },

      commitGeneratorSetsAdded() {
        set(
          (state) => ({
            generatorSetsAdded: state.generatorSetsAdded.map(
              (generatorSet) => ({
                ...generatorSet,
                _meta: { saveStatus: SAVE_STATUS.COMMITTED },
              })
            ),
          }),
          null,
          ACTIONS.COMMIT_GENERATOR_SETS_ADDED
        );
      },

      removeUnconfirmedGeneratorSets() {
        set(
          (state) => ({
            generatorSetsAdded: state.generatorSetsAdded.filter(
              (generatorSet) =>
                generatorSet._meta.saveStatus !== SAVE_STATUS.UNCONFIRMED
            ),
          }),
          null,
          ACTIONS.REMOVE_GENERATOR_SET_UNCONFIRMED
        );
      },

      removeGeneratorSet(generatorSetIntKey) {
        set(
          (state) => ({
            generatorSetsAdded: state.generatorSetsAdded.filter(
              (generatorSet) => generatorSet.sIntKey !== generatorSetIntKey
            ),
          }),
          null,
          ACTIONS.REMOVE_GENERATOR_SET
        );
      },

      updateQuantity(generatorSetIntKey, quantity) {
        set(
          (state) => ({
            generatorSetsAdded: state.generatorSetsAdded.map((generatorSet) => {
              if (generatorSet.sIntKey === generatorSetIntKey) {
                return { ...generatorSet, nIntCantidad: quantity };
              }
              return generatorSet;
            }),
          }),
          null,
          ACTIONS.UPDATE_GENERATOR_SET_QUANTITY
        );
      },

      clearGeneratorSetsAdded() {
        set(initialState, null, ACTIONS.CLEAR_DETAILS);
      },
    }),
    {
      name: STORE_NAME,
    }
  )
);
