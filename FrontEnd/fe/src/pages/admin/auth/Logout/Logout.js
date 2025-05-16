import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

import { deleteCookie } from "~/helpers/cookie";

function Logout() {
  const navigate = useNavigate();
  useEffect(() => {
    deleteCookie("token");
    navigate("/admin/auth/login", { replace: true });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return <></>;
}

export default Logout;
