import { jwtDecode } from "jwt-decode";

export const AuthCommonService = {
  getAccessToken: () => {
    const accessToken = localStorage.getItem("accessToken");
    return accessToken;
  },

  isAuthenticated: () => {
    const accessToken = AuthCommonService.getAccessToken();
    return accessToken ? true : false;
  },

  getUser: () => {
    const accessToken = AuthCommonService.getAccessToken();
    if (accessToken) {
      const payload: { roleId: number; name: string } = jwtDecode(accessToken);
      return payload || null;
    }
    return null;
  },
  isAdmin: () => {
    const accessToken = AuthCommonService.getAccessToken();
    if (accessToken) {
      const payload: { roleId: number; name: string } = jwtDecode(accessToken);
      return payload.roleId === 4;
    }
    return false;
  },
};
