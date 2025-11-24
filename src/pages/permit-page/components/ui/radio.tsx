import { Col, Radio, Row } from "antd";
import { debounce } from "lodash";
import React, { useState, useCallback, useMemo } from "react";


function RadioField({ field, section, dispatch }: any) {
  const [touched, setTouched] = useState(false);

  const showError =
    touched &&
    field.required &&
    (field.value === undefined || field.value === null);

  const errorMsg = showError ? "Vui lòng chọn một tùy chọn" : "";

  // debounce 300ms
  const debouncedDispatch = useMemo(
    () =>
      debounce((value) => {
        dispatch({
          type: "SET_FIELD_VALUE",
          payload: { section, field, value },
        });
      }, 300),
    [dispatch, field, section]
  );

  const handleChange = useCallback(
    (e: any) => {
      debouncedDispatch(e.target.value);
    },
    [debouncedDispatch]
  );

  return (
    <Row gutter={16} className="mb-2">
      <Col span={8}>
        <label className="font-medium mb-2">
          {field.label}{" "}
          {field.required && <span style={{ color: "red" }}>*</span>}:
        </label>
      </Col>

      <Col span={16}>
        <div>
          <Radio.Group
            options={field.options}
            value={field.value}
            onChange={handleChange}
            onBlur={() => setTouched(true)}
            style={{
              display: "flex",
              flexDirection: "column",
              gap: 4,
            }}
          />
        </div>

        {errorMsg && (
          <div style={{ color: "red", marginTop: 4 }}>{errorMsg}</div>
        )}
      </Col>
    </Row>
  );
}

export default React.memo(RadioField);
