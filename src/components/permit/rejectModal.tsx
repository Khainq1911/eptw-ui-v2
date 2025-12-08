import { useRejectSection } from "@/services/permit.service";
import { App, Input, Modal } from "antd";
import { useState } from "react";

export default function RejectModal({
  openRejectModal,
  section,
  permitId,
  setOpenRejectModal,
  form,
  setSigns,
}: any) {
  const [content, setContent] = useState("");

  const { modal, notification } = App.useApp();
  const rejectSectionMutation = useRejectSection();

  const handleOk = async () => {
    try {
      const payload = { reason: content, permitId, sectionId: section.id };

      const res = await rejectSectionMutation.mutateAsync(payload);

      form.setFieldValue("status", res.permitStatus);
      setSigns((prev: any[]) => {
        return prev.map((s: any) => {
          if (s.sectionId === section.id) {
            return { ...s, ...res.sign };
          }
          return s;
        });
      });
      notification.success({
        message: "Thành công",
        description: "Từ chối giấy phép thành công",
      });
    } catch {
      notification.error({
        message: "Lỗi",
        description: "Có lỗi xảy ra",
      });
    }
  };

  return (
    <Modal
      open={openRejectModal}
      title="Nội dung từ chối"
      onCancel={() => setOpenRejectModal(false)}
      onOk={() =>
        modal.confirm({
          title: "Xác nhận từ chối",
          content: "Bạn có chắc chắn muốn từ chối giấy phép này không?",
          okText: "Xác nhận",
          cancelText: "Hủy",
          onOk: handleOk,
        })
      }
    >
      <Input.TextArea
        rows={4}
        style={{ width: "100%" }}
        onChange={(e) => setContent(e.target.value)}
      />
    </Modal>
  );
}
