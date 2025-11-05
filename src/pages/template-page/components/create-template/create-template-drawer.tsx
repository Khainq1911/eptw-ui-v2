import { Button, Drawer, Form, Space } from "antd";
import { useCallback, type SetStateAction } from "react";
import { useCreateTemplate } from "./create-template-service";
import SidebarModal from "../sidebar-modal";
import ContentModal from "../content-modal";
import SingleInput from "../ui/single-input";
import Date from "../ui/date";
import TextArea from "../ui/textarea";
import type { Field, Section } from "../../template-type";
import { useCreateTemplateMutation } from "../../template-services";
import { useNotification } from "@/common/hooks/useNotification";
import type { AxiosError } from "axios";

export default function AddTemplateModal({
  openAddTemplateModal,
  setOpenAddTemplateModal,
}: {
  openAddTemplateModal: boolean;
  setOpenAddTemplateModal: React.Dispatch<SetStateAction<boolean>>;
}) {
  const { state, dispatch } = useCreateTemplate();
  const notify = useNotification();
  const [inforForm] = Form.useForm();
  const createTemplateMutation = useCreateTemplateMutation();

  const handleRenderField = useCallback(
    (type: string, field: Field, section: Section, handleUpdateField: any) => {
      switch (type) {
        case "input":
          return (
            <SingleInput
              field={field}
              section={section}
              handleUpdateField={handleUpdateField}
            />
          );
        case "date":
          return (
            <Date
              field={field}
              section={section}
              handleUpdateField={handleUpdateField}
            />
          );
        case "textarea":
          return (
            <TextArea
              field={field}
              section={section}
              handleUpdateField={handleUpdateField}
            />
          );

        default:
          return null;
      }
    },
    []
  );

  const handleClose = () => {
    setOpenAddTemplateModal(false);
    inforForm.resetFields();
    dispatch({ type: "RESET_STATE" });
  };

  return (
    <Drawer
      open={openAddTemplateModal}
      onClose={handleClose}
      title="Thêm mẫu giấy phép mới"
      placement="right"
      width="100vw"
      destroyOnHidden
      styles={{
        body: {
          padding: 0,
        },
      }}
      extra={
        <div style={{ textAlign: "right" }}>
          <Space>
            <Button icon={<span>✏️</span>} type="primary">
              Chỉnh sửa
            </Button>
            <Button icon={<span>👁️</span>}>Xem trước</Button>
          </Space>
        </div>
      }
      footer={
        <div style={{ textAlign: "right" }}>
          <Space>
            <Button onClick={() => handleClose()} type="primary" danger>
              Hủy bỏ
            </Button>
            <Button
              loading={createTemplateMutation.isPending}
              type="primary"
              onClick={async () => {
                try {
                  const data = await inforForm.validateFields();

                  const payload = {
                    ...state,
                    ...data,
                  };

                  await createTemplateMutation.mutateAsync(payload);

                  notify(
                    "success",
                    "Tạo mẫu thành công",
                    "Mẫu giấy phép mới đã được lưu vào hệ thống."
                  );

                  setOpenAddTemplateModal(false);
                  inforForm.resetFields();
                  dispatch({
                    type: "RESET_STATE",
                  });
                } catch (error: unknown) {
                  const axiosError = error as AxiosError<{ message?: string }>;
                  const msg =
                    axiosError.response?.data?.message || "Đã có lỗi xảy ra";

                  notify("error", "Tạo mẫu thất bại", msg);
                }
              }}
            >
              Lưu
            </Button>
          </Space>
        </div>
      }
    >
      <div className="flex h-full">
        <SidebarModal />
        <ContentModal
          state={state}
          inforForm={inforForm}
          dispatch={dispatch}
          handleRenderField={handleRenderField}
        />
      </div>
    </Drawer>
  );
}
