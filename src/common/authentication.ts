export const AuthCommonService = {
  getAccessToken: () => {
    const accessToken = localStorage.getItem("accessToken");
    return accessToken ? JSON.parse(accessToken) : null;
  },

  isAuthenticated: () => {
    const accessToken = AuthCommonService.getAccessToken();
    return accessToken ? true : false;
  },

  getRoleId: () => {
    const accessToken = AuthCommonService.getAccessToken();
    if (accessToken) {
      const payload = JSON.parse(atob(accessToken.split(".")[1]));
      return payload.roleId || null;
    }
    return null;
  },
};
