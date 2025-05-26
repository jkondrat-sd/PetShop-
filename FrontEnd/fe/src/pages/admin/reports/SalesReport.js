import React, { useEffect, useState } from "react";
import { Card, Row, Col, Statistic, DatePicker, Table, Spin } from "antd";
import { Line } from "@ant-design/charts"; // Nếu dùng Ant Design Charts
// import { LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer } from 'recharts'; // Nếu dùng Recharts
import * as reportService from "~/services/reportService"; // Bạn sẽ tạo file này

const SalesReport = () => {
  const [loading, setLoading] = useState(false);
  const [overview, setOverview] = useState({});
  const [salesData, setSalesData] = useState([]);
  const [topProducts, setTopProducts] = useState([]);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async (range) => {
    setLoading(true);
    try {
      // Gọi API backend lấy dữ liệu tổng quan, sales chart, top sản phẩm
      const overviewRes = await reportService.getSalesOverview(range);
      const salesChartRes = await reportService.getSalesChart(range);
      const topProductsRes = await reportService.getTopProducts(range);

      setOverview(overviewRes.data);
      setSalesData(salesChartRes.data);
      setTopProducts(topProductsRes.data);
    } finally {
      setLoading(false);
    }
  };

  // Cấu hình cho Line chart (Ant Design Charts)
  const lineConfig = {
    data: salesData,
    xField: "date",
    yField: "revenue",
    smooth: true,
    height: 300,
    point: { size: 4, shape: "diamond" },
    tooltip: { showMarkers: true },
  };

  const columns = [
    { title: "Product", dataIndex: "name", key: "name" },
    { title: "Type", dataIndex: "type", key: "type" },
    { title: "Sold", dataIndex: "sold", key: "sold" },
    { title: "Revenue", dataIndex: "revenue", key: "revenue", render: v => `$${v}` },
  ];

  return (
    <Spin spinning={loading}>
      <Card title="Sales Overview" style={{ marginBottom: 24 }}>
        <Row gutter={16}>
          <Col span={8}><Statistic title="Total Revenue" value={overview.totalRevenue} prefix="$" /></Col>
          <Col span={8}><Statistic title="Orders" value={overview.totalOrders} /></Col>
          <Col span={8}><Statistic title="New Customers" value={overview.newCustomers} /></Col>
        </Row>
      </Card>
      <Card title="Revenue by Date" style={{ marginBottom: 24 }}>
        <Line {...lineConfig} />
      </Card>
      <Card title="Top Selling Products">
        <Table dataSource={topProducts} columns={columns} rowKey="id" pagination={false} />
      </Card>
    </Spin>
  );
};

export default SalesReport;
