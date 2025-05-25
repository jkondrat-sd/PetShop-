import { getCookie } from "~/helpers/cookie";

// Phân tích JWT token để lấy quyền người dùng
export const getUserScopes = () => {
  const token = getCookie("token");
  if (!token) return [];
  
  try {
    const tokenPayload = token.split('.')[1];
    const decodedPayload = JSON.parse(atob(tokenPayload));
    
    // Đảm bảo luôn trả về mảng
    if (Array.isArray(decodedPayload.roles)) {
      return decodedPayload.roles;
    }
    if (typeof decodedPayload.roles === "string") {
      return [decodedPayload.roles];
    }
    return [];
  } catch (error) {
    console.error("Không thể giải mã token:", error);
    return [];
  }
};

// Kiểm tra xem người dùng có quyền cụ thể không
export const hasScope = (scopes, requiredScope) => {
  return scopes.includes(requiredScope);
};