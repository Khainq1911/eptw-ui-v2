import {
  MailOutlined,
  LockOutlined,
  PhoneOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { Button, Divider, Input } from "antd";
import type React from "react";
import type { SetStateAction } from "react";

export default function Register({
  setAuthOption,
}: {
  setAuthOption: React.Dispatch<SetStateAction<"Login" | "Register">>;
}) {
  return (
    <div className="w-full bg-white rounded-lg p-8">
      <h2 className="text-2xl text-center font-bold">Đăng ký</h2>
      <p className="text-center text-gray-500">
        Tạo tài khoản mới để sử dụng hệ thống
      </p>
      <form className="gap-4 mt-4 flex flex-col">
        <div className="space-y-2">
          <label htmlFor="register-name" className="font-bold">
            Name
          </label>
          <div className="relative">
            <UserOutlined className="!absolute !z-100 !left-3 !top-2.5 !text-gray-400" />
            <Input
              id="register-name"
              type="text"
              placeholder="Nguyễn Văn A"
              className="!pl-10"
              required
            />
          </div>
        </div>

        <div className="space-y-2">
          <label htmlFor="register-email" className="font-bold">
            Email
          </label>
          <div className="relative">
            <MailOutlined className="!absolute !z-100 !left-3 !top-2.5 !text-gray-400" />
            <Input
              id="register-email"
              type="email"
              placeholder="example@eptw.com"
              className="!pl-10"
              required
            />
          </div>
        </div>

        <div className="space-y-2">
          <label htmlFor="register-phone" className="font-bold">
            Phone
          </label>
          <div className="relative">
            <PhoneOutlined className="!absolute !z-100 !left-3 !top-2.5 !text-gray-400" />
            <Input
              id="register-phone"
              type="tel"
              placeholder="0123456789"
              className="!pl-10"
              required
            />
          </div>
        </div>

        <div className="space-y-2">
          <label htmlFor="register-password" className="font-bold">
            Password
          </label>
          <div className="relative">
            <LockOutlined className="!absolute !z-100 !left-3 !top-2.5 !text-gray-400" />
            <Input.Password
              id="register-password"
              placeholder="Mật khẩu"
              className="!pl-10"
              required
            />
          </div>
        </div>

        <div className="space-y-2">
          <label htmlFor="register-confirm-password" className="font-bold">
            Confirm Password
          </label>
          <div className="relative">
            <LockOutlined className="!absolute !z-100 !left-3 !top-2.5 !text-gray-400" />
            <Input.Password
              id="register-confirm-password"
              placeholder="Nhập lại mật khẩu"
              className="!pl-10"
              required
            />
          </div>
        </div>

        <Button type="primary" size="large" htmlType="submit" className="!mt-4">
          Đăng ký
        </Button>

        <Divider />

        <div className="text-center text-sm text-gray-600">
          Đã có tài khoản?
          <Button type="link" onClick={() => setAuthOption("Login")}>
            Đăng nhập ngay
          </Button>
        </div>
      </form>
    </div>
  );
}
