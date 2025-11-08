import { upperCase } from "lodash";
import type { props } from "./single-input";
import { Input } from "antd";

export default function ParagraphField({ field }: props) {
  return (
    <div className="mb-4">
      <div className="mb-2 text-base font-semibold text-gray-700">
        {upperCase(field.type) || "Tiêu đề"}
      </div>
      <Input.TextArea placeholder="Nhập đoạn văn" disabled />
    </div>
  );
}
