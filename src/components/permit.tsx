import { useGetFreeAndActive } from "@/services/device.service";
import { useGetDetailPermit } from "@/services/permit.service";
import { useGetWorkActivities } from "@/services/work-activity.service";
import { ArrowLeftOutlined, EditOutlined } from "@ant-design/icons";
import {
  Button,
  Col,
  Collapse,
  DatePicker,
  Form,
  Input,
  InputNumber,
  Row,
  Select,
  Spin,
} from "antd";
import dayjs from "dayjs";
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

const { Panel } = Collapse;

export default function PermitComponent() {
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const location = useLocation();
  const getDetailPermitMutation = useGetDetailPermit();
  const [loading, setLoading] = useState(false);
  const { data: devicesData } = useGetFreeAndActive();
  const { data: workActivitiesData } = useGetWorkActivities();

  const [state, setState] = useState(null);

  const handleGetPermit = async () => {
    setLoading(true);
    try {
      const permitId = Number(location?.pathname?.split("/")[2]);

      if (permitId) {
        getDetailPermitMutation.mutateAsync(permitId);
      }
    } catch (error) {
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
      console.log(getDetailPermitMutation.data);
      const values = {
        templateName: payload.template.name,
        companyName: payload.companyName,
        location: payload.location,
        startTime: payload.startTime ? dayjs(payload.startTime) : null,
        endTime: payload.endTime ? dayjs(payload.endTime) : null,
        description: payload.description,
        status: payload.status,
        deviceIds: payload.deviceIds,
        workActivityIds: payload.workActivityIds,
        name: payload.name,
        peopleNumber: payload.peopleNumber,
      };

      form.setFieldsValue(values);

      setState(getDetailPermitMutation.data);
    }
  }, [getDetailPermitMutation.data]);

  return (
    <div
      className="bg-[#F5F7FB] p-6 overflow-y-auto"
      style={{ height: "calc(100vh - 60px)" }}
    >
      {loading || getDetailPermitMutation.isPending ? (
        <Spin />
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

          <div className="w-[90%] mx-auto bg-white p-4 mx-auto rounded-lg shadow-lg mt-6">
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
                      <Form.Item label="Hình thức ký">
                        <Input disabled />
                      </Form.Item>
                    </Col>

                    <Col span={8}>
                      <Form.Item label="Loại mẫu">
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
                        <Input placeholder="Nhập tên giấy phép" />
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
                        <Input placeholder="Nhập tên công ty" />
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
                        <Input placeholder="Nhập địa chỉ" />
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
                        />
                      </Form.Item>
                    </Col>

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
                          placeholder="Nhập mô tả chi tiết"
                        />
                      </Form.Item>
                    </Col>
                  </Row>
                </Form>
              </Panel>
            </Collapse>
          </div>
        </div>
      )}
    </div>
  );
}
