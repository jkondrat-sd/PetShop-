import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { Input, Dropdown, Avatar, Space, Button, Menu } from 'antd';
import { 
  SearchOutlined, 
  ShoppingCartOutlined, 
  UserOutlined,
  LogoutOutlined,
  ProfileOutlined
} from '@ant-design/icons';
// import { deleteCookie } from '../../../../utils/cookie';
// import { checkLogin } from '../../../../redux/actions/loginAction';
import styles from './Header.module.scss';
import logoImg from '../../../../assets/images/logoPOMPOM-removebg.png';

const { Search } = Input;

function Header() {
  const { isLoggedIn, userData } = useSelector((state) => state.loginReducer);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // const handleLogout = () => {
  //   deleteCookie("token");
  //   dispatch(checkLogin(false));
  //   navigate("/");
  //   window.location.reload();
  // };
  
  const userMenu = (
    <Menu
      items={[
        {
          key: '1',
          icon: <ProfileOutlined />,
          label: <Link to="/profile">Profile</Link>,
        },
        {
          key: '2',
          icon: <LogoutOutlined />,
          // label: <a onClick={handleLogout}>Logout</a>,
        },
      ]}
    />
  );

  return (
    <header className={styles.header}>
      <div className="container-fluid">
        <div className="row">
          <div className={`${styles['main-header']} col-12`}>
            <div className={styles['inner-logo']}>
              <Link to="/">
                <img src={logoImg} alt="logo" />
              </Link>
            </div>
            
            <div className={styles['main-menu']}>
              <ul className={styles.nav}>
                <li className={styles['nav-item']}>
                  <Link to="/" className={styles['nav-link']}>Home</Link>
                </li>
                <li className={styles['nav-item']}>
                  <Link to="/dogs" className={styles['nav-link']}>Dogs</Link>
                </li>
                <li className={styles['nav-item']}>
                  <Link to="/accessories" className={styles['nav-link']}>Accessories</Link>
                </li>
                <li className={styles['nav-item']}>
                  <Link to="/blog" className={styles['nav-link']}>Blog</Link>
                </li>
                <li className={styles['nav-item']}>
                  <Link to="/contact" className={styles['nav-link']}>Contact</Link>
                </li>
              </ul>
            </div>
            
            <div className={styles['header-right']}>
              <div className={styles.item}>
                <div className={styles['box-input']}>
                  <Search
                    placeholder="Search something here!"
                    bordered={false}
                    onSearch={value => console.log(value)}
                  />
                </div>
              </div>
              <div className={styles.item}>
                <Link to="/cart">
                  <ShoppingCartOutlined style={{ fontSize: '24px' }} />
                </Link>
              </div>
              <div className={styles.item}>
                {isLoggedIn ? (
                  <Dropdown overlay={userMenu} placement="bottomRight">
                    <Space>
                      <Avatar 
                        src={userData?.avatar} 
                        icon={!userData?.avatar && <UserOutlined />}
                      />
                      <span className={styles.username}>{userData?.fullName || "User"}</span>
                    </Space>
                  </Dropdown>
                ) : (
                  <Link to="/login">
                    <Button type="text" icon={<UserOutlined />}>Login</Button>
                  </Link>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}

export default Header;