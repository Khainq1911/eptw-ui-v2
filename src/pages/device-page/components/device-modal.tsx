import { Input, Modal } from "antd";
import { useDevicePageHook } from "../device-page-hooks";
import type React from "react";
import { handleChangeInput } from "@/common/common-services/single-input-change";
export default function AddDeviceModal({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const { formAddDevice, setFormAddDevice } = useDevicePageHook();
  return (
    <Modal
      title="Thêm thiết bị mới"
      open={open}
      onCancel={onClose}
      onOk={() => console.log(formAddDevice)}
    >
      <form className="grid gap-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="font-semibold">Tên thiết bị</label>
            <Input
              placeholder="Nhập tên thiết bị"
              name="name"
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                handleChangeInput(e, setFormAddDevice)
              }
            />
          </div>
          <div>
            <label className="font-semibold">Mã thiết bị</label>
            <Input
              placeholder="Nhập mã thiết bị"
              name="code"
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                handleChangeInput(e, setFormAddDevice)
              }
            />
          </div>
        </div>
        <div>
          <label className="font-semibold">Mô tả (Tùy chọn)</label>
          <Input.TextArea
            placeholder="Thêm mô tả cho thiết bị..."
            name="description"
            onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
              handleChangeInput(e, setFormAddDevice)
            }
          />
        </div>
      </form>
    </Modal>
  );
}
