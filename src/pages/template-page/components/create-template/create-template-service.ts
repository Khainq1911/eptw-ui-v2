import React from "react";
import type { Section, Template } from "../../template.type";

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
          id: 1,
        },
        {
          label: "Họ và tên người yêu cầu",
          type: "input",
          required: true,
          id: 2,
        },
        { label: "Đơn vị", type: "input", required: true, id: 3 },
        { label: "Ngày yêu cầu", type: "date", required: true, id: 4 },
        {
          label: "Mức độ ưu tiên",
          type: "textarea",
          required: false,
          id: 5,
        },
      ],
      id: 1,
    },
  ],
};

const reducer = (state: Template, action: any) => {
  switch (action.type) {
    case "ADD_SECTION":
      return {
        ...state,
        sections: [...state.sections, action.payload],
      };
    case "DELETE_SECTION": {
      const filtered = state.sections
        .filter((section: Section) => section.id !== action.payload)
        .map((section: Section, index: number) => ({
          ...section,
          id: index + 1,
        }));

      return { ...state, sections: filtered };
    }
    case "UPDATE_SECTION": {
      const { section, ...data } = action.payload;
      return {
        ...state,
        sections: state.sections.map((item: Section) =>
          item.id === section.id ? { ...item, ...data } : item
        ),
      };
    }
    case "REORDER_FIELDS":
      return {
        ...state,
        sections: state.sections.map((s) =>
          s.id === action.payload.sectionId
            ? { ...s, fields: action.payload.fields }
            : s
        ),
      };

    case "REORDER_SECTIONS":
      return {
        ...state,
        sections: action.payload,
      };

    default:
      return state;
  }
};

export const useCreateTemplate = () => {
  const [state, dispatch] = React.useReducer(reducer, initialState);

  return { state, dispatch };
};
