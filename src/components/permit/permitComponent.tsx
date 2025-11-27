import { handleRender } from "@/pages/permit-page/components/field-list";
import { useGetFreeAndActive } from "@/services/device.service";
import { useGetDetailPermit } from "@/services/permit.service";
import { useGetWorkActivities } from "@/services/work-activity.service";
import { ArrowLeftOutlined, EditOutlined } from "@ant-design/icons";
import {
  App,
  Button,
  Col,
  Collapse,
  DatePicker,
  Divider,
  Form,
  Input,
  InputNumber,
  Row,
  Select,
  Spin,
} from "antd";
import dayjs from "dayjs";
import { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import AttachmentFile from "./attachmentFile";
import { formatDate } from "@/common/common-services/formatTime";
import SignButton from "./signButton";

const { Panel } = Collapse;

export default function PermitComponent({
  state,
  dispatch,
  fileState,
  fileDispatch,
}: any) {
  const [form] = Form.useForm();
  const { notification } = App.useApp();
  const navigate = useNavigate();
  const location = useLocation();
  const getDetailPermitMutation = useGetDetailPermit();
  const [loading, setLoading] = useState(false);
  const { data: devicesData } = useGetFreeAndActive();
  const { data: workActivitiesData } = useGetWorkActivities();

  const isDisable = useMemo(() => {
    return location.pathname.split("/")[2] === "view";
  }, [location?.pathname]);

  const handleGetPermit = async () => {
    setLoading(true);
    try {
      const permitId = Number(location?.pathname?.split("/")[3]);

      if (!permitId) throw new Error("Không tồn tại giấy phép này");

      await getDetailPermitMutation.mutateAsync(permitId);
    } catch (error: any) {
      notification.error({
        message: "Lỗi",
        description: error?.message || "Có lỗi xảy ra",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    handleGetPermit();
  }, []);

  useEffect(() => {
    if (getDetailPermitMutation.data) {
      const payload = getDetailPermitMutation.data;

      const workActivityIds = payload.workActivities.map(
        (item: any) => item.id
      );
      const deviceIds = payload.devices.map((item: any) => item.id);

      const values = {
        templateName: payload.template.name,
        companyName: payload.companyName,
        location: payload.location,
        startTime: payload.startTime ? dayjs(payload.startTime) : null,
        endTime: payload.endTime ? dayjs(payload.endTime) : null,
        description: payload.description,
        status: payload.status,
        deviceIds: deviceIds,
        workActivityIds: workActivityIds,
        name: payload.name,
        approvalTypeName: payload.template.approvalType.name,
        templateTypeName: payload.template.templateType.name,
        peopleNumber: payload.peopleNumber,
      };

      form.setFieldsValue(values);

      if (payload.attachments) {
        fileDispatch({
          type: "SET_INIT_DATA",
          payload: payload.attachments.map((item: any) => ({
            ...item,
            createdAt: formatDate(item.createdAt),
          })),
        });
      }

      dispatch({ type: "SET_INIT_DATA", payload: payload.sections });
    }
  }, [getDetailPermitMutation.data]);

  return (
    <div
      className="bg-[#F5F7FB] p-6 overflow-y-auto"
      style={{ height: "calc(100vh - 60px)" }}
    >
      {loading || getDetailPermitMutation.isPending ? (
        <Spin
          size="large"
          style={{
            position: "fixed",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            zIndex: 9999,
          }}
        />
      ) : (
        <div>
          <div className="flex justify-between">
            <Button
              type="primary"
              icon={<ArrowLeftOutlined />}
              onClick={() => navigate("/permit")}
            >
              Trở về
            </Button>
            <Button type="primary" icon={<EditOutlined />}>
              Cập nhật
            </Button>
          </div>

          <div className="w-[70%] mx-auto bg-white p-4 mx-auto rounded-lg shadow-lg mt-6">
            <Collapse
              defaultActiveKey={["1"]}
              expandIconPosition="end"
              className="!bg-white !px-0"
              bordered={false}
            >
              <Panel
                header={<h2 className="font-bold">Thông tin chung</h2>}
                key="1"
              >
                <Form form={form} layout="vertical">
                  <Row gutter={[16, 8]}>
                    <Col span={8}>
                      <Form.Item
                        label="Tên mẫu giấy phép"
                        name={"templateName"}
                      >
                        <Input disabled />
                      </Form.Item>
                    </Col>

                    <Col span={8}>
                      <Form.Item label="Hình thức ký" name="approvalTypeName">
                        <Input disabled />
                      </Form.Item>
                    </Col>

                    <Col span={8}>
                      <Form.Item label="Loại mẫu" name="templateTypeName">
                        <Input disabled />
                      </Form.Item>
                    </Col>

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
                        <Input
                          placeholder="Nhập tên giấy phép"
                          disabled={isDisable}
                        />
                      </Form.Item>
                    </Col>

                    <Col span={8}>
                      <Form.Item
                        label="Trạng thái"
                        name="status"
                        rules={[
                          {
                            required: true,
                            message: "Vui lòng nhập trạng thái",
                          },
                        ]}
                        initialValue={"Pending"}
                      >
                        <Input placeholder="Nhập trạng thái" disabled />
                      </Form.Item>
                    </Col>

                    <Col span={8}>
                      <Form.Item
                        label="Tên công ty"
                        name="companyName"
                        rules={[
                          {
                            required: true,
                            message: "Vui lòng nhập tên công ty",
                          },
                        ]}
                      >
                        <Input
                          placeholder="Nhập tên công ty"
                          disabled={isDisable}
                        />
                      </Form.Item>
                    </Col>

                    <Col span={8}>
                      <Form.Item
                        label="Địa chỉ"
                        name="location"
                        rules={[
                          { required: true, message: "Vui lòng nhập địa chỉ" },
                        ]}
                      >
                        <Input
                          placeholder="Nhập địa chỉ"
                          disabled={isDisable}
                        />
                      </Form.Item>
                    </Col>

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
                          format={"DD-MM-YYYY"}
                          style={{ width: "100%" }}
                          placeholder="Chọn thời gian bắt đầu"
                          disabled={isDisable}
                        />
                      </Form.Item>
                    </Col>

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
                          style={{ width: "100%" }}
                          format={"DD-MM-YYYY"}
                          placeholder="Chọn thời gian kết thúc"
                          disabled={isDisable}
                        />
                      </Form.Item>
                    </Col>

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
                          disabled={isDisable}
                        />
                      </Form.Item>
                    </Col>

                    <Col span={8}>
                      <Form.Item label="Thiết bị tham gia" name="deviceIds">
                        <Select
                          disabled={isDisable}
                          mode="multiple"
                          allowClear
                          maxTagCount="responsive"
                          showSearch
                          placeholder="Chọn thiết bị"
                          optionFilterProp="children"
                          options={[
                            ...(devicesData || []),
                            ...(state?.devices || []),
                          ]?.map((item: any) => {
                            return { label: item.name, value: item.id };
                          })}
                        />
                      </Form.Item>
                    </Col>

                    <Col span={8}>
                      <Form.Item
                        label="Công việc"
                        name="workActivityIds"
                        rules={[
                          {
                            required: true,
                            message: "Vui lòng chọn công việc",
                          },
                        ]}
                      >
                        <Select
                          mode="multiple"
                          allowClear
                          disabled={isDisable}
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

                    <Col span={24}>
                      <Form.Item label="Mô tả" name="description">
                        <Input.TextArea
                          rows={4}
                          disabled={isDisable}
                          placeholder="Nhập mô tả chi tiết"
                        />
                      </Form.Item>
                    </Col>
                  </Row>
                </Form>
              </Panel>
            </Collapse>
          </div>

          {state?.map((section: any) => {
            return (
              <div
                key={section.id}
                className="w-[70%] mx-auto bg-white p-6 mx-auto rounded-lg shadow-lg mt-6"
              >
                <h2 className="font-bold">{section.name}</h2>
                <Divider />

                <div className="space-y-4">
                  {section.fields.map((field: any) => (
                    <div key={field.id}>
                      {handleRender(section, field, dispatch, isDisable)}
                    </div>
                  ))}
                  <Divider />
                  <SignButton section={section} />
                </div>
              </div>
            );
          })}

          <AttachmentFile
            state={fileState}
            dispatch={fileDispatch}
            isDisable={isDisable}
          />
        </div>
      )}
    </div>
  );
}
