import {
  Table,
  Button,
  Input,
  Space,
  Card,
  Row,
  Col,
  Tag,
  Dropdown,
  Select,
  DatePicker,
} from "antd";
import {
  SearchOutlined,
  UserAddOutlined,
  FilterOutlined,
  MoreOutlined,
} from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import classNames from "classnames/bind";
import { useDispatch } from "react-redux";

import styles from "./Users.module.scss";
import { showAlert } from "~/redux/actions/alert";
import { getUsers } from "~/services/usersService";
import ShowFilters from "~/pages/admin/ShowFilters";

const cx = classNames.bind(styles);

function Users() {
  const navigate = useNavigate();
  const [showFilters, setShowFilters] = useState(false);
  const dispatch = useDispatch();
  const [dataUsers, setDataUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0,
  });

  const [tableParams, setTableParams] = useState({
    page: 0, // Sử dụng 0-based cho API
    size: 10,
  });

  const fetchApiData = async () => {
    try {
      setLoading(true);

      const response = await getUsers(tableParams.page, tableParams.size);

      console.log("users", response);

      if (response.code === 200) {
        setDataUsers(response.result.content || []);
        // Cập nhật tổng số phần tử mà không làm trigger useEffect
        setPagination((prev) => ({
          ...prev,
          total: response.result.totalElements || 0,
        }));
      } else {
        dispatch(showAlert(response.message || "Có lỗi xảy ra", "error"));
      }
    } catch (error) {
      dispatch(
        showAlert("Có lỗi xảy ra khi tải danh sách người dùng!", "error")
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchApiData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleTableChange = (newPagination) => {
    // Cập nhật UI pagination
    setPagination({
      ...pagination,
      current: newPagination.current,
      pageSize: newPagination.pageSize,
    });

    // Cập nhật tableParams để trigger fetch data
    setTableParams({
      page: newPagination.current - 1, // Chuyển đổi từ 1-based sang 0-based
      size: newPagination.pageSize,
    });
  };

  // Table columns configuration
  const columns = [
    {
      title: "STT",
      key: "index",
      width: 80,
      align: "center",
      render: (_, __, index) => index + 1, // Add 1 to make it 1-based indexing
    },
    {
      title: "Ảnh đại diện",
      key: "avatarUrl",
      dataIndex: "avatarUrl",
      width: 150,
      align: "center",
      render: (_, record) => (
        <img
          style={{ width: 50, height: 50, borderRadius: "50%" }}
          src={record.avatarUrl || ""}
          alt="avatar"
          className={cx("avatar-image")}
          onClick={() => window.open(record.avatarUrl, "_blank")}
        />
      ),
    },
    {
      title: "Họ và tên",
      dataIndex: "fullName",
      key: "fullName",
      align: "center",
      sorter: (a, b) => a.fullName.localeCompare(b.fullName),
      sortDirections: ["descend", "ascend"],
      showSorterTooltip: {
        title: "Nhấn để sắp xếp theo tên",
      },
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
      align: "center",
    },
    {
      title: "Số điện thoại",
      dataIndex: "phoneNumber",
      key: "phoneNumber",
      width: 150,
      align: "center",
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
      width: 100,
      align: "center",
      render: (status) => {
        let color = status === "active" ? "success" : "error";

        return (
          <Tag className={cx("status")} color={color}>
            {status === "active" ? "Hoạt động" : "Tạm khóa"}
          </Tag>
        );
      },
    },
    {
      title: "Thao tác",
      key: "action",
      width: 100,
      align: "center",
      render: (_, record) => (
        <Dropdown
          menu={{
            items: [
              {
                key: "1",
                label: "Xem chi tiết",
                onClick: () => navigate(`/admin/users/detail/${record.id}`),
              },
              {
                key: "2",
                label: "Chỉnh sửa",
                onClick: () => handleEdit(record),
              },
              {
                key: "3",
                label: "Đổi mật khẩu",
                onClick: () => handleChangePassword(record),
              },
              {
                type: "divider",
              },
              {
                key: "4",
                label: "Khóa tài khoản",
                danger: true,
                onClick: () => handleLock(record),
              },
            ],
          }}
          trigger={["click"]}
        >
          <Button type="text" icon={<MoreOutlined />} />
        </Dropdown>
      ),
    },
  ];

  const statusOptions = [
    { value: "all", label: "Tất cả trạng thái" },
    { value: "active", label: "Hoạt động" },
    { value: "locked", label: "Tạm khóa" },
  ];

  // Action handlers
  const handleEdit = (record) => {
    console.log("Edit:", record);
    // navigate(`/admin/users/edit/${record.id}`);
  };

  const handleChangePassword = (record) => {
    console.log("Change password:", record);
  };

  const handleLock = (record) => {
    console.log("Lock:", record);
  };

  return (
    <div className={cx("users-container")}>
      <Card title="Danh sách người dùng" className={cx("card-wrapper")}>
        {/* Search and Actions Section */}
        <div className={cx("section")}>
          <Row className={cx("toolbar")} gutter={[16, 16]}>
            <Col xs={24} sm={12} md={8}>
              <Input
                placeholder="Tìm kiếm người dùng"
                prefix={<SearchOutlined />}
                className={cx("search-input")}
              />
            </Col>

            <Col xs={24} sm={12} md={16} className={cx("button-col")}>
              <Space>
                <Button
                  icon={<FilterOutlined rotate={showFilters ? 180 : 0} />}
                  onClick={() => setShowFilters(!showFilters)}
                  type={showFilters ? "primary" : "default"}
                >
                  Lọc
                </Button>
                <Button
                  type="primary"
                  icon={<UserAddOutlined />}
                  onClick={() => navigate("/admin/users/create")}
                >
                  Thêm người dùng
                </Button>
              </Space>
            </Col>
          </Row>
        </div>

        {/* Filter Section */}
        {showFilters && <ShowFilters statusOptions={statusOptions} />}

        {/* Table Section */}
        <div className={cx("section")}>
          <Table
            columns={columns}
            dataSource={dataUsers}
            rowKey="id"
            loading={loading}
            scroll={{ x: 1100 }}
            bordered
            pagination={{
              ...pagination,
              showSizeChanger: true,
              showQuickJumper: true,
              showTotal: (total) => `Tổng số ${total} người dùng`,
            }}
            onChange={handleTableChange}
            className={cx("user-table")}
          />
        </div>
      </Card>
    </div>
  );
}

export default Users;
