const fieldTemplates = [
  {
    id: "field-text",
    name: "Text Input",
    type: "input",
    icon: "📝",
    label: "Nhập văn bản",
  },
  {
    id: "field-checkbox",
    name: "Checkbox",
    type: "checkbox",
    icon: "☑️",
    label: "Lựa chọn",
  },
  {
    id: "field-textarea",
    name: "Textarea",
    type: "textarea",
    icon: "📄",
    label: "Nhập mô tả",
  },
  {
    id: "field-date",
    name: "Date",
    type: "date",
    icon: "📅",
    label: "Chọn ngày",
  },
  {
    id: "field-select",
    name: "Select",
    type: "select",
    icon: "🔽",
    label: "Chọn mục",
  },
  {
    id: "field-heading",
    name: "Heading",
    type: "heading",
    icon: "🔠",
    label: "Tiêu đề",
  },
  {
    id: "field-paragraph",
    name: "Paragraph",
    type: "paragraph",
    icon: "✏️",
    label: "Đoạn văn mô tả",
  },
];

export default function SidebarModal() {
  return (
    <aside className="w-80 bg-slate-100 border-r border-slate-200 overflow-y-scroll p-6 h-full">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-900 mb-2">
          Permit to Work
        </h1>
        <p className="text-sm text-slate-600">
          Kéo các trường vào phần để thêm
        </p>
      </div>

      <div className="space-y-4">
        <div>
          <h2 className="text-sm font-semibold text-slate-900 mb-3 uppercase tracking-wide">
            Các trường có sẵn
          </h2>
          <div className="space-y-3">
            {fieldTemplates.map((template) => (
              <div className="p-4 bg-white border border-slate-200 rounded-lg cursor-move hover:shadow-md hover:border-blue-400 transition-all duration-200 active:opacity-50">
                <div className="flex items-center gap-3">
                  <span className="text-2xl flex-shrink-0">
                    {template.icon}
                  </span>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-slate-900 text-sm">
                      {template.name}
                    </p>
                    <p className="text-xs text-slate-600">{template.label}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-8 pt-6 border-t border-slate-200">
          <h3 className="text-sm font-semibold text-slate-900 mb-3">
            Hướng dẫn
          </h3>
          <div className="space-y-2 text-xs text-slate-600">
            <p>1. Chọn một trường từ danh sách</p>
            <p>2. Kéo nó vào phần bên phải</p>
            <p>3. Thả để thêm trường vào phần</p>
          </div>
        </div>
      </div>
    </aside>
  );
}
