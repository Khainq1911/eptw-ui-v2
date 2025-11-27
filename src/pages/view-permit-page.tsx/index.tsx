import PermitComponent from "@/components/permit/permitComponent";
import { useViewPermitService } from "./service";

export default function ViewPermit() {
  const { state, dispatch, fileDispatch, fileState } = useViewPermitService();
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
