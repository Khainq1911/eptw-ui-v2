import {
  useCreateUserService,
  useUpdateUserService,
} from "@/services/user.service";
import { App, Form, Input, Modal, Select } from "antd";
import { useEffect, useMemo, useState } from "react";

export default function UserModal({
  action,
  openModal,
  setOpenModal,
  roleOptions,
  data,
}: any) {
  const { modal, notification } = App.useApp();
  const [form] = Form.useForm();
  const createUserMutation = useCreateUserService();
  const updateUserMutation = useUpdateUserService();
  const [currentId, setCurrentId] = useState<number | null>(null);

  const title = useMemo(() => {
    if (action === "create") return "Tạo người dùng";
    if (action === "update") return "Cập nhật người dùng";
    if (action === "view") return "Xem người dùng";
    return "";
  }, [action]);

  const onOk = (values: any) => {
    modal.confirm({
      title: "Xác nhận",
      content: "Bạn có chắc chắn muốn thực hiện hành động này?",
      onOk: async () => {
        if (action === "create") {
          await createUserMutation.mutateAsync(values);
        } else {
          if (currentId) {
            await updateUserMutation.mutateAsync({
              id: currentId,
              data: values,
            });
          } else {
            notification.error({
              message: "Cập nhật người dùng thất bại",
              description: "ID người dùng không hợp lệ",
            });
          }
        }
        setOpenModal(false);
        form.resetFields();
      },
    });
  };

  useEffect(() => {
    if (data) {
      form.setFieldsValue({
        name: data.name,
        email: data.email,
        phone: data.phone,
        roleId: data.role?.id,
      });
      setCurrentId(data.id);
    }
  }, [data]);

  const isViewModal = useMemo(() => {
    return action === "view";
  }, [action]);

  return (
    <Modal
      open={openModal}
      title={title}
      onCancel={() => {
        setOpenModal(false);
        form.resetFields();
      }}
      onOk={async () => {
        if (!isViewModal) {
          const values = await form.validateFields();
          onOk(values);
        }
      }}
      okText="Lưu"
      cancelText="Hủy"
      okButtonProps={{ hidden: isViewModal }}
    >
      <Form layout="vertical" form={form}>
        <Form.Item
          label="Họ và tên"
          name="name"
          rules={[{ required: true, message: "Bạn chưa nhập tên" }]}
        >
          <Input type="text" disabled={isViewModal} />
        </Form.Item>
        <Form.Item
          label="Email"
          name="email"
          rules={[
            { required: true, message: "Bạn chưa nhập email" },
            { type: "email", message: "Email không đúng định dạng" },
          ]}
        >
          <Input type="email" disabled={isViewModal} />
        </Form.Item>
        {action === "create" && (
          <Form.Item
            label="Mật khẩu"
            name="password"
            rules={[{ required: true, message: "Bạn chưa nhập mật khẩu" }]}
          >
            <Input type="password" disabled={isViewModal} />
          </Form.Item>
        )}
        <Form.Item
          label="Số điện thoại"
          name="phone"
          rules={[
            { required: true, message: "Bạn chưa nhập số điện thoại" },
            {
              pattern: /^(0|\+84|84)(3|5|7|8|9)\d{8}$/,
              message: "Số điện thoại không đúng định dạng Việt Nam",
            },
          ]}
        >
          <Input type="text" disabled={isViewModal} />
        </Form.Item>
        <Form.Item
          label="Vai trò"
          name="roleId"
          rules={[{ required: true, message: "Bạn chưa chọn vai trò" }]}
        >
          <Select
            disabled={isViewModal}
            options={roleOptions}
            allowClear
            showSearch
            optionFilterProp="label"
          />
        </Form.Item>
      </Form>
    </Modal>
  );
}
