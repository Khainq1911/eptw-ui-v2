import React, { useState } from "react";
import { DndContext, closestCenter, type DragEndEvent } from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

// ====== Kiểu dữ liệu ======
interface Field {
  label: string;
  type: "input" | "textarea" | "date";
  required: boolean;
}

interface Signer {
  role: string;
  roleId: number;
}

interface Section {
  sectionName: string;
  fields: Field[];
  signers?: Signer[];
}

// ====== Component item kéo thả ======
const SortableItem = ({
  id,
  children,
}: {
  id: string;
  children: React.ReactNode;
}) => {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id });
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };
  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
      {children}
    </div>
  );
};

// ====== Component chính ======
export default function DashboardPage() {
  const [sections, setSections] = useState<Section[]>([
    {
      sectionName: "Thông tin yêu cầu",
      fields: [
        { label: "Họ và tên người yêu cầu", type: "input", required: true },
        { label: "Ngày yêu cầu", type: "date", required: true },
      ],
    },
    {
      sectionName: "Thông tin bảo trì",
      fields: [
        { label: "Khu vực bảo trì", type: "input", required: true },
        { label: "Mô tả công việc", type: "textarea", required: true },
      ],
      signers: [
        { role: "Người thực hiện", roleId: 1 },
        { role: "Giám sát an toàn", roleId: 2 },
      ],
    },
  ]);

  // ====== Xử lý reorder khi kéo thả xong ======
  const handleDragEnd = (event: DragEndEvent, sectionIndex: number) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    setSections((prev) => {
      const updated = [...prev];
      const items = updated[sectionIndex].fields;
      const oldIndex = items.findIndex((f) => f.label === active.id);
      const newIndex = items.findIndex((f) => f.label === over.id);
      updated[sectionIndex].fields = arrayMove(items, oldIndex, newIndex);
      return updated;
    });
  };

  // ====== Thêm section mới ======
  const addSection = () => {
    setSections((prev) => [
      ...prev,
      { sectionName: `Section mới ${prev.length + 1}`, fields: [] },
    ]);
  };

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold mb-4">🧱 Form Builder (Kéo-thả)</h1>

      {sections.map((section, sectionIndex) => (
        <div
          key={section.sectionName}
          className="border rounded-2xl p-4 shadow-sm bg-white"
        >
          <h2 className="font-semibold text-lg mb-2">{section.sectionName}</h2>

          <DndContext
            collisionDetection={closestCenter}
            onDragEnd={(e) => handleDragEnd(e, sectionIndex)}
          >
            <SortableContext
              items={section.fields.map((f) => f.label)}
              strategy={verticalListSortingStrategy}
            >
              {section.fields.map((field) => (
                <SortableItem key={field.label} id={field.label}>
                  <div className="border border-dashed p-3 mb-2 rounded-md bg-gray-50 cursor-grab hover:bg-gray-100">
                    <div className="text-sm font-medium">{field.label}</div>
                    <div className="text-xs text-gray-500">
                      Loại: {field.type} —{" "}
                      {field.required ? "Bắt buộc" : "Tùy chọn"}
                    </div>
                  </div>
                </SortableItem>
              ))}
            </SortableContext>
          </DndContext>

          {section.signers && (
            <div className="mt-3 border-t pt-2">
              <h3 className="text-sm font-semibold">Người ký:</h3>
              {section.signers.map((s) => (
                <div key={s.roleId} className="text-sm text-gray-600">
                  • {s.role} (ID: {s.roleId})
                </div>
              ))}
            </div>
          )}
        </div>
      ))}

      <button
        onClick={addSection}
        className="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700"
      >
        + Thêm Section
      </button>
    </div>
  );
}
