import { Button, Drawer, Form, Space } from "antd";
import { useCallback, useEffect, useState, type SetStateAction } from "react";
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
import type { AxiosError } from "axios";
import CheckboxField from "../ui/checkbox";
import RadioField from "../ui/radio";
import HeadingField from "../ui/heading";
import ParagraphField from "../ui/paragraph";
import { App } from "antd";

export default function AddTemplateModal({
  action,
  state,
  dispatch,
  loading,
  setAction,
  openAddTemplateModal,
  setOpenAddTemplateModal,
}: {
  action: { create: boolean; edit: boolean; view?: boolean };
  state: any;
  loading: boolean;
  setAction: React.Dispatch<
    React.SetStateAction<{ create: boolean; edit: boolean; view?: boolean }>
  >;
  dispatch: React.Dispatch<any>;
  openAddTemplateModal: boolean;
  setOpenAddTemplateModal: React.Dispatch<SetStateAction<boolean>>;
}) {
  const {notification} = App.useApp()
  const [inforForm] = Form.useForm();
  const createTemplateMutation = useCreateTemplateMutation();
  const updateTemplateMutation = useUpdateTemplateMutation();
  const [isPreview, setIsPreview] = useState(false);

  useEffect(() => {
    if (action.view) {
      setIsPreview(true);
    } else {
      setIsPreview(false);
    }
  }, [action.view]);

  const handleRenderField = useCallback(
    (type: string, field: Field, section: Section, handleUpdateField: any) => {
      const commonProps = {
        field,
        section,
        handleUpdateField,
        isPreview,
      };

      switch (type) {
        case "input":
          return <SingleInput {...commonProps} />;
        case "date":
          return <Date {...commonProps} />;
        case "textarea":
          return <TextArea {...commonProps} />;
        case "checkbox": {
          return <CheckboxField {...commonProps} dispatch={dispatch} />;
        }
        case "radio": {
          return <RadioField {...commonProps} dispatch={dispatch} />;
        }
        case "heading": {
          return <HeadingField {...commonProps} />;
        }
        case "paragraph": {
          return <ParagraphField {...commonProps} />;
        }
        default:
          return null;
      }
    },
    [isPreview]
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
      placement="top"
      width="100vw"
      height="100vh"
      loading={loading}
      destroyOnHidden
      styles={{
        body: {
          padding: 0,
        },
      }}
      extra={
        <div style={{ textAlign: "right" }}>
          <Space>
            {!action.view && (
              <>
                <Button
                  icon={<span>✏️</span>}
                  onClick={() => setIsPreview(false)}
                  type={`${isPreview ? "default" : "primary"}`}
                >
                  Chỉnh sửa
                </Button>
                <Button
                  type={`${isPreview ? "primary" : "default"}`}
                  icon={<span>👁️</span>}
                  onClick={() => setIsPreview(true)}
                >
                  Xem trước
                </Button>
              </>
            )}
          </Space>
        </div>
      }
      footer={
        <div style={{ textAlign: "right" }}>
          <Space>
            <Button onClick={() => handleClose()} type="primary" danger>
              {action.view ? "Đóng" : "Hủy bỏ"}
            </Button>
            {!action.view && (
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

                    notification.success({
                      message: "Lưu mẫu thành công",
                      description:
                        "Mẫu giấy phép mới đã được lưu vào hệ thống.",
                    });

                    setAction({
                      create: false,
                      edit: false,
                      view: false,
                    });
                    setOpenAddTemplateModal(false);
                    inforForm.resetFields();
                    dispatch({
                      type: "RESET_STATE",
                    });
                  } catch (error: unknown) {
                    console.log(error);
                    const axiosError = error as AxiosError<{
                      message?: string;
                    }>;
                    const msg =
                      axiosError.response?.data?.message ||
                      "Đã có lỗi xảy ra";

                    notification.error({
                      message: "Lưu mẫu thất bại",
                      description: msg,
                    });
                  }
                }}
              >
                Lưu
              </Button>
            )}
          </Space>
        </div>
      }
    >
      <div className="flex h-full">
        <SidebarModal />
        <ContentModal
          isPreview={isPreview}
          state={state}
          action={action}
          inforForm={inforForm}
          dispatch={dispatch}
          handleRenderField={handleRenderField}
        />
      </div>
    </Drawer>
  );
}
