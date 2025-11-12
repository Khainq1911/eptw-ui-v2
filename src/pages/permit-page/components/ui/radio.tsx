import { Col, Radio, Row } from "antd";
import React, { useState } from "react";

function RadioField({ field, section, dispatch }: any) {
  const [touched, setTouched] = useState(false);

  const showError =
    touched &&
    field.required &&
    (field.value === undefined || field.value === null);

  const errorMsg = showError ? "Vui lòng chọn một tùy chọn" : "";

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
            onChange={(e) =>
              dispatch({
                type: "SET_FIELD_VALUE",
                payload: { section, field, value: e.target.value },
              })
            }
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
