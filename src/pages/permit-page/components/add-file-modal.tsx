import { formatDate } from "@/common/common-services/formatTime";
import { UploadOutlined } from "@ant-design/icons";
import { Button, Form, Input, Modal, Upload } from "antd";
import { useState } from "react";

export default function AddFileModal({ open, onClose, dispatch }: any) {
  const [form] = Form.useForm();
  const [fileList, setFileList] = useState([]);

  const props = {
    beforeUpload: () => false,
    fileList,
    multiple: false,
    maxCount: 1,
    onRemove: (file: any) => {
      setFileList((prev) => prev.filter((f: any) => f.uid !== file.uid));
    },
    onChange(info: any) {
      setFileList(info.fileList);
      form.setFieldValue("file", info.fileList);
    },
  };

  const handleOk = async () => {
    const values = await form.validateFields();

    dispatch({
      type: "ADD_ATTACHMENTS",
      payload: {
        ...values,
        file: [
          {
            ...values.file[0],
            createdAt: formatDate(new Date().toISOString()),
          },
        ],
      },
    });

    onClose();
    form.resetFields();
    setFileList([]);
  };

  return (
    <Modal
      onOk={handleOk}
      open={open}
      onCancel={() => {
        onClose();
        form.resetFields();
        setFileList([]);
      }}
      title="Thêm file"
      destroyOnHidden
    >
      <Form layout="vertical" form={form}>
        <Form.Item
          label="Loại file"
          name="type"
          rules={[{ required: true, message: "Vui lòng nhập loại file" }]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          label="File đính kèm"
          name="file"
          valuePropName="fileList"
          rules={[{ required: true, message: "Vui lòng thêm file đính kèm" }]}
        >
          <Upload {...props}>
            <Button icon={<UploadOutlined />} type="primary">
              Upload
            </Button>
          </Upload>
        </Form.Item>
      </Form>
    </Modal>
  );
}
