export const updatePermitInitState = [];
export const updatePermitReducer = (state: any, action: any) => {
  switch (action.type) {
    case "SET_INIT_DATA": {
      return action.payload;
    }
    case "SET_FIELD_VALUE": {
      const {
        section: updatedSection,
        field: updatedField,
        value,
      } = action.payload;
      return state?.map((section: any) => {
        if (section.id !== updatedSection.id) return section;
        return {
          ...section,
          fields: section.fields.map((field: any) => {
            if (field.id !== updatedField.id) return field;
            return { ...field, value };
          }),
        };
      });
    }
    default: {
      return state;
    }
  }
};

export const attachmentFileInitData = [];

export const attachmentFileReducer = (state: any, action: any) => {
  switch (action.type) {
    case "SET_INIT_DATA": {
      return action.payload;
    }
    case "REMOVE_ATTACHMENT": {
      return state.filter(
        (attachment: any) => attachment.id !== action.payload.uid
      );
    }
    case "ADD_ATTACHMENTS": {
      return [...(state || []), action.payload];
    }
    default: {
      return state;
    }
  }
};
