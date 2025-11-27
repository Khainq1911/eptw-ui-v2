import { useReducer } from "react";
import {
  attachmentFileInitData,
  attachmentFileReducer,
  updatePermitInitState,
  updatePermitReducer,
} from "./reducer";

export const useUpdatePermitService = () => {
  const [state, dispatch] = useReducer(
    updatePermitReducer,
    updatePermitInitState
  );

  const [fileState, fileDispatch] = useReducer(
    attachmentFileReducer,
    attachmentFileInitData
  );

  return {
    state,
    fileState,
    fileDispatch,
    dispatch,
  };
};
