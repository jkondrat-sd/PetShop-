// import React, { useState, useEffect } from 'react';
// import { useLocation, Link } from 'react-router-dom';
// import { Row, Col, Empty, Spin, Pagination, Breadcrumb, Tabs, Radio, Input, Button, Select } from 'antd';
// import { RightOutlined, SearchOutlined, FilterOutlined } from '@ant-design/icons';
// import Layout from '~/layouts/client/DefaultLayout';
// import { searchProducts } from '~/services/searchService';
// import PetCard from '~/pages/client/Components/PetCard/PetCard';
// import AccessoryCard from '~/pages/client/Components/AccesssoryCard/AccesssoryCard';
// import './SearchResult.scss';

// const { TabPane } = Tabs;
// const { Option } = Select;

// function SearchResults() {
//   // Lấy query params từ URL
//   const location = useLocation();
//   const queryParams = new URLSearchParams(location.search);
//   const searchQuery = queryParams.get('q') || '';
  
//   // Các state cần thiết
//   const [loading, setLoading] = useState(true);
//   const [results, setResults] = useState([]);
//   const [currentPage, setCurrentPage] = useState(1);
//   const [totalItems, setTotalItems] = useState(0);
//   const [pageSize, setPageSize] = useState(12);
//   const [activeTab, setActiveTab] = useState('all');
  
//   // State cho bộ lọc
//   const [filters, setFilters] = useState({
//     type: 'all', // 'all', 'pet', 'accessory'
//     minPrice: '',
//     maxPrice: '',
//     sortBy: 'relevance' // 'relevance', 'price-low', 'price-high', 'newest'
//   });
  
//   // Lấy kết quả tìm kiếm
//   useEffect(() => {
//     const fetchSearchResults = async () => {
//       if (!searchQuery.trim()) {
//         setResults([]);
//         setTotalItems(0);
//         setLoading(false);
//         return;
//       }
      
//       setLoading(true);
//       try {
//         // Áp dụng các bộ lọc
//         const filterParams = {};
//         if (activeTab !== 'all') {
//           filterParams.type = activeTab;
//         }
//         if (filters.minPrice) {
//           filterParams.minPrice = parseFloat(filters.minPrice);
//         }
//         if (filters.maxPrice) {
//           filterParams.maxPrice = parseFloat(filters.maxPrice);
//         }
//         if (filters.sortBy) {
//           filterParams.sortBy = filters.sortBy;
//         }
        
//         const data = await searchProducts(
//           searchQuery,
//           currentPage - 1, // API sử dụng index bắt đầu từ 0
//           pageSize,
//           filterParams
//         );
        
//         setResults(data);
//         setTotalItems(data.length); // Lý tưởng nhất là lấy từ dữ liệu phân trang từ API
        
//       } catch (error) {
//         console.error('Lỗi khi tìm kiếm:', error);
//         setResults([]);
//         setTotalItems(0);
//       } finally {
//         setLoading(false);
//       }
//     };
    
//     fetchSearchResults();
//   }, [searchQuery, currentPage, pageSize, filters, activeTab]);
  
//   // Xử lý khi thay đổi tab
//   const handleTabChange = (key) => {
//     setActiveTab(key);
//     setCurrentPage(1);
//   };
  
//   // Xử lý khi thay đổi bộ lọc
//   const handleFilterChange = (field, value) => {
//     setFilters(prev => ({
//       ...prev,
//       [field]: value
//     }));
//     setCurrentPage(1);
//   };
  
//   // Xử lý khi thay đổi trang
//   const handlePageChange = (page) => {
//     setCurrentPage(page);
//     window.scrollTo(0, 0);
//   };
  
//   // Đặt lại bộ lọc về mặc định
//   const resetFilters = () => {
//     setFilters({
//       type: 'all',
//       minPrice: '',
//       maxPrice: '',
//       sortBy: 'relevance'
//     });
//     setCurrentPage(1);
//   };

//   return (
//     <Layout className="search-results-page">
//       {/* Breadcrumb */}
//       <section className="bread-crumb">
//         <div className="container">
//           <Row>
//             <Col span={24}>
//               <Breadcrumb className="bread-crumb-list" separator={<RightOutlined />}>
//                 <Breadcrumb.Item>
//                   <Link to="/">Trang chủ</Link>
//                 </Breadcrumb.Item>
//                 <Breadcrumb.Item>Kết quả tìm kiếm</Breadcrumb.Item>
//               </Breadcrumb>
//             </Col>
//           </Row>
//         </div>
//       </section>
      
//       {/* Header tìm kiếm */}
//       <section className="search-header">
//         <div className="container">
//           <Row align="middle" justify="space-between">
//             <Col xs={24} md={12}>
//               <h1>
//                 Kết quả tìm kiếm cho: <span className="search-query">{searchQuery}</span>
//               </h1>
//             </Col>
//             <Col xs={24} md={12} className="search-form">
//               <Input.Search
//                 placeholder="Tìm kiếm lại..."
//                 defaultValue={searchQuery}
//                 size="large"
//                 enterButton={<SearchOutlined />}
//                 onSearch={(value) => {
//                   if (value) {
//                     window.location.href = `/search?q=${encodeURIComponent(value)}`;
//                   }
//                 }}
//               />
//             </Col>
//           </Row>
//         </div>
//       </section>
      
//       {/* Tabs lọc */}
//       <section className="search-content">
//         <div className="container">
//           <Row gutter={24}>
//             {/* Sidebar bộ lọc */}
//             <Col xs={24} lg={6} className="filter-sidebar">
//               <div className="filter-section">
//                 <h3>Bộ lọc <FilterOutlined /></h3>
                
//                 <div className="filter-group">
//                   <h4>Khoảng giá</h4>
//                   <Row gutter={8}>
//                     <Col span={12}>
//                       <Input
//                         placeholder="Tối thiểu"
//                         value={filters.minPrice}
//                         onChange={(e) => handleFilterChange('minPrice', e.target.value)}
//                         addonBefore="$"
//                       />
//                     </Col>
//                     <Col span={12}>
//                       <Input
//                         placeholder="Tối đa"
//                         value={filters.maxPrice}
//                         onChange={(e) => handleFilterChange('maxPrice', e.target.value)}
//                         addonBefore="$"
//                       />
//                     </Col>
//                   </Row>
//                 </div>
                
//                 <div className="filter-group">
//                   <h4>Sắp xếp theo</h4>
//                   <Select
//                     value={filters.sortBy}
//                     onChange={(value) => handleFilterChange('sortBy', value)}
//                     style={{ width: '100%' }}
//                   >
//                     <Option value="relevance">Độ phù hợp</Option>
//                     <Option value="price-low">Giá: Thấp đến cao</Option>
//                     <Option value="price-high">Giá: Cao đến thấp</Option>
//                     <Option value="newest">Mới nhất trước</Option>
//                   </Select>
//                 </div>
                
//                 <Button type="default" onClick={resetFilters} className="reset-btn">
//                   Đặt lại bộ lọc
//                 </Button>
//               </div>
//             </Col>
            
//             {/* Danh sách kết quả */}
//             <Col xs={24} lg={18}>
//               {/* Tabs lọc theo loại sản phẩm */}
//               <Tabs
//                 activeKey={activeTab}
//                 onChange={handleTabChange}
//                 className="product-tabs"
//               >
//                 <TabPane tab="Tất cả sản phẩm" key="all" />
//                 <TabPane tab="Thú cưng" key="pet" />
//                 <TabPane tab="Phụ kiện" key="accessory" />
//               </Tabs>
              
//               {/* Kết quả */}
//               <div className="search-results-list">
//                 {loading ? (
//                   <div className="loading-container">
//                     <Spin size="large" />
//                     <p>Đang tìm kiếm sản phẩm...</p>
//                   </div>
//                 ) : results.length === 0 ? (
//                   <Empty
//                     description={
//                       <span>
//                         Không tìm thấy sản phẩm nào cho <strong>"{searchQuery}"</strong>
//                       </span>
//                     }
//                     className="no-results"
//                   />
//                 ) : (
//                   <>
//                     <Row gutter={[16, 24]}>
//                       {results.map((item) => (
//                         <Col xs={24} sm={12} md={8} lg={8} key={`${item.type}-${item.id}`}>
//                           {item.type === 'pet' ? (
//                             <PetCard
//                               id={item.id}
//                               name={item.name}
//                               image={item.thumbnail}
//                               price={item.price}
//                               gender={item.gender}
//                               age={item.age}
//                               breed={item.breed}
//                             />
//                           ) : (
//                             <AccessoryCard
//                               id={item.id}
//                               name={item.name}
//                               image={item.thumbnail}
//                               price={item.price}
//                               categoryName={item.category}
//                               stockQuantity={item.stockQuantity}
//                             />
//                           )}
//                         </Col>
//                       ))}
//                     </Row>
                    
//                     {/* Phân trang */}
//                     <div className="pagination-container">
//                       <Pagination
//                         current={currentPage}
//                         total={totalItems}
//                         pageSize={pageSize}
//                         onChange={handlePageChange}
//                         showSizeChanger={false}
//                       />
//                     </div>
//                   </>
//                 )}
//               </div>
//             </Col>
//           </Row>
//         </div>
//       </section>
//     </Layout>
//   );
// }

// export default SearchResults;