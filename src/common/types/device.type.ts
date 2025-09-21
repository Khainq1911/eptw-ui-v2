export interface DeviceType {
  id: string;
  name: string;
  code: string;
  description?: string;
  status: "active" | "maintain" | "delete";
  createdAt: string;
  updatedAt: string;
  isUsed: boolean;
  //eslint-disable-next-line @typescript-eslint/no-explicit-any
  action?: any;
}

export interface DeviceFormType {
  name: string;
  code: string;
  status?: string;
  description?: string;
}

export interface DeviceActionType {
  isEdit: boolean;
  isView: boolean;
  isCreate: boolean;
}

export interface filterType {
  query?: string;
  status?: string;
  isUsed?: boolean;
  limit: number;
  page: number;
}
