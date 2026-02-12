import { useGetPermitLogs } from "@/services/permit-log.service";
import { formatDate } from "@/common/common-services/formatTime";
import {
  Drawer,
  Timeline,
  Spin,
  Tag,
  Empty,
} from "antd";
import { useEffect } from "react";

interface PermitLogDrawerProps {
  open: boolean;
  permitId: number;
  onClose: () => void;
}

const statusColorMap: Record<string, string> = {
  Create: "orange",
  Sign: "orange",
  Pending: "orange",
  Approved: "green",
  Rejected: "red",
  Inprogress: "blue",
  Completed: "cyan",
  Closed: "default",
  Canceled: "volcano",
  Update: "orange",
  Expired: "magenta",
  RejectSection: "red",
};

export default function PermitLogDrawer({
  open,
  permitId,
  onClose,
}: PermitLogDrawerProps) {
  const getPermitLogs = useGetPermitLogs(permitId);

  useEffect(() => {
    if (open && permitId) {
      getPermitLogs.mutate();
    }
  }, [open, permitId]);

  const logs = getPermitLogs.data || [];

  return (
    <Drawer
      title="Lịch sử trạng thái"
      open={open}
      onClose={onClose}
      width={480}
      destroyOnHidden
    >
      {getPermitLogs.isPending && (
        <div style={{ textAlign: "center", padding: 40 }}>
          <Spin size="large" />
        </div>
      )}

      {!getPermitLogs.isPending && logs.length === 0 && (
        <Empty description="Chưa có lịch sử trạng thái" />
      )}

      {!getPermitLogs.isPending && logs.length > 0 && (
        <Timeline
          mode="left"
          items={logs.map((log: any) => ({
            color: statusColorMap[log.action] || "gray",
            children: (
              <div style={{ paddingBottom: 8 }}>
                <div style={{ marginBottom: 4 }}>
                  <Tag color={statusColorMap[log.action] || "default"}>
                    {log.action}
                  </Tag>
                </div>

                {log.user && (
                  <p style={{ margin: 0, fontSize: 13 }}>
                    <strong>Người thực hiện:</strong> {log.user.name || log.user.email}
                  </p>
                )}

                {log.comment && (
                  <p style={{ margin: "4px 0 0", fontSize: 13, color: "#555" }}>
                    <strong>Nhận xét:</strong> {log.comment}
                  </p>
                )}

                {log.createdAt && (
                  <p style={{ margin: "4px 0 0", fontSize: 12, color: "#999" }}>
                    {formatDate(log.createdAt)}
                  </p>
                )}
              </div>
            ),
          }))}
        />
      )}
    </Drawer>
  );
}
