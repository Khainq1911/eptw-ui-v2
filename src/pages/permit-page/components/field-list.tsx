import InputField from "./ui/input";
import DateField from "./ui/date";
import CheckboxField from "./ui/checkbox";
import RadioField from "./ui/radio";
import HeadingField from "./ui/heading";
import TextAreaField from "./ui/textarea";
import ParagraphField from "./ui/paragraph";
import type { Field, Section } from "@/pages/template-page/template-type";
import React from "react";

const handleRender = (section: Section, field: Field, dispatch: any) => {
  switch (field.type) {
    case "input":
      return <InputField section={section} field={field} dispatch={dispatch} />;
    case "date":
      return <DateField section={section} field={field} dispatch={dispatch} />;
    case "checkbox":
      return (
        <CheckboxField section={section} field={field} dispatch={dispatch} />
      );
    case "radio":
      return <RadioField section={section} field={field} dispatch={dispatch} />;
    case "heading":
      return (
        <HeadingField section={section} field={field} dispatch={dispatch} />
      );
    case "paragraph":
      return (
        <ParagraphField section={section} field={field} dispatch={dispatch} />
      );
    case "textarea":
      return (
        <TextAreaField section={section} field={field} dispatch={dispatch} />
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
