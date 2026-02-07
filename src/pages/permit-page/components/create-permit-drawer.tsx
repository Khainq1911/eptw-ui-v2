import {
  App,
  Button,
  Col,
  Collapse,
  DatePicker,
  Drawer,
  Form,
  Input,
  InputNumber,
  Modal,
  Row,
  Select,
  Space,
} from "antd";
import DetailSection from "./detail-section";
import { useGetFreeAndActive } from "@/services/device.service";
import { useGetWorkActivities } from "@/services/work-activity.service";
import { useCreatePermit } from "@/services/permit.service";
import { useState } from "react";
import AttachmentFile from "./attachment";
import { uploadFiles } from "@/services/upload-file.service";

const { Panel } = Collapse;

export default function CreatePermitDrawer({
  state,
  dispatch,
  openCreatePermit,
  handleCloseCreatePermit,
}: any) {
  const [form] = Form.useForm();
  const [modal, contextHolder] = Modal.useModal();
  const { data: devicesData } = useGetFreeAndActive();
  const { data: workActivitiesData } = useGetWorkActivities();
  const [loading, setLoading] = useState(false);
  const createPermitMutation = useCreatePermit();
  const { notification } = App.useApp();

  const handleSave = () => {
    modal.confirm({
      title: "Xác nhận lưu giấy phép?",
      content: "Bạn có chắc muốn lưu giấy phép này không?",
      okText: "Lưu",
      cancelText: "Hủy",
      async onOk() {
        setLoading(true);
        try {
          const value = await form.validateFields();

          const { template, attachments, ...rest } = state;

          let fileResults;
          console.log(attachments);
          if (attachments && attachments.length > 0) {
            fileResults = await uploadFiles(attachments);
          }

          const payload = {
            ...rest,
            ...value,
            templateId: template.id,
            attachments: fileResults || null,
          };

          await createPermitMutation.mutateAsync(payload);

          notification.success({
            message: "Lưu giấy phép thành công",
            description: "Giấy phép đã được lưu vào hệ thống.",
            placement: "topRight",
            duration: 3,
          });

          form.resetFields();
          handleCloseCreatePermit();
          dispatch({
            type: "RESET_STATE",
          });
        } catch (error) {
          notification.error({
            message: "Lưu giấy phép thất bại",
            description: "Vui lòng kiểm tra lại thông tin và thử lại.",
            placement: "topRight",
            duration: 3,
          });

          throw error;
        } finally {
          setLoading(false);
        }
      },
    });
  };

  return (
    <Drawer
      open={openCreatePermit}
      onClose={() => {
        handleCloseCreatePermit();
        form.resetFields();
        dispatch({
          type: "RESET_STATE",
        });
      }}
      width={"100%"}
      height={"100%"}
      title="Thêm mới giấy phép"
      placement="top"
      destroyOnHidden
      extra={
        <Space>
          <Button
            onClick={() => {
              handleCloseCreatePermit();
              form.resetFields();
            }}
          >
            Hủy
          </Button>
          <Button type="primary" onClick={handleSave} loading={loading}>
            Lưu
          </Button>
        </Space>
      }
      styles={{
        body: {
          padding: 0,
          backgroundColor: "#F1F3F6",
        },
        footer: {
          display: "flex",
          justifyContent: "flex-end",
        },
      }}
    >
      <div className="w-[70%] bg-white p-2 mx-auto rounded-lg shadow-lg mt-6">
        <Collapse
          defaultActiveKey={["1"]}
          expandIconPosition="end"
          className="!bg-white !px-0"
          bordered={false}
        >
          {contextHolder}
          <Panel
            header={<h2 className="font-bold">Thông tin chung</h2>}
            key="1"
          >
            <Form form={form} layout="vertical">
              <Row gutter={[16, 8]}>
                {/* 1 */}

                {/* 2 */}
                <Col span={8}>
                  <Form.Item label="Tên mẫu giấy phép">
                    <Input value={state?.template?.name} disabled />
                  </Form.Item>
                </Col>

                {/* 3 */}
                <Col span={8}>
                  <Form.Item label="Hình thức ký">
                    <Input
                      value={state?.template?.approvalType?.name}
                      disabled
                    />
                  </Form.Item>
                </Col>

                <Col span={8}>
                  <Form.Item label="Loại mẫu">
                    <Input
                      value={state?.template?.templateType?.name}
                      disabled
                    />
                  </Form.Item>
                </Col>
                {/* 4 */}
                <Col span={8}>
                  <Form.Item
                    label="Tên giấy phép"
                    name="name"
                    rules={[
                      {
                        required: true,
                        message: "Vui lòng nhập tên giấy phép",
                      },
                    ]}
                  >
                    <Input placeholder="Nhập tên giấy phép" />
                  </Form.Item>
                </Col>

                {/* 5 */}
                <Col span={8}>
                  <Form.Item
                    label="Trạng thái"
                    name="status"
                    rules={[
                      { required: true, message: "Vui lòng nhập trạng thái" },
                    ]}
                    initialValue={"Pending"}
                  >
                    <Input placeholder="Nhập trạng thái" disabled />
                  </Form.Item>
                </Col>

                {/* 6 */}
                <Col span={8}>
                  <Form.Item
                    label="Tên công ty"
                    name="companyName"
                    rules={[
                      { required: true, message: "Vui lòng nhập tên công ty" },
                    ]}
                  >
                    <Input placeholder="Nhập tên công ty" />
                  </Form.Item>
                </Col>

                {/* 7 */}
                <Col span={8}>
                  <Form.Item
                    label="Địa chỉ"
                    name="location"
                    rules={[
                      { required: true, message: "Vui lòng nhập địa chỉ" },
                    ]}
                  >
                    <Input placeholder="Nhập địa chỉ" />
                  </Form.Item>
                </Col>

                {/* 8 */}
                <Col span={8}>
                  <Form.Item
                    label="Bắt đầu"
                    name="startTime"
                    rules={[
                      {
                        required: true,
                        message: "Vui lòng chọn thời gian bắt đầu",
                      },
                    ]}
                  >
                    <DatePicker
                      showTime
                      style={{ width: "100%" }}
                      placeholder="Chọn thời gian bắt đầu"
                    />
                  </Form.Item>
                </Col>

                {/* 9 */}
                <Col span={8}>
                  <Form.Item
                    label="Kết thúc"
                    name="endTime"
                    rules={[
                      {
                        required: true,
                        message: "Vui lòng chọn thời gian kết thúc",
                      },
                    ]}
                  >
                    <DatePicker
                      showTime
                      style={{ width: "100%" }}
                      placeholder="Chọn thời gian kết thúc"
                    />
                  </Form.Item>
                </Col>

                {/* 10 */}
                <Col span={8}>
                  <Form.Item
                    label="Số lượng người tham gia"
                    name="peopleNumber"
                    rules={[
                      {
                        required: true,
                        message: "Vui lòng nhập số lượng người tham gia",
                      },
                      { type: "number", min: 1, message: "Phải lớn hơn 0" },
                    ]}
                  >
                    <InputNumber
                      style={{ width: "100%" }}
                      placeholder="Nhập số lượng"
                    />
                  </Form.Item>
                </Col>

                {/* 11 */}
                <Col span={8}>
                  <Form.Item label="Thiết bị tham gia" name="deviceIds">
                    <Select
                      mode="multiple"
                      allowClear
                      maxTagCount="responsive"
                      showSearch
                      placeholder="Chọn thiết bị"
                      optionFilterProp="children"
                      options={
                        devicesData?.map((item: any) => {
                          return { label: item.name, value: item.id };
                        }) || []
                      }
                    />
                  </Form.Item>
                </Col>

                {/* 12 */}
                <Col span={8}>
                  <Form.Item
                    label="Công việc"
                    name="workActivityIds"
                    rules={[
                      { required: true, message: "Vui lòng chọn công việc" },
                    ]}
                  >
                    <Select
                      mode="multiple"
                      allowClear
                      maxTagCount="responsive"
                      showSearch
                      placeholder="Chọn công việc"
                      optionFilterProp="children"
                      options={
                        workActivitiesData?.map((item: any) => {
                          return { label: item.name, value: item.id };
                        }) || []
                      }
                    />
                  </Form.Item>
                </Col>

                {/* 13 */}
                <Col span={24}>
                  <Form.Item label="Mô tả" name="description">
                    <Input.TextArea
                      rows={4}
                      placeholder="Nhập mô tả chi tiết"
                    />
                  </Form.Item>
                </Col>
              </Row>
            </Form>
          </Panel>
        </Collapse>
      </div>

      <div className="mb-6">
        {state?.sections?.map((section: any) => {
          return (
            <DetailSection
              section={section}
              key={section.id}
              dispatch={dispatch}
            />
          );
        })}
      </div>

      <AttachmentFile dispatch={dispatch} state={state} />
    </Drawer>
  );
}
