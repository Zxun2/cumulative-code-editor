import produce from "immer";
import { ActionType } from "../action-types";
import { Action } from "../actions";

interface BundlesState {
  [key: string]: {
    loading: boolean;
    code: string;
    err: string;
  };
}

const initialState: BundlesState = {};

const reducer = produce((state: BundlesState, action: Action): BundlesState => {
  switch (action.type) {
    case ActionType.BUNDLE_START:
      // Discard previous bundled code on new code execution
      state[action.payload.cellId] = {
        loading: true,
        code: "",
        err: "",
      };
      return state;
    case ActionType.BUNDLE_COMPLETE:
      state[action.payload.cellId] = {
        loading: true,
        code: action.payload.bundle.code,
        err: action.payload.bundle.err,
      };
      return state;
    default:
      return state;
  }
}, initialState);

export default reducer;
