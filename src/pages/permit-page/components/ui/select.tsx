import { Col, Row, Select } from "antd";
import { debounce } from "lodash";
import React, { useState, useMemo, useCallback, useEffect } from "react";

function SelectField({ section, field, dispatch, isDisable }: any) {
  const [touched, setTouched] = useState(false);

  // local value
  const [localValue, setLocalValue] = useState<any>(field.value || undefined);

  // đồng bộ khi field.value thay đổi (khi load form từ API)
  useEffect(() => {
    setLocalValue(field.value || undefined);
  }, [field.value]);

  // debounce dispatch 100ms
  const debouncedDispatch = useMemo(
    () =>
      debounce((value: any) => {
        dispatch({
          type: "SET_FIELD_VALUE",
          payload: { section, field, value },
        });
      }, 100),
    [dispatch, field, section]
  );

  const handleChange = useCallback(
    (value: any) => {
      setLocalValue(value);       // update UI ngay
      debouncedDispatch(value);   // update form state sau 100ms
    },
    [debouncedDispatch]
  );

  const showError =
    touched && field.required && (localValue === undefined || localValue === null || localValue === "");

  return (
    <Row gutter={16} className="mb-2">
      <Col span={8}>
        <label className="font-medium mb-2">
          {field.label}{" "}
          {field.required && <span style={{ color: "red" }}>*</span>}:
        </label>
      </Col>

      <Col span={16}>
        <Select
          disabled={isDisable}
          placeholder="Chọn một mục"
          value={localValue}
          onChange={handleChange}
          onBlur={() => setTouched(true)}
          allowClear
          style={{ width: "100%" }}
          options={field.options?.map((opt: string) => ({
            label: opt,
            value: opt,
          }))}
        />

        {showError && (
          <div style={{ color: "red", marginTop: 4 }}>
            Vui lòng chọn một mục
          </div>
        )}
      </Col>
    </Row>
  );
}

export default React.memo(SelectField);
