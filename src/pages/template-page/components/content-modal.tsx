import { PlusOutlined } from "@ant-design/icons";
import {
  Button,
  Form,
  Input,
  Modal,
  Select,
  type FormInstance,
} from "antd";
import { useCallback, useEffect, useState, type ChangeEvent, type JSX } from "react";
import type { Field, Section, Template } from "../template-type";
import { closestCorners, DndContext } from "@dnd-kit/core";
import { arrayMove, SortableContext } from "@dnd-kit/sortable";
import { fieldTemplates } from "./sidebar-modal";
import {
  useGetListApprovalTypes,
  useGetListTemplateTypes,
} from "../template-services";
import SectionItem from "./section-item";

interface props {
  state: Template;
  dispatch: React.Dispatch<any>;
  isPreview: boolean;
  action: any;
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
  dispatch,
  action,
  inforForm,
  handleRenderField,
  isPreview,
}: props) {
  const [openAddFieldModal, setOpenAddFieldModal] = useState(false);
  const [currentSection, setCurrentSection] = useState<Section | null>(null);

  const [form] = Form.useForm();

  // Removed unused roleData (moved to SectionItem)
  const { data: templateTypeData } = useGetListTemplateTypes();
  const { data: approvalTypeData } = useGetListApprovalTypes();

  // Removed handleValuesChange (moved logic to SectionItem)

  useEffect(() => {
    if (action.edit) {
      inforForm.setFieldsValue({
        name: state.name,
        description: state.description,
        templateTypeId: state.templateTypeId,
        approvalTypeId: state.approvalTypeId,
      });
    }
  }, [action]);

  // Memoize handleUpdateField so SectionItem/Fields don't re-render unnecessarily
  const handleUpdateField = useCallback(
    (
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
    },
    [dispatch]
  );

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
              <Input placeholder="Nhập tên mẫu giấy phép" disabled={isPreview} />
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
                disabled={isPreview}
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
                disabled={isPreview}
              />
            </Form.Item>

            <Form.Item label="Mô tả mẫu giấy phép" name="description">
              <Input.TextArea disabled={isPreview} />
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
              {state.sections.map((section: Section) => (
                <SectionItem
                  key={section.id}
                  section={section}
                  dispatch={dispatch}
                  handleRenderField={handleRenderField}
                  handleUpdateField={handleUpdateField}
                  setOpenAddFieldModal={setOpenAddFieldModal}
                  setCurrentSection={setCurrentSection}
                  isPreview={isPreview}
                />
              ))}
            </SortableContext>
          </DndContext>
        </div>

        {!isPreview && (
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
        )}
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
