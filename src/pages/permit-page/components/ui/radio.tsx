import { Col, Radio, Row } from "antd";
import { debounce } from "lodash";
import React, { useState, useCallback, useMemo, useEffect } from "react";

function RadioField({ field, section, dispatch, isDisable }: any) {
  const [touched, setTouched] = useState(false);

  // Local state để UI update ngay
  const [localValue, setLocalValue] = useState(field.value ?? null);

  // Đồng bộ khi field.value thay đổi (ví dụ load từ API)
  useEffect(() => {
    setLocalValue(field.value ?? null);
  }, [field.value]);

  const debouncedDispatch = useMemo(
    () =>
      debounce((value) => {
        dispatch({
          type: "SET_FIELD_VALUE",
          payload: { section, field, value },
        });
      }, 200),
    [dispatch, field, section]
  );

  const handleChange = useCallback(
    (e: any) => {
      const value = e.target.value;

      setLocalValue(value); // update UI tức thời
      debouncedDispatch(value); // gửi lên parent sau 200ms
    },
    [debouncedDispatch]
  );

  const showError =
    touched &&
    field.required &&
    (localValue === null || localValue === undefined);

  return (
    <Row gutter={16} className="mb-2">
      <Col span={8}>
        <label className="font-medium mb-2">
          {field.label}{" "}
          {field.required && <span style={{ color: "red" }}>*</span>}:
        </label>
      </Col>

      <Col span={16}>
        <Radio.Group
          disabled={isDisable}
          options={field.options}
          value={localValue}
          onChange={handleChange}
          onBlur={() => setTouched(true)}
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 4,
          }}
        />

        {showError && (
          <div style={{ color: "red", marginTop: 4 }}>
            Vui lòng chọn một tùy chọn
          </div>
        )}
      </Col>
    </Row>
  );
}

export default React.memo(RadioField);
