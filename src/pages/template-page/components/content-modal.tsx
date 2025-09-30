import { Flex, Segmented } from "antd";
import { useState } from "react";

export default function ContentModal() {
  const [mode, setMode] = useState("list");

  return (
    <div className="h-full flex flex-col p-4">
      {/* Thanh chọn chế độ */}
      <Flex justify="center">
        <Segmented
          options={[
            { label: "Danh sách thẻ", value: "list" },
            { label: "Xem trước", value: "preview" },
          ]}
          width={200}
          value={mode}
          onChange={(val) => setMode(val as string)}
          size="middle"
          className="!bg-gray-100 !rounded-lg [&_.ant-segmented-item-selected]:!bg-blue-500 [&_.ant-segmented-item-selected]:!text-white"
        />
      </Flex>

      {/* Nội dung chính */}
      <div className="mt-4 flex-1 overflow-y-auto">
        {mode === "list" ? (
          <div className="bg-white border rounded p-4 shadow-sm">
            <h3 className="font-semibold mb-2">Danh sách thẻ</h3>
            <p>Hiển thị Collapse / danh sách item ở đây...</p>
          </div>
        ) : (
          <div className="bg-gray-50 border rounded p-4 shadow-sm">
            <h3 className="font-semibold mb-2">Preview</h3>
            <p>Hiển thị nội dung preview ở đây...</p>
          </div>
        )}
      </div>
    </div>
  );
}
