export interface DeviceType {
  id: string;
  name: string;
  code: string;
  status: "active" | "inactive" | "maintenance";
  created_at: string;
  updated_at: string;
  action?: any;
}

export interface DeviceFormType {
  name: string;
  code: string;
  description?: string;
}
