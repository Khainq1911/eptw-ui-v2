import { upperCase } from "lodash";
import type { props } from "./single-input";
import { Input } from "antd";

export default function HeadingField({ field }: props) {
  return (
    <div>
       <div className="mb-2 text-base font-semibold text-gray-700">
        {upperCase(field.type) || "Tiêu đề"}
      </div>
      <Input placeholder="Nhập tiêu đề" disabled />
    </div>
  );
}
