import { Col, Input, Row } from "antd";
import { debounce } from "lodash";
import React, { useMemo, useState } from "react";

function HeadingField({ section, field, dispatch }: any) {
  const [localValue, setLocalValue] = useState(field.value || "");

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
    <Row gutter={16}>
      <Col span={24}>
        <Input
          placeholder="Nhập tiêu đề"
          value={localValue}
          onChange={(e) => handleChange(e.target.value)}
        />
      </Col>
    </Row>
  );
}

export default React.memo(HeadingField);
