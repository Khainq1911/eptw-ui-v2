import { upperCase, debounce } from "lodash";
import type { props } from "./single-input";
import { Input } from "antd";
import { useCallback } from "react";

export default function ParagraphField({
  field,
  handleUpdateField,
  section,
  isPreview,
}: props) {
  const debouncedUpdateLabel = useCallback(
    debounce((value: string) => {
      handleUpdateField({ target: { value } }, section, field, "label");
    }, 100),
    [handleUpdateField, section, field]
  );

  if (isPreview) {
    return <p className="text-gray-600 mb-4">{field.label || "Đoạn văn"}</p>;
  }

  return (
    <div className="mb-4">
      <div className="mb-2 text-base font-semibold text-gray-700">
        {upperCase(field.type) || "Tiêu đề"}
      </div>
      <Input.TextArea
        placeholder="Nhập nội dung đoạn văn"
        defaultValue={field.label}
        onChange={(e) => debouncedUpdateLabel(e.target.value)}
      />
    </div>
  );
}
