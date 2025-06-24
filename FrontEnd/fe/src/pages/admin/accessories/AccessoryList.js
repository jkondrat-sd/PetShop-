import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Table, Button, Spin, Space, Modal, message, Card, Typography, Row, Col, Tag } from 'antd';
import { EditOutlined, DeleteOutlined, UploadOutlined, PlusOutlined } from '@ant-design/icons';
import { fetchAccessories } from '~/redux/actions/accessoryActions';
import { useNavigate } from 'react-router-dom';
import * as accessoryService from '~/services/accessoryService';
import './AccessoryList.scss';

const { Title } = Typography;

const AccessoryList = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { list, loading, pagination } = useSelector(state => state.accessory);

  useEffect(() => {
    dispatch(fetchAccessories());
  }, [dispatch]);

  const handleDelete = async (id) => {
    try {
      await accessoryService.deleteAccessory(id);
      message.success('Accessory deleted successfully');
      dispatch(fetchAccessories());
    } catch (error) {
      message.error('Failed to delete accessory');
    }
  };

  const handleUploadThumbnail = async (id, file) => {
    try {
      await accessoryService.uploadAccessoryThumbnail(id, file);
      message.success('Thumbnail uploaded successfully');
      dispatch(fetchAccessories());
    } catch (error) {
      message.error('Failed to upload thumbnail');
    }
  };

  const handleUploadImages = async (id, files) => {
    try {
      await accessoryService.uploadAccessoryImages(id, files);
      message.success('Images uploaded successfully');
      dispatch(fetchAccessories());
    } catch (error) {
      message.error('Failed to upload images');
    }
  };

  const columns = [
    {
      title: 'STT',
      key: 'stt',
      align: 'center',
      width: 60,
      render: (_text, _record, index) => (pagination.page || 0) * (pagination.size || 10) + index + 1
    },
    { 
      title: 'Thumbnail', 
      dataIndex: 'thumbnail', 
      key: 'thumbnail',
      render: (thumbnail) => (
        <img src={thumbnail} alt="thumbnail" style={{ width: 50, height: 50, objectFit: 'cover', borderRadius: 8 }} />
      )
    },
    { title: 'Name', dataIndex: 'accessoryName', key: 'accessoryName' },
    { title: 'Category', dataIndex: 'category', key: 'category' },
    {
      title: 'Price',
      dataIndex: 'unitPrice',
      key: 'unitPrice',
      align: 'right',
      render: (price) => price ? <span className="accessory-price">{Number(price).toLocaleString('en-US')}$</span> : <span>-</span>,
    },
    { title: 'Stock', dataIndex: 'stockQuantity', key: 'stockQuantity', align: 'right' },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status) => {
        const color = status === 'active' ? 'success' : 'default';
        return <Tag color={color}>{status}</Tag>;
      },
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_, record) => (
        <Space className="action-buttons">
          <Button 
            type="primary"
            icon={<EditOutlined />} 
            size="small"
            onClick={() => navigate(`/admin/accessories/edit/${record.accessoryId}`)}
            className="edit-button"
          >
            Edit
          </Button>
          <Button 
            icon={<UploadOutlined />}
            size="small"
            onClick={() => {
              Modal.confirm({
                title: 'Upload Images',
                content: (
                  <div className="upload-modal-content">
                    <div className="upload-group">
                      <label>Thumbnail:</label>
                      <input 
                        type="file" 
                        onChange={(e) => {
                          if (e.target.files[0]) {
                            handleUploadThumbnail(record.accessoryId, e.target.files[0]);
                          }
                        }}
                        accept="image/*"
                      />
                    </div>
                    <div className="upload-group">
                      <label>Images:</label>
                      <input 
                        type="file" 
                        multiple 
                        onChange={(e) => {
                          if (e.target.files.length > 0) {
                            handleUploadImages(record.accessoryId, Array.from(e.target.files));
                          }
                        }}
                        accept="image/*"
                      />
                    </div>
                  </div>
                ),
                onOk: () => Modal.destroyAll(),
              });
            }}
            className="upload-button"
          >
            Upload
          </Button>
          <Button 
            danger 
            icon={<DeleteOutlined />}
            size="small"
            className="delete-button"
            onClick={() => {
              Modal.confirm({
                title: 'Are you sure you want to delete this accessory?',
                onOk: () => handleDelete(record.accessoryId),
              });
            }}
          >
            Delete
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <div className="accessory-list-page animate__animated animate__fadeIn">
      <div className="page-header">
        <Row justify="space-between" align="middle">
          <Col>
            <Title level={2} className="page-title">Accessory Management</Title>
          </Col>
          <Col>
            <Button type="primary" icon={<PlusOutlined />} onClick={() => navigate('/admin/accessories/create')} className="add-button">
        Add Accessory
      </Button>
          </Col>
        </Row>
      </div>
      <Card bordered={false} className="list-card">
      <Table
        columns={columns}
        dataSource={list}
        rowKey="accessoryId"
          loading={loading}
        pagination={{
          current: (pagination.page || 0) + 1,
          pageSize: pagination.size || 10,
          total: pagination.totalElements || 0,
          showSizeChanger: true,
          pageSizeOptions: ['5', '10', '20', '50'],
            showTotal: (total, range) => `${range[0]}-${range[1]} of ${total} accessories`,
            onChange: (page, size) => {
              dispatch(fetchAccessories({
                page: page - 1,
                size: size,
              }));
            },
            onShowSizeChange: (page, size) => {
          dispatch(fetchAccessories({
                page: page - 1,
                size: size,
          }));
            },
        }}
          className="data-table"
          scroll={{ x: 1200 }}
      />
      </Card>
    </div>
  );
};

export default AccessoryList;
