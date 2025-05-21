import classNames from "classnames/bind";
import { useEffect, useState } from "react";
import {
  Table,
  Button,
  Modal,
  Form,
  Input,
  Space,
  Tooltip,
  Card,
  Row,
  Col,
  Tag,
} from "antd";
import {
  EditOutlined,
  DeleteOutlined,
  FilterOutlined,
  PlusOutlined,
  EyeOutlined,
} from "@ant-design/icons";

import styles from "./Categories.module.scss";
import {
  addCategory,
  deleteCategory,
  getCategories,
  searchCategory,
  updateCategory,
} from "~/services/categoryService";
import { useDispatch } from "react-redux";
import { showAlert } from "~/redux/actions/alert";
import { useNavigate, useSearchParams } from "react-router-dom";
import ShowFilters from "~/pages/admin/ShowFilters";
import SearchUi from "~/pages/admin/Search";

const cx = classNames.bind(styles);

function Categories() {
  const [dataCategories, setDataCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [form] = Form.useForm();
  const [editingId, setEditingId] = useState(null);
  const [showFilters, setShowFilters] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [searchParams] = useSearchParams();

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const response = await getCategories();
      console.log("categories", response);
      if (response.code === 200) {
        setDataCategories(response.result);
      }
    } catch (error) {
      console.error("Error fetching categories:", error);
      dispatch(showAlert("Lấy danh mục thất bại", "error"));
    } finally {
      setLoading(false);
    }
  };

  const fetchSearchCategories = async (keyword) => {
    try {
      setLoading(true);
      const response = await searchCategory(keyword);
      console.log("search categories", response);
      if (response.code === 200) {
        setDataCategories(response.result);
      }
    } catch (error) {
      console.error("Error fetching categories:", error);
      dispatch(showAlert("Lấy danh mục thất bại", "error"));
    } finally {
      setLoading(false);
    }
  };

  const showModal = (record = null) => {
    if (record) {
      form.setFieldsValue({
        name: record.name,
        description: record.description,
      });
      setEditingId(record.id);
    } else {
      form.resetFields();
      setEditingId(null);
    }
    setIsModalOpen(true);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
    form.resetFields();
    setEditingId(null);
  };

  const handleSubmit = async (values) => {
    try {
      if (editingId) {
        const response = await updateCategory(editingId, values);
        if (response.code !== 200) {
          throw new Error("Failed to update category");
        }
        dispatch(showAlert("Danh mục sửa thanh công", "success"));
      } else {
        const response = await addCategory(values);
        console.log("response", response);
        if (response.code !== 200) {
          throw new Error("Failed to add category");
        }
        dispatch(showAlert("Danh mục đã được thêm thành công", "success"));
      }

      fetchCategories(); // Refresh the categories list

      setIsModalOpen(false);
      form.resetFields();
      setEditingId(null);
    } catch (error) {
      console.error("Error saving category:", error);
      dispatch(showAlert("danh mục lưu thất bại ", "error"));
    }
  };

  const handleDelete = async (id) => {
    try {
      Modal.confirm({
        title: "Xác nhận xóa",
        content: "Bạn có chắc chắn muốn xóa danh mục này không?",
        okText: "Xóa",
        okType: "danger",
        cancelText: "Hủy",
        onOk: async () => {
          await deleteCategory(id);
          fetchCategories(); // Refresh the categories list
          dispatch(showAlert("Danh mục đã được xóa thành công", "success"));
        },
      });
    } catch (error) {
      console.error("Error deleting category:", error);
      dispatch(showAlert("Xóa danh mục thất bại", "error"));
    }
  };

  const statusOptions = [
    { value: "all", label: "Tất cả trạng thái" },
    { value: "hasDocuments", label: "Có tài liệu" },
    { value: "empty", label: "Chưa có tài liệu" },
  ];

  const columns = [
    {
      title: "STT",
      key: "index",
      width: 60,
      align: "center",
      render: (_, __, index) => <span>{index + 1}</span>,
    },
    {
      title: "Tên danh mục",
      dataIndex: "name",
      key: "name",
      width: "25%",
      align: "center",
      render: (text) => <span>{text}</span>,
    },
    {
      title: "Mô tả",
      dataIndex: "description",
      key: "description",
      width: "50%",
      align: "center",
      render: (text) => <span>{text}</span>,
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
      width: 100,
      align: "center",
      render: (_, record) => {
        return (
          <Tag
            color={record.status === "active" ? "success" : "error"}
            onClick={() => console.log("Status clicked:", record.status)}
          >
            {record.status === "active" ? "Đang hoạt động" : "Ngừng hoạt động"}
          </Tag>
        );
      },
    },
    {
      title: "Thao tác",
      key: "action",
      width: 130,
      align: "center",
      render: (_, record) => (
        <Space size="middle" className={cx("action-buttons")}>
          <Tooltip title="Xem chi tiết">
            <Button
              icon={<EyeOutlined />}
              onClick={() => navigate(`/admin/categories/detail/${record.id}/documents`)}
            />
          </Tooltip>
          <Tooltip title="Chỉnh sửa">
            <Button icon={<EditOutlined />} onClick={() => showModal(record)} />
          </Tooltip>
          <Tooltip title="Xóa">
            <Button
              danger
              icon={<DeleteOutlined />}
              onClick={() => handleDelete(record.id)}
            />
          </Tooltip>
        </Space>
      ),
    },
  ];

  useEffect(() => {
    const keyword = searchParams.get("keyword") || "";

    if (keyword) {
      fetchSearchCategories(keyword);
    } else {
      fetchCategories();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams]);

  return (
    <Card title="Quản lý danh mục" className={cx("card-wrapper")}>
      <div className={cx("section")}>
        <Row className={cx("toolbar")} gutter={[16, 16]}>
          <Col xs={24} sm={16} md={16}>
            <SearchUi redirect={"/admin/categories"} />
          </Col>
          <Col xs={24} sm={8} md={8} className={cx("button-col")}>
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
                Thêm tài liệu
              </Button>
            </Space>
          </Col>
        </Row>
      </div>

      {/* lọc */}
      {showFilters && <ShowFilters statusOptions={statusOptions} />}
      {/* end lọc */}

      <Table
        loading={loading}
        columns={columns}
        dataSource={dataCategories}
        rowKey="id"
        pagination={{
          pageSize: 5,
          showSizeChanger: true,
          showTotal: (total) => `Tổng số ${total} thư viện`,
        }}
        className={cx("categories-table")}
        bordered
      />

      {isModalOpen && (
        <Modal
          title={editingId ? "Chỉnh sửa danh mục" : "Thêm danh mục mới"}
          open={isModalOpen}
          onCancel={handleCancel}
          footer={null}
          destroyOnClose
        >
          <Form
            form={form}
            layout="vertical"
            onFinish={handleSubmit}
            className={cx("category-form")}
            preserve={false}
          >
            <Form.Item
              name="name"
              label="Tên danh mục"
              rules={[
                { required: true, message: "Vui lòng nhập tên danh mục" },
              ]}
            >
              <Input placeholder="Nhập tên danh mục" />
            </Form.Item>

            <Form.Item name="description" label="mô tả danh mục">
              <Input.TextArea rows={4} placeholder="Nhập mô tả danh mục" />
            </Form.Item>

            <div className={cx("form-actions")}>
              <Button type="primary" htmlType="submit">
                {editingId ? "Cập nhập" : "Thêm"}
              </Button>
              <Button className={cx("cancel")} onClick={handleCancel}>
                Hủy
              </Button>
            </div>
          </Form>
        </Modal>
      )}
    </Card>
  );
}

export default Categories;
