import { getTemplateDdl } from "@/services/template.service";
import { useQuery } from "@tanstack/react-query";
import { Form } from "antd";
import {  useReducer, useState } from "react";
import { initialState, reducer } from "./reducer";
import { listUsers } from "@/services/user.service";

export const usePermitHooks = () => {
  const [state, dispatch] = useReducer(reducer, initialState);
  const [openModalSelect, setOpenModalSelect] = useState(false);
  const [openCreatePermit, setOpenCreatePermit] = useState(false);
  const [modalForm] = Form.useForm();

  const handleOpenModalSelect = () => {
    setOpenModalSelect(true);
  };
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

  return {
    state,
    modalForm,
    openModalSelect,
    openCreatePermit,
    dispatch,
    handleOpenCreatePermit,
    handleCloseCreatePermit,
    handleOpenModalSelect,
    handleCloseModalSelect,
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
