import {
  Alert,
  App,
  Button,
  Col,
  Form,
  Input,
  Modal,
  Row,
  Space,
  Steps,
} from "antd";
import SignatureCanvas from "react-signature-canvas";
import { lowerFirst } from "lodash";
import { useEffect, useMemo, useRef, useState } from "react";
import { AuthCommonService } from "@/common/authentication";
import { useSendOtp, useVerifyOtp } from "@/services/permit.service";
import axios from "axios";
import RejectModal from "./rejectModal";
import { PERMIT_STATUS } from "@/common/constant";

export default function SignButton({
  section,
  permitId,
  form,
  setSigns,
  sign,
}: any) {
  const { notification, modal } = App.useApp();
  const [openModal, setOpenModal] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [signatureData, setSignatureData] = useState<string | null>(null);
  const [otp, setOtp] = useState<string>("");
  const [openRejectModal, setOpenRejectModal] = useState(false);

  const sendOtpMutation = useSendOtp();
  const verifyOtpMutation = useVerifyOtp();

  const sigPad = useRef<any>(null);

  const handleOpenModal = () => {
    setOpenModal(true);
  };

  const status = Form.useWatch("status", form);

  const disabledButton = useMemo(() => {
    return (
      sign?.signerId !== AuthCommonService.getUser()?.id ||
      sign?.status !== PERMIT_STATUS.PENDING ||
      status !== PERMIT_STATUS.PENDING
    );
  }, [sign?.signerId, sign?.status, status]);

  const handleWarnToSendMail = () => {
    modal.confirm({
      title: "Bạn có xác nhận thông tin trên là chính xác không?",
      content: "Các thao tác không thể hoàn tác",
      onOk: async () => {
        try {
          await sendOtpMutation.mutateAsync();
          setCurrentStep(currentStep + 1);
        } catch (error: unknown) {
          let message = "OTP không hợp lệ";

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
      },
    });
  };

  const handleCloseModal = () => {
    setOpenModal(false);
    setCurrentStep(0);
    setSignatureData(null);
    sigPad.current?.clear();
  };

  const handleSaveSignature = () => {
    if (sigPad.current.isEmpty()) {
      return notification.error({
        message: "Lỗi",
        description: "Vui lòng ký tài liệu",
      });
    }

    const data = sigPad.current.toDataURL("image/png");
    setSignatureData(data);

    console.log("Signature:", data);

    setCurrentStep(1);
  };

  const handleVerifyOtp = async () => {
    try {
      const newOtp = Number(otp);

      if (!newOtp || otp.trim() === "") {
        notification.error({
          message: "Lỗi",
          description: "OTP không hợp lệ",
        });
      }
      const payload = {
        signUrl: signatureData,
        otp: newOtp,
        sectionId: section.id,
        permitId: permitId,
      };

      const res = await verifyOtpMutation.mutateAsync(payload);
      const { sign, permitStatus } = res;

      form.setFieldValue("status", permitStatus);

      notification.success({
        message: "Thành công",
        description: "Xác thực thành công",
        placement: "topRight",
        duration: 3,
      });

      setSigns((prev: any[]) => {
        return prev.map((s: any) => {
          if (s.sectionId === section.id) {
            return { ...s, ...sign };
          }
          return s;
        });
      });

      handleCloseModal();
    } catch (error: unknown) {
      let message = "OTP không hợp lệ";

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

  useEffect(() => {
    if (currentStep === 0 && signatureData && sigPad.current) {
      sigPad.current.fromDataURL(signatureData);
    }
  }, [currentStep, signatureData]);

  return (
    <div>
      <Space>
        <Button
          onClick={handleOpenModal}
          type="primary"
          disabled={disabledButton}
        >
          Ký tên
        </Button>

        <Button
          danger
          onClick={() => setOpenRejectModal(true)}
          disabled={
            sign?.signerId !== AuthCommonService.getUser()?.id ||
            sign?.status !== PERMIT_STATUS.PENDING
          }
        >
          Từ chối
        </Button>
      </Space>

      <Modal
        width={1000}
        open={openModal}
        onCancel={handleCloseModal}
        title={`Ký cho ${lowerFirst(section.name)}`}
        footer={null}
        styles={{ body: { paddingTop: "20px" } }}
      >
        <Steps
          current={currentStep}
          items={[
            { title: "Ký tài liệu" },
            { title: "Xác nhận thông tin" },
            { title: "Nhận OTP & Xác thực" },
          ]}
        />

        <div style={{ marginTop: 40 }}>
          {currentStep === 0 && (
            <div>
              <h2>Bước 1: Ký tài liệu</h2>

              <SignatureCanvas
                ref={sigPad}
                penColor="green"
                canvasProps={{
                  width: 500,
                  height: 200,
                  style: {
                    border: "1px solid black",
                    margin: "0 auto",
                    display: "block",
                  },
                }}
              />
            </div>
          )}

          {/* STEP 2 */}
          {currentStep === 1 && (
            <div className="space-y-4">
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <p className="text-sm font-medium text-green-900">
                  Review Your Signature
                </p>
                <p className="text-xs text-green-700 mt-1">
                  Please verify all information before confirming
                </p>
              </div>

              <div className="flex space-x-8">
                <div className="w-1/2">
                  <h3 className="font-semibold mb-2">Chữ ký</h3>

                  {signatureData ? (
                    <img
                      src={signatureData}
                      alt="signature-preview"
                      style={{
                        border: "1px solid #ccc",
                        marginTop: 4,
                        maxWidth: "100%",
                        borderRadius: "5px",
                      }}
                    />
                  ) : (
                    <div
                      style={{
                        border: "1px dashed #ccc",
                        padding: "20px",
                        textAlign: "center",
                        borderRadius: "5px",
                        color: "#999",
                      }}
                    >
                      Chưa có chữ ký
                    </div>
                  )}
                </div>

                <div className="w-1/2">
                  <h3 className="font-semibold mb-2">Thông tin chung</h3>

                  <div
                    style={{
                      border: "1px solid #ccc",
                      marginTop: 4,
                      padding: 10,
                      borderRadius: "5px",
                    }}
                  >
                    <Row gutter={[16, 8]}>
                      <Col span={8}>Họ và tên:</Col>
                      <Col span={16}>{AuthCommonService.getUser()?.name}</Col>
                    </Row>

                    <Row gutter={[16, 8]}>
                      <Col span={8}>Số điện thoại:</Col>
                      <Col span={16}>{AuthCommonService.getUser()?.phone}</Col>
                    </Row>

                    <Row gutter={[16, 8]}>
                      <Col span={8}>Email:</Col>
                      <Col span={16}>{AuthCommonService.getUser()?.email}</Col>
                    </Row>

                    <Row>
                      <Col span={24}>
                        <Alert
                          message="Vui lòng kiểm tra kỹ thông tin trước khi ký"
                          type="warning"
                          showIcon
                          style={{ marginTop: 8 }}
                        />
                      </Col>
                    </Row>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* STEP 3 */}
          {currentStep === 2 && (
            <div className="mt-4 p-4 border border-gray-200 rounded-xl bg-gray-50">
              <h2 className="text-lg font-semibold mb-2">
                Bước 3: Nhập OTP & xác thực
              </h2>
              <p className="text-sm text-gray-600 mb-3">
                OTP đã được gửi đến{" "}
                <span>{AuthCommonService.getUser()?.email}</span>
              </p>

              <div className="flex justify-center">
                <Input.OTP onChange={(value) => setOtp(value)} />
              </div>

              <p className="text-xs text-slate-500 text-center mt-4">
                Không nhận được mã? Hãy kiểm tra thư rác hoặc yêu cầu gửi lại mã
                mới.
              </p>
            </div>
          )}
        </div>

        {/* FOOTER BUTTONS */}
        <div style={{ marginTop: 30, textAlign: "right" }}>
          {currentStep === 1 && (
            <Button
              style={{ marginRight: 8 }}
              onClick={() => setCurrentStep(currentStep - 1)}
            >
              Quay lại
            </Button>
          )}
          {currentStep == 0 && (
            <Space>
              <Button
                danger
                onClick={() => {
                  sigPad.current.clear();
                  setSignatureData(null);
                }}
              >
                Xóa chữ ký
              </Button>
              <Button
                type="primary"
                style={{ marginLeft: 10 }}
                onClick={handleSaveSignature}
              >
                Lưu chữ ký
              </Button>
            </Space>
          )}

          {currentStep == 1 && (
            <Button
              type="primary"
              onClick={handleWarnToSendMail}
              loading={sendOtpMutation.isPending}
            >
              Tiếp tục
            </Button>
          )}

          {currentStep === 2 && (
            <Button
              type="primary"
              danger
              onClick={handleVerifyOtp}
              loading={verifyOtpMutation.isPending}
            >
              Xác thực OTP
            </Button>
          )}
        </div>
      </Modal>

      <RejectModal
        permitId={permitId}
        section={section}
        openRejectModal={openRejectModal}
        setOpenRejectModal={setOpenRejectModal}
        setSigns={setSigns}
        form={form}
      />
    </div>
  );
}
