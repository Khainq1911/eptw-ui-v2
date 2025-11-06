import React from "react";
import type { Section, Template } from "../../template-type";

const initialState = {
  name: "",
  description: "",
  sections: [],
};

const reducer = (state: Template, action: any) => {
  switch (action.type) {
    case "SET_DATA": {
      return {
        ...state,
        ...action.payload,
      };
    }
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
    case "ADD_FIELD":
      return {
        ...state,
        sections: state.sections.map((s) =>
          s.id === action.payload.section.id
            ? {
                ...s,
                fields: [
                  ...s.fields,
                  {
                    ...action.payload.data,
                    id: s.fields.length + 1,
                  },
                ],
              }
            : s
        ),
      };
    case "DELETE_FIELD":
      return {
        ...state,
        sections: state.sections.map((s) =>
          s.id === action.payload.section.id
            ? {
                ...s,
                fields: s.fields
                  .filter((f) => f.id !== action.payload.field.id)
                  .map((f, index) => ({ ...f, id: index + 1 })),
              }
            : s
        ),
      };
    case "UPDATE_FIELD": {
      const { section, field, ...data } = action.payload;
      return {
        ...state,
        sections: state.sections.map((s) =>
          s.id === section.id
            ? {
                ...s,
                fields: s.fields.map((f) =>
                  f.id === field.id ? { ...f, ...data } : f
                ),
              }
            : s
        ),
      };
    }
    case "REORDER_SECTIONS":
      return {
        ...state,
        sections: action.payload,
      };

    case "SET_SIGN": {
      const { section, data, fieldName } = action.payload;
      return {
        ...state,
        sections: state.sections.map((s) =>
          s.id === section.id
            ? {
                ...s,
                sign: {
                  [fieldName]: data,
                  roleIdAllowed: data ? null : section.sign.roleIdAllowed,
                },
              }
            : s
        ),
      };
    }

    case "SET_ROLES": {
      const { section, data } = action.payload;
      return {
        ...state,
        sections: state.sections.map((s) =>
          s.id === section.id
            ? {
                ...s,
                sign: {
                  ...s.sign,
                  roleIdAllowed: data,
                },
              }
            : s
        ),
      };
    }

    case "RESET_STATE":
      return initialState;

    default:
      return state;
  }
};

export const useCreateTemplate = () => {
  const [state, dispatch] = React.useReducer(reducer, initialState);

  return { state, dispatch };
};
