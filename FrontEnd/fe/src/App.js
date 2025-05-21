import AllRoute from "./components/ui/AllRoute";

import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { getCookie } from '~/helpers/cookie';
import { checkLogin } from '~/redux/actions/login';
import { getUserInfo } from '~/services/usersService';

function App() {
  const dispatch = useDispatch();
  
  useEffect(() => {
    // Hàm kiểm tra đăng nhập khi tải ứng dụng
    const checkUserStatus = async () => {
      const token = getCookie('token');
      
      if (token) {
        try {
          // Lấy thông tin từ localStorage trước
          let userData = null;
          const savedUserData = localStorage.getItem('userData');
          if (savedUserData) {
            userData = JSON.parse(savedUserData);
            // Cập nhật trạng thái từ localStorage trước
            dispatch(checkLogin(true, userData));
          }
          
          // Sau đó thử gọi API để lấy thông tin mới nhất
          try {
            const response = await getUserInfo();
            if (response && response.code === 200) {
              // Nếu API trả về thành công, cập nhật lại thông tin
              userData = response.result;
              localStorage.setItem('userData', JSON.stringify(userData));
              dispatch(checkLogin(true, userData));
            }
          } catch (apiError) {
            console.log('Không lấy được thông tin từ API:', apiError);
            // Nếu API lỗi, vẫn giữ trạng thái đăng nhập với dữ liệu từ localStorage
          }
        } catch (error) {
          console.error('Lỗi kiểm tra đăng nhập:', error);
        }
      }
    };
    
    checkUserStatus();
  }, [dispatch]);
  
  return (
    <>
      <AllRoute />
    </>
  );
}

export default App;
