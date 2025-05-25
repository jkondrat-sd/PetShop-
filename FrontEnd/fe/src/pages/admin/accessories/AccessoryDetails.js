import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchAccessoryDetail } from '~/redux/actions/accessoryActions';
import { useParams } from 'react-router-dom';
import { Descriptions, Spin } from 'antd';

const AccessoryDetails = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const { detail, detailLoading } = useSelector(state => state.accessory);

  useEffect(() => {
    if (id) dispatch(fetchAccessoryDetail(id));
  }, [dispatch, id]);

  if (detailLoading || !detail) return <Spin />;

  return (
    <Descriptions title="Accessory Details" bordered>
      <Descriptions.Item label="ID">{detail.accessoryId}</Descriptions.Item>
      <Descriptions.Item label="Name">{detail.accessoryName}</Descriptions.Item>
      <Descriptions.Item label="Category">{detail.category}</Descriptions.Item>
      <Descriptions.Item label="Price">{detail.unitPrice}</Descriptions.Item>
      <Descriptions.Item label="Stock">{detail.stockQuantity}</Descriptions.Item>
      <Descriptions.Item label="Status">{detail.status}</Descriptions.Item>
      <Descriptions.Item label="Description">{detail.description}</Descriptions.Item>
      <Descriptions.Item label="Created At">{detail.createdAt}</Descriptions.Item>
      <Descriptions.Item label="Updated At">{detail.updatedAt}</Descriptions.Item>
    </Descriptions>
  );
};

export default AccessoryDetails;
