import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Input, Row, Col, Spin, Pagination, Tabs, Empty } from "antd";
import { searchProducts } from "~/services/searchService";
import classNames from "classnames/bind";
import styles from "./SearchResults.scss";
import PetCard from "../Components/PetCard/PetCard";
import AccessoryCard from "../Components/AccesssoryCard/AccesssoryCard";

const cx = classNames.bind(styles);

function useQuery() {
  return new URLSearchParams(useLocation().search);
}

const PAGE_SIZE = 12;

// Hàm xác định loại thú cưng/phụ kiện
const isPet = (item) => item.petId !== undefined || ["DOG", "CAT"].includes(item.type);
const isAccessory = (item) => item.accessoryId !== undefined || item.type === "accessory";

const SearchResults = () => {
  const query = useQuery();
  const navigate = useNavigate();
  const [searchText, setSearchText] = useState(query.get("query") || "");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [activeTab, setActiveTab] = useState("all");

  // Fetch results when query or page changes
  useEffect(() => {
    const fetchResults = async () => {
      if (!searchText) return;
      setLoading(true);
      const data = await searchProducts(searchText, page - 1, PAGE_SIZE);
      setResults(data);
      setTotal(data.length);
      setLoading(false);
    };
    fetchResults();
  }, [searchText, page]);

  // Update searchText when URL changes
  useEffect(() => {
    setSearchText(query.get("query") || "");
    setPage(1);
  }, [query.get("query")]);

  // Filter by type
  const filteredResults = results.filter(item => {
    if (activeTab === "all") return true;
    if (activeTab === "pet") return isPet(item);
    if (activeTab === "accessory") return isAccessory(item);
    return true;
  });

  // Pagination
  const paginatedResults = filteredResults.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  // Handle search submit
  const handleSearch = (value) => {
    if (!value.trim()) return;
    navigate(`/search?query=${encodeURIComponent(value)}`);
  };

  return (
    <div className={cx("search-results-page")}> 
      <div className={cx("search-header")}> 
        <h1>
          Kết quả tìm kiếm cho: <span className="search-query">{searchText}</span>
        </h1>
        
      </div>
      <div className={cx("search-content")}> 
        <Tabs
          className={cx("product-tabs")}
          activeKey={activeTab}
          onChange={setActiveTab}
          items={[
            { key: "all", label: `Tất cả (${results.length})` },
            { key: "pet", label: `Thú cưng (${results.filter(isPet).length})` },
            { key: "accessory", label: `Phụ kiện (${results.filter(isAccessory).length})` },
          ]}
        />
        <div className={cx("search-results-list")}> 
          {loading ? (
            <div className="loading-container"> <Spin size="large" /> <p>Đang tải kết quả...</p> </div>
          ) : paginatedResults.length > 0 ? (
            <Row gutter={[24, 24]}>
              {paginatedResults.map((item, idx) => (
                <Col xs={24} sm={12} md={8} lg={6} key={item.id || item.petId || item.accessoryId || idx}>
                  {isPet(item) ? (
                    <PetCard
                      id={item.petId}
                      name={item.petName}
                      image={item.thumbnail || (item.images && item.images[0])}
                      gender={item.gender}
                      age={item.age}
                      price={item.unitPrice}
                    />
                  ) : isAccessory(item) ? (
                    <AccessoryCard
                      id={item.accessoryId}
                      name={item.accessoryName}
                      image={item.thumbnail || (item.images && item.images[0])}
                      price={item.unitPrice}
                      stockQuantity={item.stockQuantity}
                    />
                  ) : null}
                </Col>
              ))}
            </Row>
          ) : (
            <div className="no-results"> <Empty description="Không tìm thấy kết quả phù hợp" /> </div>
          )}
          {filteredResults.length > PAGE_SIZE && (
            <div className="pagination-container">
              <Pagination
                current={page}
                total={filteredResults.length}
                pageSize={PAGE_SIZE}
                onChange={setPage}
                showSizeChanger={false}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SearchResults;
