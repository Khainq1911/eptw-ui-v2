import { jwtDecode } from "jwt-decode";
import { lowerFirst } from "lodash";

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
      const payload: {
        id: number;
        roleId: number;
        name: string;
        email: string;
        phone: string;
        alias: string;
      } = jwtDecode(accessToken);
      return payload || null;
    }
    return null;
  },
  isAdmin: () => {
    const accessToken = AuthCommonService.getAccessToken();
    if (accessToken) {
      const payload: { roleId: number; name: string; alias: string } =
        jwtDecode(accessToken);
      return lowerFirst(payload.name) === "admin";
    }
    return false;
  },
};
