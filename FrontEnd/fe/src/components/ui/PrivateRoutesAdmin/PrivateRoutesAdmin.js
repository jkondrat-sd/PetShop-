import { useState, useEffect } from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useDispatch } from "react-redux";

import { getCookie } from "~/helpers/cookie";
import { showAlert } from "~/store/actions/alert";
import { getUserScopes, hasScope } from "~/utils/authUtils";

function PrivateRoutesAdmin() {
  const [isAdmin, setIsAdmin] = useState(null);
  const dispatch = useDispatch();
  const token = getCookie("token");
  
  useEffect(() => {
    if (!token) {
      dispatch(showAlert("Bạn cần đăng nhập để truy cập trang quản trị", "error"));
      setIsAdmin(false);
      return;
    }
    
    const scopes = getUserScopes();
    const hasAdminRole = hasScope(scopes, "ROLE_ADMIN");
    
    if (!hasAdminRole) {
      dispatch(showAlert("Bạn không có quyền truy cập trang quản trị", "error"));
      setIsAdmin(false);
      return;
    }
    
    setIsAdmin(true);
  }, [dispatch, token]);
  
  if (isAdmin === null) {
    return <div>Đang tải...</div>;
  }
  
  return isAdmin ? <Outlet /> : <Navigate to="/admin/auth/login" replace />;
}

export default PrivateRoutesAdmin;