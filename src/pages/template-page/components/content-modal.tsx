import { DeleteFilled, PlusOutlined } from "@ant-design/icons";
import {
  Button,
  Checkbox,
  Col,
  Form,
  Input,
  Modal,
  Row,
  Select,
  type FormInstance,
} from "antd";
import { useEffect, useState, type ChangeEvent, type JSX } from "react";
import type { Field, Section, Template } from "../template-type";
import { closestCorners, DndContext } from "@dnd-kit/core";
import { arrayMove, SortableContext } from "@dnd-kit/sortable";
import SortableItem from "./ui/sort-item";
import { fieldTemplates } from "./sidebar-modal";
import {
  useGetListApprovalTypes,
  useGetListRoles,
  useGetListTemplateTypes,
} from "../template-services";

interface props {
  state: Template;
  dispatch: React.Dispatch<any>;
  isPreview: boolean;
  inforForm: FormInstance;
  handleRenderField: (
    type: string,
    field: Field,
    section: Section,
    handleUpdateField: any
  ) => JSX.Element | null;
}

export default function ContentModal({
  state,
  isPreview,
  dispatch,
  inforForm,
  handleRenderField,
}: props) {
  const [openAddFieldModal, setOpenAddFieldModal] = useState(false);
  const [currentSection, setCurrentSection] = useState<Section | null>(null);

  const [form] = Form.useForm();

  const { data: roleData } = useGetListRoles();
  const { data: templateTypeData } = useGetListTemplateTypes();
  const { data: approvalTypeData } = useGetListApprovalTypes();

  const handleValuesChange = (
    event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    section: Section,
    fieldName: string
  ) => {
    dispatch({
      type: "UPDATE_SECTION",
      payload: {
        section,
        [fieldName]: event.target.value,
      },
    });
  };

  const handleUpdateField = (
    event: ChangeEvent<HTMLInputElement>,
    section: Section,
    field: Field,
    fieldName: string
  ) => {
    const value = event.target.value || event.target.checked;
    dispatch({
      type: "UPDATE_FIELD",
      payload: { section, field, [fieldName]: value },
    });
  };

  useEffect(() => console.log(state), [state]);

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

        <div className="w-full bg-white rounded-lg shadow-sm p-6 border border-gray-200">
          <h2 className="text-xl font-bold text-slate-900 mb-2">
            Thông tin chung
          </h2>
          <Form
            layout="horizontal"
            form={inforForm}
            labelCol={{ span: 6 }}
            wrapperCol={{ span: 18 }}
            labelAlign="left"
          >
            <Form.Item
              label="Tên mẫu giấy phép"
              name="name"
              rules={[
                { required: true, message: "Vui lòng nhập tên mẫu giấy phép" },
              ]}
            >
              <Input placeholder="Nhập tên mẫu giấy phép" />
            </Form.Item>

            <Form.Item
              label="Loại giấy phép"
              name="templateTypeId"
              rules={[
                { required: true, message: "Vui lòng chọn loại giấy phép" },
              ]}
            >
              <Select
                placeholder="Chọn kiểu ký giấy phép"
                allowClear
                showSearch
                optionFilterProp="label"
                options={
                  templateTypeData?.map(
                    (type: { id: number; name: string }) => ({
                      value: type.id,
                      label: type.name,
                    })
                  ) || []
                }
              />
            </Form.Item>

            <Form.Item
              label="Kiểu ký giấy phép"
              name="approvalTypeId"
              rules={[
                { required: true, message: "Vui lòng chọn kiểu ký giấy phép" },
              ]}
            >
              <Select
                placeholder="Chọn kiểu ký giấy phép"
                allowClear
                showSearch
                optionFilterProp="label"
                options={
                  approvalTypeData?.map(
                    (type: { id: number; name: string }) => ({
                      value: type.id,
                      label: type.name,
                    })
                  ) || []
                }
              />
            </Form.Item>

            <Form.Item label="Mô tả mẫu giấy phép" name="description">
              <Input.TextArea />
            </Form.Item>
          </Form>
        </div>

        <div className="space-y-6 my-8">
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
                    <Row gutter={16} align="top" className="mb-4">
                      <Col span={8}>
                        <div className="flex flex-col gap-1">
                          <label className="font-medium text-gray-700">
                            Tên nhóm thông tin
                          </label>
                          <Input
                            placeholder="Nhập tên nhóm thông tin"
                            value={section.name}
                            onChange={(e) =>
                              handleValuesChange(e, section, "name")
                            }
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
                            value={section.description}
                            onChange={(e) =>
                              handleValuesChange(e, section, "description")
                            }
                            autoSize={{ minRows: 1, maxRows: 3 }}
                          />
                        </div>
                      </Col>

                      <Col span={4}>
                        <div className="flex flex-col gap-1">
                          <label className="font-medium text-gray-700">
                            Thao tác
                          </label>
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
                      <SortableContext
                        items={section.fields.map((field: Field) => field)}
                      >
                        <div className="grid grid-col-1 gap-6">
                          {section.fields.map((field: Field, i: number) => (
                            <SortableItem props={field} key={i}>
                              <div className="relative group border border-gray-300 rounded-lg p-4 shadow-sm transition-all duration-200 hover:border-blue-500">
                                {handleRenderField(
                                  field.type,
                                  field,
                                  section,
                                  handleUpdateField
                                )}

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
                              </div>
                            </SortableItem>
                          ))}
                        </div>
                      </SortableContext>
                    </DndContext>
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
                    <Checkbox
                      checked={section.sign.required}
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
                sign: {
                  required: false,
                  roleIdAllowed: null,
                },
                id: state.sections.length + 1,
              },
            })
          }
        >
          Thêm phần mới
        </Button>
      </div>
      <Modal
        open={openAddFieldModal}
        title="Thêm trường mới"
        onCancel={() => {
          setOpenAddFieldModal(false);
          setCurrentSection(null);
          form.resetFields();
        }}
        onOk={async () => {
          try {
            const values = await form.validateFields();

            dispatch({
              type: "ADD_FIELD",
              payload: {
                section: currentSection,
                data: {
                  ...values,
                },
              },
            });
            form.resetFields();
            setOpenAddFieldModal(false);
            setCurrentSection(null);
          } catch (errorInfo) {
            console.log("❌ Validation failed:", errorInfo);
          }
        }}
      >
        <Form layout="vertical" form={form}>
          <Form.Item
            label="Chọn trường"
            name="type"
            rules={[
              { required: true, message: "Vui lòng chọn trường để thêm" },
            ]}
          >
            <Select
              allowClear
              optionFilterProp="label"
              options={fieldTemplates.map((field) => ({
                value: field.type,
                label: `${field.icon} ${field.name}`,
              }))}
            />
          </Form.Item>
        </Form>
      </Modal>
    </main>
  );
}
