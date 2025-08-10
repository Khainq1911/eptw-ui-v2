export interface LoginFormType {
  username: string;
  password: string;
}

export type RegisterFormType = {
  name: string;
  email: string;
  phone: string;
  password: string;
  confirmPassword: string;
};

export type RegisterDataType = {
  name: string;
  email: string;
  phone: string;
  password: string;
};

export type NotificationContextType = "success" | "error" | "info" | "warning";
