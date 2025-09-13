export interface DeviceType {
  id: string;
  name: string;
  code: string;
  status: "active" | "inactive" | "maintenance";
  created_at: string;
  updated_at: string;
  action?: any;
}

export interface AddDeviceFormType {
  name: string;
  code: string;
  description?: string;
}
