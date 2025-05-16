import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { Navigate, Outlet } from "react-router-dom";

import { deleteCookie, getCookie } from "~/helpers/cookie";
import { showAlert } from "~/store/actions/alert";
import { getUserScopes, hasScope } from "~/utils/authUtils";

function PrivateRoutesClient() {
  const dispatch = useDispatch();
  const scopes = getUserScopes();
  const isAdmin = hasScope(scopes, "ROLE_ADMIN");
  const token = getCookie("token");

  useEffect(() => {
    // Nếu là admin hoặc không có token
    if (isAdmin || !token) {
      if (isAdmin) {
        dispatch(showAlert("Tài khoản admin không thể truy cập vào trang này", "error"));
      } else {
        dispatch(showAlert("Bạn cần đăng nhập", "warning"));
      }
      deleteCookie("token");
    }
  }, [isAdmin, token, dispatch]);

  // Nếu là admin hoặc không có token, redirect về trang login
  if (isAdmin || !token) {
    return <Navigate to="/" replace />;
  }

  // Nếu là user bình thường và có token, cho phép truy cập
  return <Outlet />;
}

export default PrivateRoutesClient;