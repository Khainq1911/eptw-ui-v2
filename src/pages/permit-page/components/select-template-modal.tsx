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
      title={<span className="text-xl font-bold text-gray-800">Chọn mẫu giấy phép</span>}
      className="premium-modal"
      centered
    >
      <div className="py-2">
        <p className="text-gray-500 mb-4 text-sm">Vui lòng chọn một mẫu giấy phép để bắt đầu quy trình tạo mới.</p>
        <Form layout="vertical" form={modalForm}>
          <Form.Item
            name="template"
            className="mb-0"
            label={<span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Mẫu giấy phép</span>}
            rules={[{ required: true, message: "Vui lòng chọn mẫu để tiếp tục" }]}
          >
            <Select
              autoFocus
              allowClear
              showSearch
              size="large"
              placeholder="Tìm kiếm và chọn mẫu..."
              optionFilterProp="label"
              className="w-full"
              options={templateDdl?.map((item: { id: number; name: string }) => ({
                label: item.name,
                value: item.id,
              }))}
            />
          </Form.Item>
        </Form>
      </div>
    </Modal>
  );
}
