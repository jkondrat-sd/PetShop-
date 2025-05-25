import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Table, Button, Spin, Space, Modal, message } from 'antd';
import { EditOutlined, DeleteOutlined, UploadOutlined } from '@ant-design/icons';
import { fetchAccessories } from '~/redux/actions/accessoryActions';
import { useNavigate } from 'react-router-dom';
import * as accessoryService from '~/services/accessoryService';
import './AccessoryList.scss';

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
      render: (_, __, index) => (pagination.page || 0) * (pagination.size || 10) + index + 1
    },
    { 
      title: 'Thumbnail', 
      dataIndex: 'thumbnail', 
      key: 'thumbnail',
      render: (thumbnail) => (
        <img src={thumbnail} alt="thumbnail" style={{ width: 50, height: 50, objectFit: 'cover' }} />
      )
    },
    { title: 'Name', dataIndex: 'accessoryName', key: 'accessoryName' },
    { title: 'Category', dataIndex: 'category', key: 'category' },
    { title: 'Price', dataIndex: 'unitPrice', key: 'unitPrice' },
    { title: 'Stock', dataIndex: 'stockQuantity', key: 'stockQuantity' },
    { title: 'Status', dataIndex: 'status', key: 'status' },
    {
      title: 'Actions',
      key: 'actions',
      render: (_, record) => (
        <Space>
          <Button 
            icon={<EditOutlined />} 
            onClick={() => navigate(`/admin/accessories/edit/${record.accessoryId}`)}
          >
            Edit
          </Button>
          <Button 
            icon={<UploadOutlined />}
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
          >
            Upload
          </Button>
          <Button 
            danger 
            icon={<DeleteOutlined />}
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
    <Spin spinning={loading}>
      <Button type="primary" onClick={() => navigate('/admin/accessories/create')} style={{ marginBottom: 16 }}>
        Add Accessory
      </Button>
      <Table
        columns={columns}
        dataSource={list}
        rowKey="accessoryId"
        pagination={{
          current: (pagination.page || 0) + 1,
          pageSize: pagination.size || 10,
          total: pagination.totalElements || 0,
          showSizeChanger: true,
          pageSizeOptions: ['5', '10', '20', '50'],
        }}
        onChange={(paginationConfig) => {
          dispatch(fetchAccessories({
            page: paginationConfig.current - 1,
            size: paginationConfig.pageSize,
          }));
        }}
      />
    </Spin>
  );
};

export default AccessoryList;
