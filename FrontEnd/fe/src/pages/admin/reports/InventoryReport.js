import React, { useEffect, useState } from "react";
import { Card, Table, Spin, Row, Col, message } from "antd";
import { Pie } from "@ant-design/charts";
import * as reportService from "~/services/reportService";

const InventoryReport = () => {
  const [loading, setLoading] = useState(false);
  const [inventoryPie, setInventoryPie] = useState([]);
  const [lowStock, setLowStock] = useState([]);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [pieRes, lowStockRes] = await Promise.all([
        reportService.getInventoryPie(),
        reportService.getLowStockProducts()
      ]);
      
      console.log("Pie Response:", pieRes);
      console.log("Low Stock Response:", lowStockRes);
      
      if (pieRes && pieRes.data) {
        setInventoryPie(pieRes.data);
      } else {
        message.error("Failed to load inventory pie data");
      }
      
      if (lowStockRes && lowStockRes.data) {
        setLowStock(lowStockRes.data);
      } else {
        message.error("Failed to load low stock data");
      }
    } catch (error) {
      console.error("Error fetching inventory data:", error);
      message.error(error.response?.data?.message || "Failed to load inventory data");
    } finally {
      setLoading(false);
    }
  };

  const pieConfig = {
    appendPadding: 10,
    data: inventoryPie,
    angleField: "value",
    colorField: "type",
    radius: 0.8,
    label: {
      content: (datum) => `${datum.type}: ${datum.value} (${(datum.percent * 100).toFixed(0)}%)`
    },
    interactions: [
      { type: "element-active" }
    ]
  };

  const columns = [
    {
      title: "Product",
      dataIndex: "name",
      key: "name"
    },
    {
      title: "Type",
      dataIndex: "type",
      key: "type"
    },
    {
      title: "Stock",
      dataIndex: "stock",
      key: "stock"
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status) => (
        <span style={{ 
          color: status === "Out" ? "red" : status === "Low" ? "orange" : "green" 
        }}>
          {status}
        </span>
      )
    }
  ];

  return (
    <Spin spinning={loading}>
      <Card title="Inventory Overview" style={{ marginBottom: 24 }}>
        <Row gutter={[16, 16]}>
          <Col xs={24} md={12}>
            {inventoryPie.length > 0 ? (
              <Pie {...pieConfig} />
            ) : (
              <div style={{ textAlign: "center", padding: "20px" }}>
                No inventory data available
              </div>
            )}
          </Col>
          <Col xs={24} md={12}>
            <Table 
              dataSource={lowStock} 
              columns={columns} 
              rowKey="id" 
              pagination={false}
              locale={{ emptyText: "No low stock products found" }}
            />
          </Col>
        </Row>
      </Card>
    </Spin>
  );
};

export default InventoryReport;
