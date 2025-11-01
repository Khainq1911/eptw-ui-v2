import React from "react";
import type { Section, Template, TemplateType } from "../../template.type";

const initialState = {
  name: "Biểu mẫu yêu cầu bảo trì",
  description: "Form dùng để ghi nhận thông tin yêu cầu bảo trì thiết bị.",
  sections: [
    {
      name: "Thông tin yêu cầu",
      fields: [
        {
          label: "Họ và tên người yêu cầu",
          type: "input",
          required: true,
          order: 1,
        },
        {
          label: "Họ và tên người yêu cầu",
          type: "input",
          required: true,
          order: 2,
        },
        { label: "Đơn vị", type: "input", required: true, order: 3 },
        { label: "Ngày yêu cầu", type: "date", required: true, order: 4 },
        {
          label: "Mức độ ưu tiên",
          type: "textarea",
          required: false,
          order: 5,
        },
      ],
      sequence: 1,
    },
  ],
};

const reducer = (state: Template, action: TemplateType) => {
  switch (action.type) {
    case "ADD_SECTION":
      return {
        ...state,
        sections: [...state.sections, action.payload],
      };
    case "DELETE_SECTION": {
      const filtered = state.sections
        .filter((section: Section) => section.sequence !== action.payload)
        .map((section: Section, index: number) => ({
          ...section,
          sequence: index + 1,
        }));

      return { ...state, sections: filtered };
    }
    case "UPDATE_SECTION": {
      return {
        ...state,
        sections: state.sections.map((section: Section) =>
          section.sequence === action.payload.sequence
            ? { ...section, ...action.payload }
            : section
        ),
      };
    }
    default:
      return state;
  }
};

export const useCreateTemplate = () => {
  const [state, dispatch] = React.useReducer(reducer, initialState);

  return { state, dispatch };
};
