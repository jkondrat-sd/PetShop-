import { useNavigate, useParams } from "react-router-dom";
import { Card, Row, Col, Button, Badge, Tabs, Table, Empty } from "antd";
import {
  MailOutlined,
  CalendarOutlined,
  IdcardOutlined,
  EditOutlined,
  PhoneOutlined,
  FileOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
  DownloadOutlined,
  UserOutlined,
  LockOutlined,
} from "@ant-design/icons";
import { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import classNames from "classnames/bind";

import { showAlert } from "~/redux/actions/alert";
import { getUserById } from "~/services/usersService";
import styles from "./Detail.module.scss";
import { hideLoading, showLoading } from "~/redux/actions/loading";

const cx = classNames.bind(styles);

function Detail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [userData, setUserData] = useState(null);
  const [activeTab, setActiveTab] = useState("1");

  const fetchUserData = async () => {
    try {
      dispatch(showLoading());
      const response = await getUserById(id);
      console.log("User data:", response);
      if (response.code === 200) {
        setUserData(response.result);
      }
      if (response.code !== 200) {
        dispatch(showAlert("Không tìm thấy người dùng!", "error"));
        navigate("/admin/users");
      }
    } catch (error) {
      dispatch(
        showAlert("Có lỗi xảy ra khi tải thông tin người dùng!", "error")
      );
    } finally {
      dispatch(hideLoading());
    }
  };

  useEffect(() => {
    fetchUserData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const renderInfoItem = (icon, label, value) => (
    <div className={cx("info-item")}>
      <span className={cx("info-icon")}>{icon}</span>
      <div className={cx("info-content")}>
        <span className={cx("info-label")}>{label}</span>
        <span className={cx("info-value")}>{value || "--"}</span>
      </div>
    </div>
  );

  // Cấu hình cột cho bảng tài liệu
  const documentsColumns = [
    {
      title: "STT",
      key: "index",
      width: 80,
      align: "center",
      render: (_, __, index) => index + 1,
    },
    {
      title: "Tên tài liệu",
      dataIndex: "title",
      key: "title",
    },
    {
      title: "Ngày tạo",
      dataIndex: "createdAt",
      key: "createdAt",
      render: (date) => new Date(date).toLocaleDateString("vi-VN"),
    },
    {
      title: "Lượt tải",
      dataIndex: "downloadCount",
      key: "downloadCount",
      align: "center",
    },
    {
      title: "Thao tác",
      key: "actions",
      align: "center",
      render: (_, record) => (
        <Button
          type="primary"
          size="small"
          icon={<DownloadOutlined />}
          onClick={() => console.log("Download document:", record.id)}
        >
          Tải xuống
        </Button>
      ),
    },
  ];

  const handleTabChange = (key) => {
    setActiveTab(key);
  };

  const handleChangePassword = () => {
    console.log("Change password for user:", id);
    // Implement logic for changing password here
  };

  const handleLockAccount = () => {
    console.log("Lock/unlock account for user:", id);
    // Implement logic for locking/unlocking account here
  };

  if (!userData) {
    return null; // Or return a loading spinner
  }

  const tabItems = [
    {
      key: "1",
      label: "Thông tin cá nhân",
      children: (
        <div className={cx("personal-info")}>
          <Row gutter={[24, 24]}>
            <Col xs={24} sm={12}>
              {renderInfoItem(
                <IdcardOutlined className={cx("icon-primary")} />,
                "Họ và tên",
                userData?.fullName
              )}
            </Col>
            <Col xs={24} sm={12}>
              {renderInfoItem(
                <MailOutlined className={cx("icon-primary")} />,
                "Email",
                <div className={cx("email-wrapper")}>
                  <span className={cx("email-text")}>{userData?.email}</span>
                  {userData?.emailVerified ? (
                    <Badge
                      className={cx("verification-badge")}
                      count={
                        <CheckCircleOutlined style={{ color: "#52c41a" }} />
                      }
                      title="Đã xác thực"
                    />
                  ) : (
                    <Badge
                      className={cx("verification-badge")}
                      count={
                        <CloseCircleOutlined style={{ color: "#ff4d4f" }} />
                      }
                      title="Chưa xác thực"
                    />
                  )}
                </div>
              )}
            </Col>
            <Col xs={24} sm={12}>
              {renderInfoItem(
                <CalendarOutlined className={cx("icon-primary")} />,
                "Ngày sinh",
                userData?.dob &&
                  new Date(userData.dob).toLocaleDateString("vi-VN")
              )}
            </Col>
            <Col xs={24} sm={12}>
              {renderInfoItem(
                <PhoneOutlined className={cx("icon-primary")} />,
                "Số điện thoại",
                userData?.phoneNumber
              )}
            </Col>
            <Col xs={24} sm={12}>
              {renderInfoItem(
                <FileOutlined className={cx("icon-primary")} />,
                "Số lượt tải tài liệu",
                <span className={cx("download-count")}>
                  {userData?.documentDownload || 0}
                </span>
              )}
            </Col>
            <Col xs={24} sm={12}>
              {renderInfoItem(
                <UserOutlined className={cx("icon-primary")} />,
                "Trạng thái tài khoản",
                <span className={cx("user-status-value", userData?.status)}>
                  {userData?.status === "active" ? "Hoạt động" : "Khóa"}
                </span>
              )}
            </Col>
          </Row>
        </div>
      ),
    },
    {
      key: "2",
      label: "Tài liệu đã tải lên",
      children: (
        <div className={cx("user-documents")}>
          {userData?.documents?.content?.length > 0 ? (
            <Table
              rowKey="id"
              columns={documentsColumns}
              dataSource={userData.documents.content}
              pagination={{
                pageSize: userData.documents.size,
                current: userData.documents.page + 1,
                total: userData.documents.totalElements,
                showSizeChanger: true,
              }}
            />
          ) : (
            <Empty
              image={Empty.PRESENTED_IMAGE_SIMPLE}
              description="Người dùng chưa tải lên tài liệu nào"
            />
          )}
        </div>
      ),
    },
    {
      key: "3",
      label: "Hoạt động gần đây",
      children: (
        <div className={cx("user-activities")}>
          <Empty
            image={Empty.PRESENTED_IMAGE_SIMPLE}
            description="Không có hoạt động gần đây"
          />
        </div>
      ),
    },
  ];

  return (
    <div className={cx("user-detail")}>
      <Card
        title="Thông tin người dùng"
        className={cx("detail-card")}
        extra={
          <Button type="primary" onClick={() => navigate(-1)}>
            Quay lại
          </Button>
        }
      >
        <div className={cx("user-header")}>
          <div className={cx("user-avatar")}>
            <img
              className={cx("avatar-image")}
              src={
                userData?.avatarUrl ||
                "https://upload.wikimedia.org/wikipedia/commons/8/89/Portrait_Placeholder.png"
              }
              alt="Avatar"
            />
          </div>
          <div className={cx("user-basicInfo")}>
            <h2 className={cx("fullName")}>{userData?.fullName}</h2>
            <div className={cx("user-meta")}>
              <span
                className={cx("user-status", {
                  active: userData?.status === "active",
                })}
              >
                {userData?.status === "active" ? "Hoạt động" : "Khóa"}
              </span>
              <span className={cx("user-email")}>
                <MailOutlined /> {userData?.email}
              </span>
            </div>
          </div>
          <div className={cx("quick-actions")}>
            <Button
              icon={<EditOutlined />}
              onClick={() => navigate(`/admin/users/edit/${id}`)}
            >
              Chỉnh sửa
            </Button>
            <Button
              icon={<LockOutlined />}
              onClick={handleLockAccount}
              danger={userData?.status === "active"}
            >
              {userData?.status === "active" ? "Khóa tài khoản" : "Mở khóa"}
            </Button>
          </div>
        </div>

        <div className={cx("user-detail-content")}>
          <Tabs
            activeKey={activeTab}
            onChange={handleTabChange}
            items={tabItems}
            className={cx("detail-tabs")}
          />
        </div>

        <div className={cx("user-actions")}>
          <Button icon={<LockOutlined />} onClick={handleChangePassword}>
            Đổi mật khẩu
          </Button>
        </div>
      </Card>
    </div>
  );
}

export default Detail;
