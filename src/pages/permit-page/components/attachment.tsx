import {
  DeleteOutlined,
  DownloadOutlined,
  PlusOutlined,
} from "@ant-design/icons";
import { Button, Divider, Space, Table } from "antd";
import type { ColumnsType } from "antd/es/table";
import AddFileModal from "./add-file-modal";
import { useMemo, useState } from "react";

export default function AttachmentFile({ dispatch, state }: any) {
  const [openAddFileModal, setOpenAddFileModal] = useState(false);

  const handleOpenAddFileModal = () => {
    setOpenAddFileModal(true);
  };
  const handleCloseAddFileModal = () => {
    setOpenAddFileModal(false);
  };

  const columns: ColumnsType = [
    {
      title: "STT",
      dataIndex: "index",
      key: "index",
      render: (_: any, __: any, index: number) => index + 1,
      width: 80,
      align: "center",
    },
    {
      title: "Loại file",
      dataIndex: "type",
      key: "type",
      width: 100,
      ellipsis: true,
    },
    {
      title: "Tên file",
      dataIndex: "name",
      key: "name",
      width: 200,
      ellipsis: true,
    },
    {
      title: "Kích thước",
      dataIndex: "size",
      key: "size",
      width: 100,
      ellipsis: true,
      render: (text: number) => {
        if (text === 0) {
          return "0 Bytes";
        }
        const k = 1024;
        const dm = 2 < 0 ? 0 : 2;
        const sizes = ["Bytes", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"];
        const i = Math.floor(Math.log(text) / Math.log(k));
        return parseFloat((text / Math.pow(k, i)).toFixed(dm)) + " " + sizes[i];
      },
    },
    {
      title: "Ngày tạo",
      dataIndex: "createdAt",
      key: "createdAt",
      width: 150,
      ellipsis: true,
    },
    {
      title: "Hành động",
      key: "action",
      fixed: "right",
      width: 100,
      render: (_: any, record: any) => (
        <Space>
          <Button icon={<DownloadOutlined />} type="primary" />
          <Button
            icon={<DeleteOutlined />}
            type="primary"
            danger
            onClick={() =>
              dispatch({
                type: "REMOVE_ATTACHMENT",
                payload: { uid: record.uid },
              })
            }
          />
        </Space>
      ),
    },
  ];

  const dataSource = useMemo(() => {
    if (!state?.attachments) {
      return [];
    }
    return state.attachments.map((item: any) => ({
      uid: item.file[0].uid,
      type: item.type,
      name: item.file[0].name,
      size: item.file[0].size,
      createdAt: item.file[0].createdAt,
    }));
  }, [state]);

  return (
    <div className="w-[70%] bg-white p-6 mx-auto rounded-lg shadow-lg my-6">
      <div className="flex justify-between items-center">
        <h2 className="font-bold">File đính kèm</h2>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={handleOpenAddFileModal}
        >
          Thêm file
        </Button>
      </div>
      <Divider />
      <Table columns={columns} dataSource={dataSource} pagination={false} />
      <AddFileModal
        open={openAddFileModal}
        onClose={handleCloseAddFileModal}
        dispatch={dispatch}
      />
    </div>
  );
}
