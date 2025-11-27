import { Input } from "antd";
import { debounce } from "lodash";
import React, { useMemo, useState } from "react";

function ParagraphField({ field, section, dispatch, isDisable }: any) {
  const [localValue, setLocalValue] = useState(field.value || "");

  // Debounced dispatch to update reducer
  const debouncedDispatch = useMemo(
    () =>
      debounce(
        (val) =>
          dispatch({
            type: "SET_FIELD_VALUE",
            payload: { section, field, value: val },
          }),
        100
      ),
    [dispatch, section.id, field.id]
  );

  const handleChange = (value: string) => {
    setLocalValue(value);
    debouncedDispatch(value);
  };

  return (
    <Input.TextArea
      disabled={isDisable}
      placeholder="Nhập đoạn văn"
      value={localValue}
      onChange={(e) => handleChange(e.target.value)}
      rows={4}
    />
  );
}

export default React.memo(ParagraphField);
