import { Checkbox, Col, Row } from "antd";
import React, { useState } from "react";

function CheckboxField({ section, field, dispatch }: any) {
  const [touched, setTouched] = useState(false);

  const handleChange = (value: any[]) => {
    dispatch({
      type: "SET_FIELD_VALUE",
      payload: { section, field, value },
    });
  };

  const showError =
    touched && field.required && (!field.value || field.value.length === 0);

  const errorMsg = showError ? "Vui lòng chọn ít nhất một mục" : "";

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
            options={field.options}
            value={field.value || []}
            onChange={handleChange}
            style={{ display: "flex", flexDirection: "column", gap: 4 }}
          />
        </div>

        {errorMsg && (
          <div style={{ color: "red", marginTop: 4 }}>{errorMsg}</div>
        )}
      </Col>
    </Row>
  );
}
export default React.memo(CheckboxField);
