import React, { useCallback } from "react";
import { Button, Checkbox, Col, Input, Row, Select, Form } from "antd";
import { DeleteFilled, PlusOutlined } from "@ant-design/icons";
import { closestCorners, DndContext } from "@dnd-kit/core";
import { arrayMove, SortableContext } from "@dnd-kit/sortable";
import SortableItem from "./ui/sort-item";
import type { Field, Section } from "../template-type";
import { debounce } from "lodash";
import { useGetListRoles } from "../template-services";

interface SectionItemProps {
  section: Section;
  dispatch: React.Dispatch<any>;
  handleRenderField: (
    type: string,
    field: Field,
    section: Section,
    handleUpdateField: any
  ) => React.JSX.Element | null;
  handleUpdateField: any;
  setOpenAddFieldModal: (val: boolean) => void;
  setCurrentSection: (section: Section) => void;
  isPreview?: boolean;
}

const SectionItem = React.memo(function SectionItem({
  section,
  dispatch,
  handleRenderField,
  handleUpdateField,
  setOpenAddFieldModal,
  setCurrentSection,
  isPreview,
}: SectionItemProps) {
  const { data: roleData } = useGetListRoles();

  // Debounced update for section props (name, description)
  const debouncedUpdateSection = useCallback(
    debounce((value: string, fieldName: string) => {
      dispatch({
        type: "UPDATE_SECTION",
        payload: {
          section,
          [fieldName]: value,
        },
      });
    }, 300),
    [dispatch, section]
  );

  return (
    <SortableItem props={{ ...section, disabled: isPreview }} key={section.id}>
      <div
        className="w-full bg-white rounded-lg shadow-sm p-6 border border-gray-200"
      >
        <Row gutter={16} align="top" className="mb-4">
          <Col span={8}>
            <div className="flex flex-col gap-1">
              <label className="font-medium text-gray-700">
                Tên nhóm thông tin
              </label>
              <Input
                placeholder="Nhập tên nhóm thông tin"
                defaultValue={section.name}
                disabled={isPreview}
                onChange={(e) => debouncedUpdateSection(e.target.value, "name")}
              />
            </div>
          </Col>

          <Col span={12}>
            <div className="flex flex-col gap-1">
              <label className="font-medium text-gray-700">
                Mô tả nhóm thông tin
              </label>
              <Input.TextArea
                placeholder="Nhập mô tả nhóm thông tin"
                defaultValue={section.description}
                disabled={isPreview}
                onChange={(e) =>
                  debouncedUpdateSection(e.target.value, "description")
                }
                autoSize={{ minRows: 1, maxRows: 3 }}
              />
            </div>
          </Col>

          <Col span={4}>
            <div className="flex flex-col gap-1">
              <label className="font-medium text-gray-700">Thao tác</label>
              {!isPreview && (
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
              )}
            </div>
          </Col>
        </Row>

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
          <SortableContext items={section.fields.map((field: Field) => field)}>
            <div className="grid grid-col-1 gap-6">
              {section.fields.map((field: Field) => (
                <SortableItem
                  props={{ ...field, disabled: isPreview }}
                  key={field.id}
                >
                  <div
                    className={
                      isPreview
                        ? "relative p-2"
                        : "relative group border border-gray-300 rounded-lg p-4 shadow-sm transition-all duration-200 hover:border-blue-500"
                    }
                  >
                    {handleRenderField(
                      field.type,
                      field,
                      section,
                      handleUpdateField
                    )}

                    {!isPreview && (
                      <Button
                        icon={<DeleteFilled />}
                        danger
                        type="primary"
                        className="!absolute top-[-16px] right-[20px] opacity-0 group-hover:opacity-100"
                        onClick={() =>
                          dispatch({
                            type: "DELETE_FIELD",
                            payload: { section, field },
                          })
                        }
                      />
                    )}
                  </div>
                </SortableItem>
              ))}
            </div>
          </SortableContext>
        </DndContext>
        {!isPreview && (
          <Button
            type="primary"
            ghost
            icon={<PlusOutlined />}
            className="w-full mt-6"
            onClick={() => {
              setOpenAddFieldModal(true);
              setCurrentSection(section);
            }}
          >
            Thêm trường mới
          </Button>
        )}
        <Checkbox
          checked={section.sign.required}
          disabled={isPreview}
          onChange={(value) => {
            dispatch({
              type: "SET_SIGN",
              payload: {
                section,
                data: value.target.checked,
                fieldName: "required",
              },
            });
          }}
          className="!my-6"
        >
          Yêu cầu ký
        </Checkbox>
        {section.sign.required && (
          <Form>
            <Form.Item
              label="Vai trò ký"
              rules={[
                {
                  required: section.sign.required,
                  message: "Vui lòng chọn vai trò ký",
                },
              ]}
            >
              <Select
                mode="multiple"
                showSearch
                disabled={isPreview}
                optionFilterProp="label"
                placeholder="Chọn vai trò ký"
                allowClear
                value={section.sign.roleIdAllowed}
                options={roleData?.map(
                  (role: { id: number; name: string }) => ({
                    value: role.id,
                    label: role.name,
                  })
                )}
                onChange={(value) => {
                  dispatch({
                    type: "SET_ROLES",
                    payload: {
                      section,
                      data: value,
                    },
                  });
                }}
              />
            </Form.Item>
          </Form>
        )}
      </div>
    </SortableItem>
  );
});

export default SectionItem;
