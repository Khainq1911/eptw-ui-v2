export interface Field {
  label: string;
  type: "input" | "date" | "textarea" | "select" | "checkbox" | string;
  required: boolean;
  order: number;
}

export interface Section {
  name: string;
  description?: string;
  fields: Field[];
  sequence: number;
}

export interface Template {
  name: string;
  description: string;
  sections: Section[];
}

export type TemplateType =
  | { type: "ADD_SECTION"; payload: Section }
  | { type: "DELETE_SECTION"; payload: number } 
  | { type: "UPDATE_SECTION"; payload: Section };

export type ChangedValues = Record<string, string | number | boolean | null>;