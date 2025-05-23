import AllRoute from "./components/ui/AllRoute";

import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { checkLogin } from './redux/actions/login';
import { getCookie } from './helpers/cookie';
import { getUserInfo } from './services/authService';

function App() {
  const dispatch = useDispatch();

  useEffect(() => {
    const initializeAuth = async () => {
      const token = getCookie('token');
      
      if (token) {
        try {
          // Lấy thông tin người dùng từ localStorage trước
          const storedUser = JSON.parse(localStorage.getItem('userData') || '{}');
          
          // Cập nhật Redux state với dữ liệu từ localStorage
          dispatch(checkLogin(true, storedUser));
          
          // Sau đó gọi API để lấy thông tin mới nhất
          const userInfoResponse = await getUserInfo();
          if (userInfoResponse && userInfoResponse.data) {
            const updatedUserData = userInfoResponse.data;
            
            // Cập nhật lại localStorage và Redux
            localStorage.setItem('userData', JSON.stringify(updatedUserData));
            dispatch(checkLogin(true, updatedUserData));
          }
        } catch (error) {
          console.error('Error initializing auth:', error);
          // Nếu có lỗi, vẫn giữ trạng thái đăng nhập với dữ liệu đã lưu
        }
      } else {
        // Nếu không có token, đảm bảo trạng thái là đăng xuất
        dispatch(checkLogin(false, null));
        localStorage.removeItem('userData');
      }
    };
    
    initializeAuth();
  }, [dispatch]);
  
  return (
    <>
      <AllRoute />
    </>
  );
}

export default App;
