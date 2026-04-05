import React, { type SetStateAction } from "react";
import { LockOutlined, MailOutlined } from "@ant-design/icons";
import { Button, Divider, Input } from "antd";
import { type NavigateFunction } from "react-router-dom";
import type { LoginFormType } from "@/common/types/auth.type";
import type { NotificationInstance } from "antd/es/notification/interface";
import { handleChangeInput } from "@/common/common-services/single-input-change";
import { authHandler } from "../auth-page-service";
import Logo from "@/components/logo";

export default function Login({
  setAuthOption,
  navigate,
  notification,
}: {
  setAuthOption: React.Dispatch<SetStateAction<"Login" | "ForgotPassword">>;
  navigate: NavigateFunction;
  notification: NotificationInstance;
}) {
  const [loginForm, setLoginForm] = React.useState<LoginFormType>({
    username: "",
    password: "",
  });
  const [loading, setLoading] = React.useState<boolean>(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    setLoading(true);
    try {
      await authHandler.login(e, loginForm, navigate, notification);
    } catch (err) {
      // Error is handled in authHandler's notification
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full bg-white rounded-2xl p-6 sm:p-8 shadow-xl shadow-blue-900/5">
      <div className="flex flex-col items-center mb-8">
        <div className="transform scale-[1.3] mb-4">
          <Logo />
        </div>
        <h1 className="text-xl font-bold text-gray-800 tracking-wider">E-PTW</h1>
        <p className="text-[10px] text-blue-600 font-bold tracking-[0.2em] uppercase mt-1">
          ELECTRONIC PERMIT TO WORK
        </p>
      </div>
      <form
        className="gap-4 mt-4 flex flex-col"
        onSubmit={handleSubmit}
      >
        <div className="space-y-2">
          <label htmlFor="login-username" className="font-bold text-gray-700">
            Email
          </label>
          <div className="relative">
            <MailOutlined className="!absolute !z-100 !left-3 !top-2.5 !text-gray-400" />
            <Input
              id="login-username"
              type="text"
              name="username"
              placeholder="example@eptw.com"
              className="!pl-10 !h-10"
              required
              onChange={(e) =>
                handleChangeInput<LoginFormType>(e, setLoginForm)
              }
            />
          </div>
        </div>

        <div className="space-y-2">
          <label htmlFor="login-password" className="font-bold text-gray-700">
            Password
          </label>
          <div className="relative">
            <LockOutlined className="!absolute !z-100 !left-3 !top-2.5 !text-gray-400" />
            <Input.Password
              id="login-password"
              name="password"
              placeholder="Mật khẩu"
              className="!pl-10 !h-10"
              required
              onChange={(e) =>
                handleChangeInput<LoginFormType>(e, setLoginForm)
              }
            />
          </div>
        </div>

        <div className="text-black overflow-hidden">
          <Button
            type="link"
            className="!p-0 !h-auto float-right text-gray-500 hover:text-blue-600"
            onClick={() => setAuthOption("ForgotPassword")}
          >
            Quên mật khẩu?
          </Button>
        </div>

        <Button 
          type="primary" 
          size="large" 
          htmlType="submit" 
          loading={loading}
          className="!h-11 font-semibold shadow-lg shadow-blue-900/10"
        >
          Đăng nhập
        </Button>
      </form>

      <Divider className="!my-6" />
      
      <div className="text-center text-[10px] text-gray-400">
        © 2024 EPTW. Tất cả quyền được bảo lưu.
      </div>
    </div>
  );
}
