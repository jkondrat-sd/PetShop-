import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import classNames from "classnames/bind";
import styles from "./Category.module.scss";
import {
  getCategoryById,
  getCategoryDocument,
} from "~/services/categoryService";
import { Card, Col, Pagination, Row, Tooltip } from "antd";
import { EyeOutlined, DownloadOutlined } from "@ant-design/icons";
import LoadingUi from "../Loading";

const cx = classNames.bind(styles);

function CategoryPage() {
  const { categoryId } = useParams();
  const [categoryName, setCategoryName] = useState("");
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 8,
    total: 0,
  });
  const navigate = useNavigate();

  const fetchData = async (page = 1, size = 8) => {
    setLoading(true);
    try {
      const resCategory = await getCategoryById(Number(categoryId));
      if (resCategory.code === 200 && resCategory.result) {
        setCategoryName(resCategory.result.name);
      } else {
        setError("Không tìm thấy danh mục");
        return;
      }

      const resDocs = await getCategoryDocument(
        Number(categoryId),
        page - 1,
        size
      );
      if (resDocs.code === 200 && resDocs.result?.content) {
        setDocuments(resDocs.result.content);
        setPagination((prev) => ({
          ...prev,
          total: resDocs.result.totalElements,
        }));
      } else {
        setDocuments([]);
      }
    } catch (err) {
      console.error(err);
      setError("Lỗi khi tải danh mục hoặc tài liệu");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData(pagination.current, pagination.pageSize);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [categoryId, pagination.current, pagination.pageSize]);

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

  return (
    <div className={cx("category-page")}>
      <h1 className={cx("category-title")}>{categoryName}</h1>
      {loading ? (
        <div className={cx("loading-container")}>
          <LoadingUi />
        </div>
      ) : error ? (
        <p className={cx("error")}>{error}</p>
      ) : (
        <>
          <div>{renderDocuments1(documents)}</div>
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
  );
}

export default CategoryPage;
