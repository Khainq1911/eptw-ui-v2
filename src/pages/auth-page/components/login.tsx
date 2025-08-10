import React, { type SetStateAction } from "react";
import { LockOutlined, MailOutlined } from "@ant-design/icons";
import { Button, Divider, Input } from "antd";
import { Link, type NavigateFunction } from "react-router-dom";
import type {
  LoginFormType,
  NotificationContextType,
} from "@/common/types/auth.type";
import { handleChangeInput } from "@/common/common-services/single-input-change";
import { authHandler } from "../auth-page-service";

export default function Login({
  setAuthOption,
  navigate,
  notify,
}: {
  setAuthOption: React.Dispatch<SetStateAction<"Login" | "Register">>;
  navigate: NavigateFunction;
  notify: (
    type: NotificationContextType,
    message: string,
    description?: string
  ) => void;
}) {
  const [loginForm, setLoginForm] = React.useState<LoginFormType>({
    username: "",
    password: "",
  });

  return (
    <div className="w-full bg-white rounded-lg p-8">
      <h2 className="text-2xl text-center font-bold">Đăng nhập</h2>
      <p className="text-center text-gray-500">
        Nhập thông tin để truy cập tài khoản của bạn
      </p>

      <form
        className="gap-4 mt-4 flex flex-col"
        onSubmit={(e) => authHandler.login(e, loginForm, navigate, notify)}
      >
        <div className="space-y-2">
          <label htmlFor="login-username" className="font-bold">
            Email
          </label>
          <div className="relative">
            <MailOutlined className="!absolute !z-100 !left-3 !top-2.5 !text-gray-400" />
            <Input
              id="login-username"
              type="text"
              name="username"
              placeholder="example@eptw.com"
              className="!pl-10"
              required
              onChange={(e) =>
                handleChangeInput<LoginFormType>(e, setLoginForm)
              }
            />
          </div>
        </div>

        <div className="space-y-2">
          <label htmlFor="login-password" className="font-bold">
            Password
          </label>
          <div className="relative">
            <LockOutlined className="!absolute !z-100 !left-3 !top-2.5 !text-gray-400" />
            <Input.Password
              id="login-password"
              name="password"
              placeholder="Mật khẩu"
              className="!pl-10"
              required
              onChange={(e) =>
                handleChangeInput<LoginFormType>(e, setLoginForm)
              }
            />
          </div>
        </div>

        <div className="text-black">
          <Link to="/forgot-password" className="float-right">
            Quên mật khẩu?
          </Link>
        </div>

        <Button type="primary" size="large" htmlType="submit">
          Đăng nhập
        </Button>
      </form>

      <Divider />

      <div className="text-center text-sm text-gray-600">
        Chưa có tài khoản?
        <Button type="link" onClick={() => setAuthOption("Register")}>
          Đăng ký ngay
        </Button>
      </div>
    </div>
  );
}
