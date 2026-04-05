import { Col, Input, Row } from "antd";
import { debounce } from "lodash";
import React, { useMemo, useState } from "react";

function InputField({ field, section, dispatch, isDisable }: any) {
  const [error, setError] = useState("");
  const [localValue, setLocalValue] = useState(field.value || "");

  // Đồng bộ localValue khi field.value thay đổi (ví dụ khi load dữ liệu mới)
  React.useEffect(() => {
    setLocalValue(field.value || "");
  }, [field.value]);

  const debouncedDispatch = useMemo(
    () =>
      debounce(
        (val) =>
          dispatch({
            type: "SET_FIELD_VALUE",
            payload: { section, field, value: val },
          }),
        300
      ),
    [dispatch, section.id, field.id]
  );

  const handleChange = (value: string) => {
    setLocalValue(value);
    if (error) setError("");
    debouncedDispatch(value);
  };

  const handleBlur = () => {
    if (field.required && (!localValue || localValue === "")) {
      setError("Trường này là bắt buộc");
    }
  };

  return (
    <Row gutter={[16, 4]} className="mb-4">
      <Col xs={24} sm={8}>
        <label className="font-medium mb-1 inline-block text-gray-700">
          {field.label}{" "}
          {field.required && <span className="text-red-500">*</span>}:
        </label>
      </Col>
      <Col xs={24} sm={16}>
        <Input
          disabled={isDisable}
          placeholder="Nhập nội dung..."
          value={localValue}
          onChange={(e) => handleChange(e.target.value)}
          onBlur={handleBlur}
          className={`transition-all duration-300 rounded-lg hover:border-blue-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 ${
            error ? "border-red-500 shadow-[0_0_0_2px_rgba(239,68,68,0.1)]" : "border-gray-200"
          }`}
          style={{ height: '38px' }}
        />
        {error && <div className="text-red-500 text-xs mt-1 animate-in fade-in slide-in-from-top-1">{error}</div>}
      </Col>
    </Row>
  );
}

export default React.memo(InputField);
