import { useGetListRoles } from "@/pages/template-page/template-services";
import { Divider, Select } from "antd";
import { useGetListUsers } from "../services";
import React, { useMemo } from "react";
import FieldsList from "./field-list";

function DetailSection({ section, dispatch }: any) {
  const { data: listRoles } = useGetListRoles();
  const { data: listUsers } = useGetListUsers();

  const roles = useMemo(() => {
    if (!section.sign.required || !listRoles) {
      return;
    }

    return listRoles.filter((item: any) => {
      return section.sign.roleIdAllowed.includes(item.id);
    });
  }, [listRoles]);

  const userOptions = useMemo(() => {
    if (!section.sign.required || !listUsers) {
      return;
    }

    return listUsers.filter((item: any) => {
      return section.sign.roleIdAllowed.includes(item.roleId);
    });
  }, [listUsers]);

  return (
    <div className="w-[70%] bg-white p-6 mx-auto rounded-lg shadow-lg mt-6">
      <h2 className="font-bold">{section.name}</h2>
      <Divider />

      <div className="space-y-4">
        <FieldsList section={section} dispatch={dispatch} />
      </div>

      {section.sign.required ? <Divider /> : null}
      {section.sign.required ? (
        <div>
          <h3 className="font-semibold mb-2">
            Chọn người ký{" "}
            <span>
              {roles
                ? "(" + roles.map((item: any) => item.name).join(", ") + ")"
                : "(Không có quyền)"}
            </span>
          </h3>
          <Select
            placeholder="Chọn người ký"
            options={
              userOptions?.map((item: any) => ({
                label: item.name,
                value: item.id,
              })) || []
            }
            onChange={(value) => {
              dispatch({ type: "SET_SIGNER", payload: { section, value } });
            }}
            showSearch
            allowClear
            style={{ width: "100%" }}
            optionFilterProp="label"
          />
        </div>
      ) : (
        ""
      )}
    </div>
  );
}

export default React.memo(DetailSection);
