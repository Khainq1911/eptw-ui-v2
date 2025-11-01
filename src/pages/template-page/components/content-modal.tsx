import { DeleteFilled, PlusOutlined } from "@ant-design/icons";
import { Button, Form, Input, type FormInstance } from "antd";
import { debounce } from "lodash";
import { useEffect, type JSX } from "react";
import type { ChangedValues, Field, Section, Template, TemplateType } from "../template.type";

interface props {
  state: Template;
  dispatch: React.Dispatch<TemplateType>;
  form: FormInstance;
  handleRenderField: (
    type: string,
    index: number,
    sequence: number
  ) => JSX.Element | null;
}

export default function ContentModal({
  state,
  dispatch,
  form,
  handleRenderField,
}: props) {
  useEffect(() => {
    console.log(state);
  }, [state]);

  const handleValuesChange = debounce((changedValues: ChangedValues) => {
    const key = Object.keys(changedValues)[0];
    const newValue = changedValues[key];
    const fieldName = key.split("_")[1];
    const sectionIndex = parseInt(key.split("_")[2], 10);

    dispatch({
      type: "UPDATE_SECTION",
      payload: {
        ...state.sections[sectionIndex],
        [fieldName]: newValue,
      },
    });
  }, 300);

  return (
    <main className="flex-1 overflow-y-auto p-8 bg-slate-50 h-full">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-slate-900 mb-2">
            Permit to Work
          </h1>
          <p className="text-slate-600">
            Quản lý và theo dõi các yêu cầu bảo trì an toàn
          </p>
        </div>

        <Form
          form={form}
          className="space-y-6 !mb-8"
          layout="vertical"
          onValuesChange={handleValuesChange}
        >
          {state.sections.map((section: Section, index: number) => (
            <div
              key={section.sequence}
              className="w-full bg-white rounded-lg shadow-sm p-6 border border-gray-200"
            >
              <div className="flex justify-between !items-start gap-10 mb-4">
                <Form.Item
                  name={`section_name_${index}`}
                  label="Tên nhóm thông tin:"
                  initialValue={section.name}
                  rules={[
                    {
                      required: true,
                      message: "Vui lòng nhập tên của nhóm thông tin",
                    },
                  ]}
                >
                  <Input placeholder="Nhập tên nhóm thông tin" />
                </Form.Item>
                <Form.Item
                  name={`section_description_${index}`}
                  label="Mô tả nhóm thông tin:"
                  initialValue={section.description}
                >
                  <Input.TextArea placeholder="Nhập mô tả nhóm thông tin" />
                </Form.Item>
                <Button
                  size="large"
                  icon={<DeleteFilled />}
                  style={{ fontSize: 18 }}
                  danger
                  type="text"
                  onClick={() =>
                    dispatch({
                      type: "DELETE_SECTION",
                      payload: section.sequence,
                    })
                  }
                />
              </div>

              <div className="grid grid-col-1 gap-6">
                {section.fields.map((field: Field, i: number) => (
                  <div
                    key={i}
                    className="relative group border border-gray-300 rounded-lg p-4 shadow-sm transition-all duration-200 hover:border-blue-500"
                  >
                    {handleRenderField(
                      field.type,
                      field.order,
                      section.sequence
                    )}

                    <Button
                      icon={<DeleteFilled />}
                      danger
                      type="primary"
                      className="!absolute top-[-16px] right-[20px] opacity-0 group-hover:opacity-100"
                    />
                  </div>
                ))}
              </div>
            </div>
          ))}
        </Form>

        <Button
          className="w-full"
          type="primary"
          icon={<PlusOutlined />}
          onClick={() =>
            dispatch({
              type: "ADD_SECTION",
              payload: {
                name: "",
                description: "",
                fields: [],
                sequence: state.sections.length + 1,
              },
            })
          }
        >
          Thêm phần mới
        </Button>
      </div>
    </main>
  );
}
