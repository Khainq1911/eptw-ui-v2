import { AuthCommonService } from "@/common/authentication";
import { PlusOutlined } from "@ant-design/icons";
import { Button } from "antd";
import SelectTemplateModal from "./components/select-template-modal";
import { usePermitHooks } from "./services";
import CreatePermitDrawer from "./components/create-permit-drawer";

export default function PermitPage() {
  const {
    state,
    modalForm,
    openModalSelect,
    openCreatePermit,
    dispatch,
    handleOpenCreatePermit,
    handleCloseCreatePermit,
    handleCloseModalSelect,
    handleOpenModalSelect,
  } = usePermitHooks();

  return (
    <div>
      <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-slate-800 mb-6 md:mb-2 align-center">
            Trang quản lý giấy phép
          </h1>
          <p>Theo dõi và quản lý danh sách giấy phép</p>
        </div>
        <Button
          disabled={!AuthCommonService.isAdmin()}
          type="primary"
          icon={<PlusOutlined />}
          onClick={handleOpenModalSelect}
        >
          Tạo giấy phép
        </Button>
      </div>

      <SelectTemplateModal
        dispatch={dispatch}
        modalForm={modalForm}
        openModalSelect={openModalSelect}
        handleCloseModalSelect={handleCloseModalSelect}
        handleOpenCreatePermit={handleOpenCreatePermit}
      />

      <CreatePermitDrawer
        state={state}
        dispatch={dispatch}
        openCreatePermit={openCreatePermit}
        handleCloseCreatePermit={handleCloseCreatePermit}
      />
    </div>
  );
}
