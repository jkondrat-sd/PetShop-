import React, { useEffect, useState } from "react";
import { Card, Row, Col, Statistic, DatePicker, Table, Spin } from "antd";
import { Line } from "@ant-design/charts"; // Nếu dùng Ant Design Charts
// import { LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer } from 'recharts'; // Nếu dùng Recharts
import * as reportService from "~/services/reportService"; // Bạn sẽ tạo file này
import dayjs from "dayjs";

const SalesReport = () => {
  const [loading, setLoading] = useState(false);
  const [overview, setOverview] = useState({});
  const [salesData, setSalesData] = useState([]);
  const [topProducts, setTopProducts] = useState([]);
  const [range, setRange] = useState([dayjs().subtract(1, "month"), dayjs()]);

  useEffect(() => {
    fetchData();
    // eslint-disable-next-line
  }, []);

  const fetchData = async (customRange) => {
    setLoading(true);
    try {
      const params = customRange
        ? {
            from: customRange[0].format("YYYY-MM-DD"),
            to: customRange[1].format("YYYY-MM-DD"),
          }
        : {
            from: range[0].format("YYYY-MM-DD"),
            to: range[1].format("YYYY-MM-DD"),
          };

      const [overviewRes, salesChartRes, topProductsRes] = await Promise.all([
        reportService.getSalesOverview(params),
        reportService.getSalesChart(params),
        reportService.getTopProducts(params),
      ]);

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
    xAxis: { title: { text: "Date" } },
    yAxis: { title: { text: "Revenue" } },
  };

  const columns = [
    { title: "Product", dataIndex: "name", key: "name" },
    { title: "Type", dataIndex: "type", key: "type" },
    { title: "Sold", dataIndex: "sold", key: "sold" },
    { title: "Revenue", dataIndex: "revenue", key: "revenue", render: v => `$${v}` },
  ];

  return (
    <Spin spinning={loading}>
      <Card
        title="Sales Overview"
        extra={
          <DatePicker.RangePicker
            value={range}
            onChange={(dates) => {
              setRange(dates);
              fetchData(dates);
            }}
            allowClear={false}
          />
        }
        style={{ marginBottom: 24 }}
      >
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
