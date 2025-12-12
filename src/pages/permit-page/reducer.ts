import type { Field, Section } from "../template-page/template-type";

export const initialState = {};

export const reducer = (state: any, action: any) => {
  switch (action.type) {
    case "SET_DATA": {
      return {
        ...state,
        ...action.payload,
      };
    }
    case "SET_FIELD_VALUE": {
      const {
        section: updatedSection,
        field: updatedField,
        value,
      } = action.payload;

      const sections = state.sections.map((section: Section) => {
        if (section.id !== updatedSection.id) return section;

        return {
          ...section,
          fields: section.fields.map((field: Field) => {
            if (field.id !== updatedField.id) return field;
            return { ...field, value };
          }),
        };
      });

      return { ...state, sections };
    }
    case "SET_SIGNER": {
      return {
        ...state,
        sections: state.sections.map((section: any) => {
          if (section.id === action.payload.section.id) {
            return {
              ...section,
              sign: { ...section.sign, signId: action.payload.value },
            };
          }
          return section;
        }),
      };
    }
    case "SET_FIELD_ERROR":
      return {
        ...state,
        errors: {
          ...state.errors,
          [`${action.payload.section.id}_${action.payload.field.id}`]:
            action.payload.error,
        },
      };
    case "ADD_ATTACHMENTS":
      return {
        ...state,
        attachments: [...(state?.attachments || []), action.payload],
      };
    case "REMOVE_ATTACHMENT": {
      return {
        ...state,
        attachments: state.attachments.filter(
          (item: any) => item.uid !== action.payload.uid
        ),
      };
    }

    case "RESET_STATE":
      return initialState;

    default:
      return state;
  }
};
