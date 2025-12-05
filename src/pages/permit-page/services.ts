import { getTemplateDdl } from "@/services/template.service";
import { useQuery } from "@tanstack/react-query";
import { Form } from "antd";
import { useCallback, useReducer, useState } from "react";
import { initialState, reducer } from "./reducer";
import { listUsers } from "@/services/user.service";
import {
  useDeletePermit,
  useGetDetailPermit,
  useListPermits,
} from "@/services/permit.service";
import { useGetWorkActivities } from "@/services/work-activity.service";
import { useListAllDevices } from "@/services/device.service";
import { debounce } from "lodash";
import dayjs from "dayjs";

const PERMIT_STATUS = [
  {
    label: "PENDING",
    value: "Pending",
  },
  {
    label: "APPROVED",
    value: "Approved",
  },
  {
    label: "REJECTED",
    value: "Rejected",
  },
  {
    label: "CANCELED",
    value: "Cancelled",
  },
  {
    label: "EXPIRED",
    value: "Expired",
  },
  {
    label: "CLOSED",
    value: "Closed",
  },
];

export const usePermitHooks = () => {
  const [modalForm] = Form.useForm();
  const [searchForm] = Form.useForm();

  const [filter, setFilter] = useState({ page: 1, limit: 5 });
  const [state, dispatch] = useReducer(reducer, initialState);
  const [openModalSelect, setOpenModalSelect] = useState(false);
  const [openCreatePermit, setOpenCreatePermit] = useState(false);
  const { data: listPermits, isLoading } = useListPermits(filter);
  const { data: listTemplates } = useGetTemplateDdl();
  const { data: listUsers } = useGetListUsers();
  const { data: listDevices } = useListAllDevices();
  const { data: listWorkActivities } = useGetWorkActivities();
  const deletePermitMutation = useDeletePermit();
  const getDetailPermitMutation = useGetDetailPermit();

  const handleFilter = debounce((values) => {
    if (values.startTime) {
      values.startTime = dayjs(values.startTime).format("YYYY-MM-DD");
    }

    if (values.endTime) {
      values.endTime = dayjs(values.endTime).format("YYYY-MM-DD");
    }

    setFilter((prev) => ({ ...prev, ...values }));
  }, 300);

  const handleRefreshSearch = () => {
    searchForm.resetFields();
    const values = searchForm.getFieldsValue();
    setFilter((prev) => ({ ...prev, ...values }));
  };

  const handleOpenModalSelect = useCallback(() => {
    setOpenModalSelect(true);
  }, []);
  const handleCloseModalSelect = () => {
    setOpenModalSelect(false);
    modalForm.resetFields();
  };

  const handleOpenCreatePermit = () => {
    setOpenCreatePermit(true);
  };

  const handleCloseCreatePermit = () => {
    setOpenCreatePermit(false);
  };

  const statusColor = {
    Pending: "gold",
    Approved: "green",
    Rejected: "red",
    Cancelled: "volcano",
    Expired: "purple",
    Closed: "blue",
  };

  return {
    PERMIT_STATUS,
    state,
    modalForm,
    openModalSelect,
    openCreatePermit,
    listPermits,
    listTemplates,
    listUsers,
    listWorkActivities,
    listDevices,
    handleFilter,
    isLoading,
    statusColor,
    searchForm,
    dispatch,
    handleRefreshSearch,
    handleOpenCreatePermit,
    handleCloseCreatePermit,
    handleOpenModalSelect,
    handleCloseModalSelect,
    deletePermitMutation,
    getDetailPermitMutation,
  };
};

export const useGetTemplateDdl = () => {
  return useQuery({
    queryKey: ["get-template-ddl"],
    queryFn: getTemplateDdl,
    enabled: true,
  });
};

export const useGetListUsers = () => {
  return useQuery({
    queryKey: ["get-list-users"],
    queryFn: listUsers,
    enabled: true,
  });
};
