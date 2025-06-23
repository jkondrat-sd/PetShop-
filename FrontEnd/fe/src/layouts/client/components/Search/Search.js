import React, { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Input, Spin } from "antd";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch } from "@fortawesome/free-solid-svg-icons";
import classNames from "classnames/bind";
import styles from "./Search.module.scss";
import { searchProducts } from "~/services/searchService";

const cx = classNames.bind(styles);

function Search() {
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [suggestions, setSuggestions] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const navigate = useNavigate();
  const inputRef = useRef();

  // Xử lý khi nhập input
  const handleInputChange = async (e) => {
    const value = e.target.value;
    setQuery(value);
    if (value.trim().length === 0) {
      setSuggestions([]);
      setShowDropdown(false);
      return;
    }
    setLoading(true);
    const results = await searchProducts(value, 0, 5);
    setSuggestions(results);
    setShowDropdown(true);
    setLoading(false);
  };

  // Xử lý khi submit search
  const handleSearch = (value) => {
    if (value.trim().length === 0) return;
    setShowDropdown(false);
    navigate(`/search?query=${encodeURIComponent(value)}`);
  };

  // Xử lý khi chọn gợi ý
  const handleSuggestionClick = (item) => {
    setShowDropdown(false);
    navigate(`/search?query=${encodeURIComponent(item.name || item.title || item.petName || item.accessoryName)}`);
  };

  // Đóng dropdown khi blur
  const handleBlur = () => {
    setTimeout(() => setShowDropdown(false), 150);
  };

  return (
    <div className={cx("search-container")}> 
      <Input
        ref={inputRef}
        className={cx("search-input")}
        placeholder="Tìm thú cưng, phụ kiện, thức ăn..."
        prefix={<FontAwesomeIcon icon={faSearch} style={{ color: "#003459" }} />}
        value={query}
        onChange={handleInputChange}
        onPressEnter={() => handleSearch(query)}
        onFocus={() => query && setShowDropdown(true)}
        onBlur={handleBlur}
        allowClear
      />
      {showDropdown && (
        <div className={cx("search-results")}> 
          {loading ? (
            <div className={cx("loading-container")}> <Spin size="small" /> <span className={cx("loading-text")}>Đang tìm kiếm...</span> </div>
          ) : suggestions.length > 0 ? (
            <div className={cx("results-container")}> 
              {suggestions.map((item, idx) => (
                <div
                  key={item.id || item.petId || item.accessoryId || idx}
                  className={cx("result-item")}
                  onMouseDown={() => handleSuggestionClick(item)}
                >
                  <div className={cx("item-image")}> 
                    <img src={item.thumbnail || item.image} alt={item.name || item.petName || item.accessoryName} />
                  </div>
                  <div className={cx("item-info")}> 
                    <h5>{item.name || item.petName || item.accessoryName}</h5>
                    <p>{item.type || item.itemType || "Sản phẩm"}</p>
                  </div>
                </div>
              ))}
              <div className={cx("view-all")}> 
                <a href={`/search?query=${encodeURIComponent(query)}`}>Xem tất cả kết quả</a>
              </div>
            </div>
          ) : (
            <div className={cx("no-results")}>Không tìm thấy kết quả</div>
          )}
        </div>
      )}
    </div>
  );
}

export default Search;
