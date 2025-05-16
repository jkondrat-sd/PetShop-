import { Navigate, Outlet } from "react-router-dom";

import config from "~/config";
import { getCookie } from "~/helpers/cookie";
import { getUserScopes, hasScope } from "~/utils/authUtils";

function PrivateRoutesAdmin() {
  const token = getCookie("token");
  const scopes = getUserScopes();
  // const token = true;
  const check = hasScope(scopes, "ROLE_ADMIN");

  return (
    <>{check ? <Outlet /> : <Navigate to={'/admin/auth/login'} />}</>
  );
}

export default PrivateRoutesAdmin;
