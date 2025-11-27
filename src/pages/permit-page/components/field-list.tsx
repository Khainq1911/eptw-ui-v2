import InputField from "./ui/input";
import DateField from "./ui/date";
import CheckboxField from "./ui/checkbox";
import RadioField from "./ui/radio";
import HeadingField from "./ui/heading";
import TextAreaField from "./ui/textarea";
import ParagraphField from "./ui/paragraph";
import type { Field, Section } from "@/pages/template-page/template-type";
import React from "react";

export const handleRender = (
  section: Section,
  field: Field,
  dispatch: any,
  isDisable?: boolean
) => {
  switch (field.type) {
    case "input":
      return <InputField section={section} field={field} dispatch={dispatch} isDisable={isDisable}/>;
    case "date":
      return <DateField section={section} field={field} dispatch={dispatch} isDisable={isDisable}/>;
    case "checkbox":
      return (
        <CheckboxField section={section} field={field} dispatch={dispatch} isDisable={isDisable}/>
      );
    case "radio":
      return <RadioField section={section} field={field} dispatch={dispatch} isDisable={isDisable}/>;
    case "heading":
      return (
        <HeadingField section={section} field={field} dispatch={dispatch} isDisable={isDisable}/>
      );
    case "paragraph":
      return (
        <ParagraphField section={section} field={field} dispatch={dispatch} isDisable={isDisable}/>
      );
    case "textarea":
      return (
        <TextAreaField section={section} field={field} dispatch={dispatch} isDisable={isDisable}/>
      );
    default:
      return;
  }
};
const FieldsList = React.memo(({ section, dispatch }: any) => {
  return (
    <>
      {section.fields.map((field: any) => (
        <div key={field.id}>{handleRender(section, field, dispatch)}</div>
      ))}
    </>
  );
});

export default FieldsList;
