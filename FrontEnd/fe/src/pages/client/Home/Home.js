import { useEffect, useState } from "react";
import { Card, Col, Row, Typography, Tooltip, Pagination, Spin } from "antd";
import { EyeOutlined, DownloadOutlined } from "@ant-design/icons";
import classNames from "classnames/bind";
import { useNavigate } from "react-router-dom";

import { getAllDocuments, getTopDocument } from "~/services/documentService";
import styles from "./Home.module.scss";
import LoadingUi from "../Loading";

const { Title } = Typography;
const cx = classNames.bind(styles);

function Home() {
  const [topDocuments, setTopDocuments] = useState([]);
  const [newDocuments, setNewDocuments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 8,
    total: 0,
  });
  const navigate = useNavigate();

  const fetchDocuments = async (page = 1, size = 8) => {
    setLoading(true);
    try {
      // Fetch top documents (no pagination needed)
      const topRes = await getTopDocument();
      if (topRes.code === 200 && Array.isArray(topRes.result)) {
        setTopDocuments(topRes.result);
      }

      // Fetch paginated new documents
      const newRes = await getAllDocuments(page - 1, size);
      if (newRes.code === 200) {
        setNewDocuments(newRes.result.content);
        setPagination((prev) => ({
          ...prev,
          total: newRes.result.totalElements,
        }));
      }
    } catch (error) {
      console.error("Lỗi khi tải dữ liệu:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDocuments(pagination.current, pagination.pageSize);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pagination.current, pagination.pageSize]);

  const handlePageChange = (page, pageSize) => {
    setPagination((prev) => ({
      ...prev,
      current: page,
      pageSize: pageSize,
    }));
  };

  const renderDocuments1 = (docs) => (
    <Row gutter={[16, 16]}>
      {docs.map((doc) => (
        <Col xs={24} sm={12} md={8} lg={6} key={doc.id}>
          <Card
            hoverable
            onClick={() => navigate(`/documents/${doc.id}`)}
            cover={
              <img
                alt={doc.title}
                src={
                  doc.previewUrls?.[0] ||
                  "https://upload.wikimedia.org/wikipedia/commons/1/13/Logo_PTIT_University.png"
                }
                style={{ objectFit: "contain", padding: "20px" }}
              />
            }
          >
            <div className={cx("card-meta")}>
              <Tooltip title={doc.title}>
                <div className={cx("title")}>{doc.title.slice(0, 40)}</div>
              </Tooltip>
              <div className={cx("info")}>
                <span>
                  <EyeOutlined /> {doc.views || 0}
                </span>
                <span>
                  <DownloadOutlined /> {doc.downloads || 0}
                </span>
              </div>
            </div>
          </Card>
        </Col>
      ))}
    </Row>
  );

  const renderDocuments = (docs) => (
    <Row gutter={[16, 16]} justify="center">
      {docs.map((doc) => (
        <Col xs={24} sm={12} md={8} lg={6} key={doc.id}>
          {/* Hiển thị categoryName */}
          <div
            className={cx("category")}
            style={{
              backgroundColor: "rgb(0, 168, 136)", // Màu nền từ dữ liệu
              color: "#fff",
              padding: "4px 8px",
              borderRadius: "4px",
              textAlign: "center",
              marginBottom: "8px",
            }}
          >
            {doc.category.name}
          </div>
          <Card hoverable onClick={() => navigate(`/documents/${doc.id}`)}>
            <div className={cx("card-meta")}>
              <Tooltip title={doc.title}>
                <div className={cx("title")}>{doc.title.slice(0, 40)}</div>
              </Tooltip>
              <div className={cx("info")}>
                <span>
                  <EyeOutlined /> {doc.views || 0}
                </span>
                <span>
                  <DownloadOutlined /> {doc.downloads || 0}
                </span>
              </div>
            </div>
          </Card>
        </Col>
      ))}
    </Row>
  );

  return (
    <div className={cx("home-container")}>
      <div className={cx("HotDocument")}>
        <Title level={3}>📚 Tài liệu nổi bật trong tuần</Title>
        {loading ? (
          <div className={cx("loading-container")}>
            <LoadingUi />
          </div>
        ) : (
          renderDocuments1(topDocuments)
        )}
      </div>

      <div className={cx("NewDocument")}>
        <Title level={3} style={{ marginTop: 32 }}>
          🆕 Tài liệu mới nhất
        </Title>
        {loading ? (
          <div className={cx("loading-container")}>
            <LoadingUi />
          </div>
        ) : (
          <>
            {renderDocuments1(newDocuments)}
            <div className={cx("pagination-container")}>
              <Pagination
                current={pagination.current}
                pageSize={pagination.pageSize}
                total={pagination.total}
                onChange={handlePageChange}
                showSizeChanger={false}
              />
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default Home;
