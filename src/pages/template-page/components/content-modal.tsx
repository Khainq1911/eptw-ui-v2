import { DeleteFilled, PlusOutlined } from "@ant-design/icons";
import { Button, Input } from "antd";
import { useEffect, type ChangeEvent, type JSX } from "react";
import type { Field, Section, Template } from "../template.type";
import { closestCorners, DndContext } from "@dnd-kit/core";
import { arrayMove, SortableContext } from "@dnd-kit/sortable";
import SortableItem from "./ui/sort-item";

interface props {
  state: Template;
  dispatch: React.Dispatch<any>;
  handleRenderField: (type: string, field: Field) => JSX.Element | null;
}

export default function ContentModal({
  state,
  dispatch,
  handleRenderField,
}: props) {
  useEffect(() => {
    console.log(state);
  }, [state]);

  const handleValuesChange = (
    event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    section: Section,
    field: string
  ) => {
    console.log(event.target.value);
    console.log(section);

    dispatch({
      type: "UPDATE_SECTION",
      payload: {
        section,
        [field]: event.target.value,
      },
    });
  };
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

        <div className="space-y-6 !mb-8">
          <DndContext
            collisionDetection={closestCorners}
            onDragEnd={(event) => {
              const { active, over } = event;
              if (!over || active.id === over.id) return;

              const oldIndex = state.sections.findIndex(
                (s) => s.id === active.id
              );
              const newIndex = state.sections.findIndex(
                (s) => s.id === over.id
              );
              const newSections = arrayMove(state.sections, oldIndex, newIndex);
              console.log(newSections);

              dispatch({
                type: "REORDER_SECTIONS",
                payload: newSections,
              });
            }}
          >
            <SortableContext items={state.sections.map((s) => s)}>
              {state.sections.map((section: Section, index: number) => (
                <SortableItem props={section} key={index}>
                  <div
                    key={section.id}
                    className="w-full bg-white rounded-lg shadow-sm p-6 border border-gray-200"
                  >
                    <div className="flex justify-between !items-start gap-10 mb-4">
                      <Input
                        placeholder="Nhập tên nhóm thông tin"
                        value={section.name}
                        onChange={(e) => handleValuesChange(e, section, "name")}
                      />

                      <Input.TextArea
                        placeholder="Nhập mô tả nhóm thông tin"
                        value={section.description}
                        onChange={(e) =>
                          handleValuesChange(e, section, "description")
                        }
                      />

                      <Button
                        size="large"
                        icon={<DeleteFilled />}
                        style={{ fontSize: 18 }}
                        danger
                        type="text"
                        onClick={() =>
                          dispatch({
                            type: "DELETE_SECTION",
                            payload: section.id,
                          })
                        }
                      />
                    </div>

                    <DndContext
                      collisionDetection={closestCorners}
                      onDragEnd={(event) => {
                        const { active, over } = event;
                        if (!over || active.id === over.id) return;

                        const oldIndex = section.fields.findIndex(
                          (f) => f.id === active.id
                        );
                        const newIndex = section.fields.findIndex(
                          (f) => f.id === over.id
                        );
                        const newFields = arrayMove(
                          section.fields,
                          oldIndex,
                          newIndex
                        );
                        dispatch({
                          type: "REORDER_FIELDS",
                          payload: {
                            sectionId: section.id,
                            fields: newFields,
                          },
                        });
                      }}
                    >
                      <SortableContext
                        items={section.fields.map((field: Field) => field)}
                      >
                        <div className="grid grid-col-1 gap-6">
                          {section.fields.map((field: Field, i: number) => (
                            <SortableItem props={field} key={i}>
                              <div className="relative group border border-gray-300 rounded-lg p-4 shadow-sm transition-all duration-200 hover:border-blue-500">
                                {handleRenderField(field.type, field)}

                                <Button
                                  icon={<DeleteFilled />}
                                  danger
                                  type="primary"
                                  className="!absolute top-[-16px] right-[20px] opacity-0 group-hover:opacity-100"
                                />
                              </div>
                            </SortableItem>
                          ))}
                        </div>
                      </SortableContext>
                    </DndContext>
                  </div>
                </SortableItem>
              ))}
            </SortableContext>
          </DndContext>
        </div>

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
                id: state.sections.length + 1,
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
