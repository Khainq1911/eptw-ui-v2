import { Form, Modal, Select } from "antd";
import { useGetTemplateById } from "@/pages/template-page/template-services";

export default function SelectTemplateModal({
  modalForm,
  openModalSelect,
  handleCloseModalSelect,
  handleOpenCreatePermit,
  dispatch,
  templateDdl,
}: any) {
  const getTemplateMutation = useGetTemplateById();
  return (
    <Modal
      open={openModalSelect}
      onCancel={handleCloseModalSelect}
      onOk={async () => {
        const value = await modalForm.validateFields();
        const res = await getTemplateMutation.mutateAsync(value.template);
        const { sections } = res;
        dispatch({
          type: "SET_DATA",
          payload: { sections, template: res },
        });
        handleCloseModalSelect();
        handleOpenCreatePermit();
      }}
      confirmLoading={getTemplateMutation.isPending}
      title="Chọn mẫu"
    >
      <Form layout="vertical" form={modalForm}>
        <Form.Item
          name="template"
          label="Mẫu"
          rules={[{ required: true, message: "Vui lòng chọn mẫu để tiếp tục" }]}
        >
          <Select
            allowClear
            showSearch
            placeholder="Chọn mẫu"
            optionFilterProp="label"
            options={templateDdl?.map((item: { id: number; name: string }) => ({
              label: item.name,
              value: item.id,
            }))}
          />
        </Form.Item>
      </Form>
    </Modal>
  );
}
