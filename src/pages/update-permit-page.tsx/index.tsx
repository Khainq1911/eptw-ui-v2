import PermitComponent from "@/components/permit/permitComponent";
import { useUpdatePermitService } from "./service";

export default function UpdatePermit() {
  const { state, dispatch, fileDispatch, fileState } = useUpdatePermitService();

  return (
    <div>
      <PermitComponent
        state={state}
        dispatch={dispatch}
        fileState={fileState}
        fileDispatch={fileDispatch}
      />
    </div>
  );
}
