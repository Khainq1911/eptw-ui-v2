import { useGetListRoles } from "@/services/role.service";
import { useFindUserById, useGetUsers } from "@/services/user.service";
import { Form } from "antd";
import { debounce } from "lodash";
import { useMemo, useState } from "react";

export const useUserPage = () => {
  const [searchForm] = Form.useForm();
  const [filter, setFilter] = useState({
    limit: 5,
    page: 1,
  });
  const [action, setAction] = useState<"create" | "update" | "view" | null>(
    null
  );
  const [openModal, setOpenModal] = useState(false);
  const { data: roleData, isLoading: roleLoading } = useGetListRoles();
  const { data: userData, isLoading: userLoading } = useGetUsers(filter);
  const findUserMutation = useFindUserById();

  const roleOptions = useMemo(() => {
    if (!roleData) return [];
    return roleData.map((role: any) => ({
      label: role.name,
      value: role.id,
    }));
  }, [roleData]);

  const handleResetFields = () => {
    const { limit, page } = filter;
    setFilter({ limit, page });
    searchForm.resetFields();
  };

  const handleSearch = debounce(async () => {
    const value = await searchForm.getFieldsValue();
    setFilter((pre) => ({ ...pre, ...value, page: 1 }));
  }, 200);

  return {
    roleOptions,
    roleLoading,
    searchForm,
    userData,
    userLoading,
    filter,
    setFilter,
    handleResetFields,
    handleSearch,
    openModal,
    action,
    setAction,
    setOpenModal,
    findUserMutation
  };
};
