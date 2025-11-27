import { useReducer } from "react";
import {
  attachmentFileInitData,
  attachmentFileReducer,
  updatePermitInitState,
  updatePermitReducer,
} from "../update-permit-page.tsx/reducer";

export const useViewPermitService = () => {
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
