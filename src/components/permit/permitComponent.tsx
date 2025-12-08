import { handleRender } from "@/pages/permit-page/components/field-list";
import { useGetFreeAndActive } from "@/services/device.service";
import { useGetDetailPermit, useUpdatePermit } from "@/services/permit.service";
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
  Space,
  Spin,
} from "antd";
import dayjs from "dayjs";
import { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import AttachmentFile from "./attachmentFile";
import { formatDate } from "@/common/common-services/formatTime";
import axios from "axios";
import ErrorPage from "@/pages/error-page";
import SignButton from "./signButton";
import { uploadUpdatedFiles } from "@/services/upload-file.service";
import { PERMIT_STATUS } from "@/common/constant";

const { Panel } = Collapse;

export default function PermitComponent({
  state,
  dispatch,
  fileState,
  fileDispatch,
}: any) {
  const [form] = Form.useForm();
  const status = Form.useWatch("status", form);
  const { notification, modal } = App.useApp();

  const navigate = useNavigate();
  const location = useLocation();

  const [loading, setLoading] = useState(false);
  const [signs, setSigns] = useState<any[]>([]);
  const [errorStatus, setErrorStatus] = useState<"404" | "500" | "403" | "503">(
    "404"
  );

  const getStatusBadge = (status: any) => {
    switch (status) {
      case "Approved":
        return "bg-green-100 text-green-700 border border-green-300";
      case "Rejected":
        return "bg-red-100 text-red-700 border border-red-300";
      case "Pending":
        return "bg-yellow-100 text-yellow-700 border border-yellow-300";
      default:
        return "bg-gray-100 text-gray-700 border border-gray-300";
    }
  };

  const getDetailPermitMutation = useGetDetailPermit();
  const updatePermitMutation = useUpdatePermit();
  const { data: devicesData } = useGetFreeAndActive();
  const { data: workActivitiesData } = useGetWorkActivities();

  const permitId = useMemo(
    () => Number(location?.pathname?.split("/")[3]),
    [location?.pathname]
  );

  const deviceOptions = useMemo(() => {
    const merged = [
      ...(devicesData ?? []),
      ...(getDetailPermitMutation?.data?.devices ?? []),
    ];

    const unique = Array.from(
      new Map(merged.map((d: any) => [d.id, d])).values()
    );

    return unique.map((item: any) => ({
      label: item.name,
      value: item.id,
    }));
  }, [devicesData, getDetailPermitMutation?.data]);

  const disabledSignedSectionIds = useMemo(() => {
    return signs
      .filter((s: any) => s.status === "Signed")
      .map((s: any) => s.sectionId);
  }, [signs]);

  const isDisabled = useMemo(() => {
    return (
      location.pathname.split("/")[2] === "view" ||
      form.getFieldValue("status") !== PERMIT_STATUS.PENDING
    );
  }, [location?.pathname, form.getFieldValue("status")]);

  const handleGetPermit = async () => {
    setLoading(true);
    try {
      if (!permitId) throw new Error("Không tồn tại giấy phép này");

      await getDetailPermitMutation.mutateAsync({
        id: permitId,
        action: location.pathname.split("/")[2],
      });
    } catch (error: unknown) {
      let message = "Có lỗi xảy ra";

      if (axios.isAxiosError(error)) {
        message = error.response?.data?.message || error.message || message;

        const statusCode = error.response?.status;

        if (statusCode === 403) setErrorStatus("403");
        else if (statusCode === 404) setErrorStatus("404");
        else if (statusCode === 500) setErrorStatus("500");
        else setErrorStatus("503");
      } else if (error instanceof Error) {
        message = error.message;
        setErrorStatus("500");
      }

      notification.error({
        message: "Lỗi",
        description: message,
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    handleGetPermit();
  }, []);

  const getSectionSign = (sectionId: number) => {
    return signs.find((s: any) => s.sectionId === sectionId);
  };

  useEffect(() => {
    if (getDetailPermitMutation.data) {
      const payload = getDetailPermitMutation.data;

      const workActivityIds = payload.workActivities.map(
        (item: any) => item.id
      );
      const deviceIds = payload.devices.map((item: any) => item.id);

      const values = {
        id: payload.id,
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

      if (payload.signs) {
        setSigns(payload.signs);
      }

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

  const handleOk = async () => {
    try {
      const values = await form.validateFields();
      console.log("payload", {
        ...values,
        sections: state,
        id: permitId,
        attachments: fileState,
      });

      const attachments = await uploadUpdatedFiles(fileState);
      const res = await updatePermitMutation.mutateAsync({
        ...values,
        sections: state,
        id: permitId,
        attachments: attachments,
      });

      const attachmentFiles = attachments.filter((item: any) => item.id);

      fileDispatch({
        type: "SET_INIT_DATA",
        payload: [...attachmentFiles, ...res.attachments],
      });

      notification.success({
        message: "Thành công",
        description: "Cập nhật giấy phép thành công",
      });
    } catch (error) {
      let message = "Cập nhật giấy phép thất bại";

      if (axios.isAxiosError(error)) {
        message = error.response?.data?.message || error.message || message;
      } else if (error instanceof Error) {
        message = error.message;
      }
      notification.error({
        message: "Lỗi",
        description: message,
      });
    }
  };

  const handleUpdatePermit = () =>
    modal.confirm({
      title: "Xác nhận cập nhật giấy phép",
      content: "Bạn có chắc chắn muốn cập nhật giấy phép này không?",
      okText: "Xác nhận",
      cancelText: "Hủy",
      onOk: handleOk,
    });

  return (
    <div
      className={`bg-[#F5F7FB] ${
        !getDetailPermitMutation.isError ? "p-6" : ""
      }  overflow-y-auto`}
      style={{ height: "calc(100vh - 60px)" }}
    >
      {getDetailPermitMutation.isError && <ErrorPage status={errorStatus} />}

      {(loading || getDetailPermitMutation.isPending) && (
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
      )}

      {!loading &&
        !getDetailPermitMutation.isPending &&
        !getDetailPermitMutation.isError && (
          <div>
            {/* Header */}
            <div className="flex justify-between">
              <Button
                type="primary"
                icon={<ArrowLeftOutlined />}
                onClick={() => navigate("/permit")}
              >
                Trở về
              </Button>
              <Space>
                {(status === PERMIT_STATUS.APPROVED ||
                  status === PERMIT_STATUS.PENDING) && <Button>Từ chối</Button>}
                {status === PERMIT_STATUS.APPROVED && (
                  <Button>Bắt đầu công việc</Button>
                )}
                {status === PERMIT_STATUS.INPROGRESS && (
                  <Button>Kết thúc công việc</Button>
                )}
                {PERMIT_STATUS.COMPLETED === status && (
                  <Button>Đóng giấy phép</Button>
                )}
                {status === PERMIT_STATUS.PENDING && (
                  <Button
                    disabled={isDisabled}
                    type="primary"
                    icon={<EditOutlined />}
                    onClick={handleUpdatePermit}
                  >
                    Cập nhật
                  </Button>
                )}
              </Space>
            </div>

            {/* Thông tin chung */}
            <div className="w-[70%] mx-auto bg-white p-4 rounded-lg shadow-lg mt-6">
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
                      {/* Các input */}
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
                            disabled={isDisabled}
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
                          initialValue={PERMIT_STATUS.PENDING}
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
                            disabled={isDisabled}
                          />
                        </Form.Item>
                      </Col>

                      <Col span={8}>
                        <Form.Item
                          label="Địa chỉ"
                          name="location"
                          rules={[
                            {
                              required: true,
                              message: "Vui lòng nhập địa chỉ",
                            },
                          ]}
                        >
                          <Input
                            placeholder="Nhập địa chỉ"
                            disabled={isDisabled}
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
                            disabled={isDisabled}
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
                            disabled={isDisabled}
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
                            {
                              type: "number",
                              min: 1,
                              message: "Phải lớn hơn 0",
                            },
                          ]}
                        >
                          <InputNumber
                            style={{ width: "100%" }}
                            placeholder="Nhập số lượng"
                            disabled={isDisabled}
                          />
                        </Form.Item>
                      </Col>

                      <Col span={8}>
                        <Form.Item label="Thiết bị tham gia" name="deviceIds">
                          <Select
                            disabled={isDisabled}
                            mode="multiple"
                            allowClear
                            maxTagCount="responsive"
                            showSearch
                            placeholder="Chọn thiết bị"
                            optionFilterProp="label"
                            options={deviceOptions}
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
                            disabled={isDisabled}
                            maxTagCount="responsive"
                            showSearch
                            placeholder="Chọn công việc"
                            optionFilterProp="label"
                            options={
                              workActivitiesData?.map((item: any) => ({
                                label: item.name,
                                value: item.id,
                              })) || []
                            }
                          />
                        </Form.Item>
                      </Col>

                      <Col span={24}>
                        <Form.Item label="Mô tả" name="description">
                          <Input.TextArea
                            rows={4}
                            disabled={isDisabled}
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
              const sign = getSectionSign(section.id);
              return (
                <div
                  key={section.id}
                  className="w-[70%] mx-auto bg-white p-6 rounded-lg shadow-lg mt-6"
                >
                  <h2 className="font-bold">{section.name}</h2>
                  <Divider />

                  <div className="space-y-4">
                    {section.fields.map((field: any) => (
                      <div key={field.id}>
                        {handleRender(
                          section,
                          field,
                          dispatch,
                          isDisabled ||
                            disabledSignedSectionIds.includes(section.id)
                        )}
                      </div>
                    ))}

                    {sign && (
                      <>
                        <Divider />
                        <div className="flex space-x-8 bg-white">
                          <div className="w-1/2">
                            <h3 className="font-semibold mb-2">
                              Thông tin người ký
                            </h3>
                            {sign.signer ? (
                              <div className="border border-gray-300 mt-1 max-w-full rounded-md p-4 space-y-1">
                                <p>
                                  <strong className="mr-1">Họ và tên:</strong>
                                  {sign.signer.name}
                                </p>
                                <p>
                                  <strong className="mr-1">Email:</strong>
                                  {sign.signer.email}
                                </p>
                                <p>
                                  <strong className="mr-1">
                                    Số điện thoại:
                                  </strong>
                                  {sign.signer.phone}
                                </p>
                                <p>
                                  <strong className="mr-1">
                                    Trạng thái ký:
                                  </strong>
                                  <span
                                    className={`px-2 py-1 rounded-md text-sm font-medium ${getStatusBadge(
                                      sign.status
                                    )}`}
                                  >
                                    {sign.status}
                                  </span>
                                </p>
                                {sign.status === "Signed" && (
                                  <p>
                                    <strong className="mr-1">Ngày ký:</strong>
                                    {new Date(sign.signedAt).toLocaleString()}
                                  </p>
                                )}
                              </div>
                            ) : (
                              <p style={{ color: "#999" }}>
                                Chưa có thông tin người ký
                              </p>
                            )}
                          </div>

                          <div className="w-1/2">
                            <h3 className="font-semibold mb-2">Chữ ký</h3>

                            {sign.status === "Rejected" ? (
                              <div className="p-3 border border-red-300 rounded bg-red-50">
                                <p className="text-red-600 font-semibold">
                                  Đã từ chối
                                </p>
                                {sign.updatedAt && (
                                  <p className="text-sm">
                                    <strong className="mr-1">Thời gian:</strong>
                                    {formatDate(sign.updatedAt)}
                                  </p>
                                )}
                                {sign.reason && (
                                  <p className="text-sm">
                                    <strong>Lý do:</strong> {sign.reason}
                                  </p>
                                )}
                              </div>
                            ) : sign.signUrl ? (
                              <img
                                src={sign.signUrl}
                                alt="signature-preview"
                                style={{
                                  border: "1px solid #ccc",
                                  marginTop: 4,
                                  maxWidth: "100%",
                                  borderRadius: "5px",
                                }}
                              />
                            ) : (
                              <SignButton
                                sign={sign}
                                form={form}
                                section={section}
                                permitId={permitId}
                                setSigns={setSigns}
                              />
                            )}
                          </div>
                        </div>
                      </>
                    )}
                  </div>
                </div>
              );
            })}

            <AttachmentFile
              state={fileState}
              dispatch={fileDispatch}
              isDisabled={isDisabled}
            />
          </div>
        )}
    </div>
  );
}
