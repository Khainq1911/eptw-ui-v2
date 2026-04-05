import React, { type SetStateAction } from "react";
import { MailOutlined, ArrowLeftOutlined } from "@ant-design/icons";
import { Button, Divider, Input, Result } from "antd";
import type { NotificationInstance } from "antd/es/notification/interface";
import { authHandler } from "../auth-page-service";
import Logo from "@/components/logo";

export default function ForgotPassword({
  setAuthOption,
  notification,
}: {
  setAuthOption: React.Dispatch<SetStateAction<"Login" | "ForgotPassword">>;
  notification: NotificationInstance;
}) {
  const [email, setEmail] = React.useState<string>("");
  const [isSuccess, setIsSuccess] = React.useState<boolean>(false);
  const [loading, setLoading] = React.useState<boolean>(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    setLoading(true);
    try {
      await authHandler.forgotPassword(e, email, notification);
      setIsSuccess(true);
    } catch (err) {
      // Error is handled in authHandler's notification
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full bg-white rounded-2xl p-6 sm:p-8 shadow-xl shadow-blue-900/5">
      <div className="flex flex-col items-center mb-8">
        <div className="transform scale-[1.1] mb-3">
          <Logo />
        </div>
        <h1 className="text-xl font-bold text-gray-800 tracking-wider">E-PTW</h1>
        <p className="text-[10px] text-blue-600 font-bold tracking-[0.2em] uppercase mt-1">
          ELECTRONIC PERMIT TO WORK
        </p>
      </div>

      {!isSuccess ? (
        <>
          <div className="text-center mb-6">
            <h2 className="text-xl font-bold text-gray-800">Quên mật khẩu</h2>
            <p className="text-sm text-gray-500 mt-2">
              Nhập địa chỉ email của bạn để nhận hướng dẫn khôi phục mật khẩu.
            </p>
          </div>

          <form className="gap-4 flex flex-col" onSubmit={handleSubmit}>
            <div className="space-y-2">
              <label htmlFor="forgot-email" className="font-semibold text-gray-700">
                Email
              </label>
              <div className="relative">
                <MailOutlined className="!absolute !z-10 !left-3 !top-2.5 !text-gray-400" />
                <Input
                  id="forgot-email"
                  type="email"
                  placeholder="example@eptw.com"
                  className="!pl-10 !h-10"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </div>

            <Button
              type="primary"
              size="large"
              htmlType="submit"
              loading={loading}
              className="!mt-2 !h-11 font-semibold"
            >
              Gửi yêu cầu
            </Button>
          </form>

          <div className="text-center mt-6">
            <Button
              type="link"
              icon={<ArrowLeftOutlined />}
              onClick={() => setAuthOption("Login")}
              className="text-gray-600 hover:text-indigo-600 flex items-center justify-center mx-auto"
            >
              Quay lại đăng nhập
            </Button>
          </div>
        </>
      ) : (
        <Result
          status="success"
          title={<span className="font-bold text-gray-800">Yêu cầu đã được gửi</span>}
          subTitle={
            <div className="text-gray-500 leading-relaxed">
              Chúng tôi đã gửi hướng dẫn tới: <br />
              <span className="font-bold text-gray-900 underline decoration-green-300 underline-offset-4">{email}</span> <br />
              Nếu không thấy, vui lòng kiểm tra hộp thư **Spam**.
            </div>
          }
          extra={[
            <Button
              type="primary"
              size="large"
              key="login"
              block
              onClick={() => setAuthOption("Login")}
              className="!h-11 font-semibold shadow-lg shadow-blue-900/10"
            >
              Quay lại Đăng nhập
            </Button>,
          ]}
          className="!py-0"
        />
      )}

      <Divider className="!my-6" />

      <div className="text-center text-[10px] text-gray-400">
        © 2024 EPTW. Tất cả quyền được bảo lưu.
      </div>
    </div>
  );
}
