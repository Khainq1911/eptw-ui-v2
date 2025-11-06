import { Button, Drawer, Form, Space } from "antd";
import { useCallback, useEffect, type SetStateAction } from "react";
import SidebarModal from "../sidebar-modal";
import ContentModal from "../content-modal";
import SingleInput from "../ui/single-input";
import Date from "../ui/date";
import TextArea from "../ui/textarea";
import type { Field, Section } from "../../template-type";
import {
  useCreateTemplateMutation,
  useUpdateTemplateMutation,
} from "../../template-services";
import { useNotification } from "@/common/hooks/useNotification";
import type { AxiosError } from "axios";

export default function AddTemplateModal({
  action,
  state,
  dispatch,
  setAction,
  openAddTemplateModal,
  setOpenAddTemplateModal,
}: {
  action: { create: boolean; edit: boolean };
  state: any;
  setAction: React.Dispatch<
    React.SetStateAction<{ create: boolean; edit: boolean }>
  >;
  dispatch: React.Dispatch<any>;
  openAddTemplateModal: boolean;
  setOpenAddTemplateModal: React.Dispatch<SetStateAction<boolean>>;
}) {
  const notify = useNotification();
  const [inforForm] = Form.useForm();
  const createTemplateMutation = useCreateTemplateMutation();
  const updateTemplateMutation = useUpdateTemplateMutation();

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

                  if (action.create) {
                    await createTemplateMutation.mutateAsync(payload);
                  } else {
                    const { templateType, approvalType, ...rest } = payload;
                    await updateTemplateMutation.mutateAsync({
                      id: payload.id,
                      data: rest,
                    });
                  }

                  notify(
                    "success",
                    "Lưu mẫu thành công",
                    "Mẫu giấy phép mới đã được lưu vào hệ thống."
                  );

                  setAction({ create: false, edit: false });
                  setOpenAddTemplateModal(false);
                  inforForm.resetFields();
                  dispatch({
                    type: "RESET_STATE",
                  });
                } catch (error: unknown) {
                  const axiosError = error as AxiosError<{ message?: string }>;
                  const msg =
                    axiosError.response?.data?.message || "Đã có lỗi xảy ra";

                  notify("error", "Lưu mẫu thất bại", msg);
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
