import { upperCase, debounce } from "lodash";
import type { props } from "./single-input";
import { Input } from "antd";
import { useCallback } from "react";

export default function HeadingField({
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
    return (
      <h3 className="text-lg font-bold text-gray-800 mb-2">
        {field.label || "Tiêu đề"}
      </h3>
    );
  }

  return (
    <div>
      <div className="mb-2 text-base font-semibold text-gray-700">
        {upperCase(field.type) || "Tiêu đề"}
      </div>
      <Input
        placeholder="Nhập tiêu đề"
        defaultValue={field.label}
        onChange={(e) => debouncedUpdateLabel(e.target.value)}
      />
    </div>
  );
}
