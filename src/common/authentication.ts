import { jwtDecode } from "jwt-decode";

export const AuthCommonService = {
  getAccessToken: () => {
    const accessToken = localStorage.getItem("accessToken");
    return accessToken 
  },

  isAuthenticated: () => {
    const accessToken = AuthCommonService.getAccessToken();
    return accessToken ? true : false;
  },

  getRoleId: () => {
    const accessToken = AuthCommonService.getAccessToken();
    if (accessToken) {
      const payload: { roleId: number } = jwtDecode(accessToken);
      return payload.roleId || null;
    }
    return null;
  },
};
