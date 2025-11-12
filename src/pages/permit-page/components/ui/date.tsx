import { Col, DatePicker, Row } from "antd";
import dayjs from "dayjs";
import React, { useState } from "react";

function DateField({ field, section, dispatch }: any) {
  const [touched, setTouched] = useState(false);

  const showError = touched && field.required && !field.value;
  const errorMsg = showError ? "Vui lòng chọn ngày" : "";

  return (
    <Row gutter={16} className="mb-2">
      <Col span={8}>
        <label className="font-medium mb-2">
          {field.label}{" "}
          {field.required && <span style={{ color: "red" }}>*</span>}:
        </label>
      </Col>
      <Col span={16}>
        <DatePicker
          value={field.value ? dayjs(field.value) : null}
          onChange={(value) => {
            dispatch({
              type: "SET_FIELD_VALUE",
              payload: { section, field, value },
            });
          }}
          onBlur={() => setTouched(true)}
          placeholder="Chọn ngày"
          style={{
            width: "100%",
            borderColor: showError ? "red" : undefined,
            boxShadow: showError ? "0 0 6px rgba(255, 0, 0, 0.5)" : undefined,
            borderRadius: 6,
            transition: "all 0.2s ease",
          }}
        />
        {errorMsg && (
          <div style={{ color: "red", marginTop: 4 }}>{errorMsg}</div>
        )}
      </Col>
    </Row>
  );
}

export default React.memo(DateField);
