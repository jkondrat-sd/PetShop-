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
  PlusOutlined,
  FilterOutlined,
  MoreOutlined,
} from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import classNames from "classnames/bind";
import { useDispatch } from "react-redux";

import styles from "./Libraries.module.scss";
import { showAlert } from "~/redux/actions/alert";
import { getAllLibraryOfUser } from "~/services/libraryService";
import ShowFilters from "~/pages/admin/ShowFilters";

const cx = classNames.bind(styles);

const { Search } = Input;

function Library() {
  const navigate = useNavigate();
  const [showFilters, setShowFilters] = useState(false);
  const dispatch = useDispatch();
  const [dataLibraries, setDataLibraries] = useState([]);
  const [loading, setLoading] = useState(false);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 2,
    total: 0,
  });

  const [tableParams, setTableParams] = useState({
    page: 0,
    size: 2,
  });

  const fetchApiData = async () => {
    try {
      setLoading(true);

      const response = await getAllLibraryOfUser(tableParams.page, tableParams.size);

      console.log(response);

      if (response.code === 200) {
        setDataLibraries(response.result.content || []);
        // Cập nhật tổng số phần tử mà không làm trigger useEffect
        setPagination((prev) => ({
          ...prev,
          total: response.result.totalElements || 0,
        }));
      } else {
        dispatch(showAlert(response.message || "Có lỗi xảy ra", "error"));
      }
    } catch (error) {
      dispatch(showAlert("Có lỗi xảy ra khi tải danh sách thư viện!", "error"));
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
      page: newPagination.current - 1,
      size: newPagination.pageSize,
    });
  };

  // Table columns configuration
  const columns = [
    {
      title: "STT",
      key: "index",
      width: 70,
      align: "center",
      render: (_, __, index) => tableParams.page * tableParams.size + index + 1, // Add 1 to make it 1-based indexing
    },
    {
      title: "Tên thư viện",
      dataIndex: "name",
      key: "name",
      sorter: (a, b) => a.name.localeCompare(b.name),
      sortDirections: ["descend", "ascend"],
      showSorterTooltip: {
        title: "Nhấn để sắp xếp theo tên",
      },
    },
    {
      title: "Mô tả",
      dataIndex: "description",
      key: "description",
      ellipsis: true,
      width: 350,
    },
    {
      title: "Số lượng tài liệu",
      dataIndex: "documentCount",
      key: "documentCount",
      width: 150,
      align: "center",
      sorter: (a, b) => a.documentCount - b.documentCount,
      render: (count) => (
        <Tag color={count > 0 ? "blue" : "default"} className={cx("count-tag")}>
          {count} tài liệu
        </Tag>
      ),
    },
    {
      title: "Người tạo",
      key: "user",
      width: 150,
      align: "center",
      render: (_, record) => (
        <Space>
          <img
            style={{ width: 30, height: 30 }}
            src={
              record.user.avatarUser ||
              "https://upload.wikimedia.org/wikipedia/commons/8/89/Portrait_Placeholder.png"
            }
            alt="avatar"
            className={cx("avatar-thumb")}
          />
          <span>{record.user.userName || "Người dùng ẩn danh"}</span>
        </Space>
      ),
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
                onClick: () => navigate(`/admin/libraries/detail/${record.id}`),
              },
              {
                key: "2",
                label: "Chỉnh sửa",
                onClick: () => handleEdit(record),
              },
              {
                key: "3",
                label: "Quản lý tài liệu",
                onClick: () => handleManageDocuments(record),
              },
              {
                type: "divider",
              },
              {
                key: "4",
                label: "Xóa thư viện",
                danger: true,
                onClick: () => handleDelete(record),
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
    { value: "hasDocuments", label: "Có tài liệu" },
    { value: "empty", label: "Chưa có tài liệu" },
  ];

  // Action handlers
  const handleEdit = (record) => {
    console.log("Edit:", record);
    // navigate(`/admin/libraries/edit/${record.id}`);
  };

  const handleManageDocuments = (record) => {
    console.log("Manage documents:", record);
    // navigate(`/admin/libraries/${record.id}/documents`);
  };

  const handleDelete = (record) => {
    console.log("Delete:", record);
  };

  return (
    <div className={cx("library-container")}>
      <Card title="Danh sách thư viện" className={cx("card-wrapper")}>
        {/* Search and Actions Section */}
        <div className={cx("section")}>
          <Row className={cx("toolbar")} gutter={[16, 16]}>
            <Col xs={24} sm={12} md={8}>
              <Search
                placeholder="Tìm kiếm thư viện"
                prefix={<SearchOutlined />}
                className={cx("search-input")}
                onSearch={(value) => console.log("Search:", value)}
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
                  icon={<PlusOutlined />}
                  // onClick={() => navigate("/admin/libraries/create")}
                >
                  Thêm thư viện
                </Button>
              </Space>
            </Col>
          </Row>
        </div>

        {/* Filter Section */}
        {showFilters && (
          <ShowFilters statusOptions={statusOptions} />
        )}

        {/* Table Section */}
          <Table
            columns={columns}
            dataSource={dataLibraries}
            rowKey={(record) => record.id}
            loading={loading}
            scroll={{ x: 1000 }}
            bordered
            pagination={{
              ...pagination,
              showSizeChanger: true,
              showTotal: (total) => `Tổng số ${total} thư viện`,
            }}
            onChange={handleTableChange}
            className={cx("library-table")}
          />
      </Card>
    </div>
  );
}

export default Library;
