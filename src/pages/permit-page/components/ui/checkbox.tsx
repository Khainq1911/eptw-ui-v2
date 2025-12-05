import { Checkbox, Col, Row } from "antd";
import { debounce } from "lodash";
import React, { useState, useMemo, useCallback, useEffect } from "react";

function CheckboxField({ section, field, dispatch, isDisable }: any) {
  const [touched, setTouched] = useState(false);

  // local value
  const [localValue, setLocalValue] = useState<any[]>(field.value || []);

  // đồng bộ khi field.value thay đổi (khi load form từ API)
  useEffect(() => {
    setLocalValue(field.value || []);
  }, [field.value]);

  // debounce dispatch 100ms
  const debouncedDispatch = useMemo(
    () =>
      debounce((value: any[]) => {
        dispatch({
          type: "SET_FIELD_VALUE",
          payload: { section, field, value },
        });
      }, 100),
    [dispatch, field, section]
  );

  const handleChange = useCallback(
    (value: any[]) => {
      setLocalValue(value);      // update UI ngay
      debouncedDispatch(value);  // update form state sau 100ms
    },
    [debouncedDispatch]
  );

  const showError =
    touched && field.required && (!localValue || localValue.length === 0);

  return (
    <Row gutter={16} className="mb-2">
      <Col span={8}>
        <label className="font-medium mb-2">
          {field.label}{" "}
          {field.required && <span style={{ color: "red" }}>*</span>}:
        </label>
      </Col>

      <Col span={16}>
        <div onBlur={() => setTouched(true)} tabIndex={0}>
          <Checkbox.Group
            disabled={isDisable}
            options={field.options}
            value={localValue}
            onChange={handleChange}
            style={{ display: "flex", flexDirection: "column", gap: 4 }}
          />
        </div>

        {showError && (
            <div style={{ color: "red", marginTop: 4 }}>
              Vui lòng chọn ít nhất một mục
            </div>
        )}
      </Col>
    </Row>
  );
}

export default React.memo(CheckboxField);
