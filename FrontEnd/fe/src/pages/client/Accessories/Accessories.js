import React, { useState, useEffect } from 'react';
import { 
  Layout, 
  Breadcrumb, 
  Row, 
  Col, 
  Input, 
  Checkbox, 
  Button, 
  Pagination,
  Spin,
  Select,
  Tabs,
} from 'antd';
import { 
  RightOutlined, 
  SearchOutlined, 
  FilterOutlined 
} from '@ant-design/icons';
import { Link } from 'react-router-dom';
import AccessoryCard from '../Components/AccesssoryCard/AccesssoryCard';
import 'animate.css';
import './Accessories.scss';

const { TabPane } = Tabs;
const { Option } = Select;

function Accessories() {
  // States
  const [loading, setLoading] = useState(true);
  const [accessories, setAccessories] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [pageSize, setPageSize] = useState(12);
  const [activeTab, setActiveTab] = useState('all');
  
  // Filter states
  const [filters, setFilters] = useState({
    categoryId: 'all',
    minPrice: '',
    maxPrice: '',
    stockStatus: [],
    sortBy: 'newest'
  });

  // Mock data for categories
  const mockCategories = [
    { id: 1, name: 'Food & Treats' },
    { id: 2, name: 'Toys' },
    { id: 3, name: 'Beds & Furniture' },
    { id: 4, name: 'Clothing & Accessories' },
    { id: 5, name: 'Grooming' },
    { id: 6, name: 'Health & Wellness' }
  ];

  // Mock data for development - Accessories
  const mockAccessories = [
    { 
      id: 'RF101', 
      name: 'Reflex Plus Adult Cat Food Salmon', 
      image: 'https://www.petfoodexperts.com/wp-content/uploads/2020/01/reflex-plus-adult-salmon-1.5-kg-cat-food.jpg',
      categoryId: 1,
      categoryName: 'Cat Food',
      size: '1.5kg',
      price: '20',
      stockQuantity: 15
    },
    { 
      id: 'RF102', 
      name: 'Reflex Plus Adult Cat Food Salmon', 
      image: 'https://m.media-amazon.com/images/I/61YDuNaOUVL.jpg',
      categoryId: 1,
      categoryName: 'Dog Food',
      size: '385g',
      price: '15',
      stockQuantity: 25
    },
    { 
      id: 'SCT103', 
      name: 'Cat scratching ball toy kitten sisal rope ball', 
      image: 'https://m.media-amazon.com/images/I/71ZE5gdMQGL._AC_SL1500_.jpg',
      categoryId: 2,
      categoryName: 'Toy',
      size: 'Standard',
      price: '50',
      stockQuantity: 8
    },
    { 
      id: 'WNT104', 
      name: 'Cute Pet Cat Warm Nest', 
      image: 'https://m.media-amazon.com/images/I/61dwyhdOi0L._AC_UF894,1000_QL80_.jpg',
      categoryId: 3,
      categoryName: 'Toy',
      size: 'Medium',
      price: '20',
      stockQuantity: 10
    },
    { 
      id: 'NOG105', 
      name: 'NaturVet Dogs - Omega-Gold Plus Salmon Oil', 
      image: 'https://m.media-amazon.com/images/I/81LCxF7RXQL._AC_UF894,1000_QL80_.jpg',
      categoryId: 6,
      categoryName: 'Dog Food',
      size: '385g',
      price: '25',
      stockQuantity: 30
    },
    { 
      id: 'COS106', 
      name: 'Costumes Fashion Pet Clother Cowboy Rider', 
      image: 'https://m.media-amazon.com/images/I/714sj0kdPWL._AC_UF894,1000_QL80_.jpg',
      categoryId: 4,
      categoryName: 'Costume',
      size: 'Medium',
      price: '30',
      stockQuantity: 5
    },
    { 
      id: 'CCK107', 
      name: 'Costumes Chicken Drumstick Headband', 
      image: 'https://m.media-amazon.com/images/I/61QQdt4-VuL._AC_UF894,1000_QL80_.jpg',
      categoryId: 4,
      categoryName: 'Costume',
      size: 'One size',
      price: '30',
      stockQuantity: 7
    },
    { 
      id: 'PLT108', 
      name: 'Plush Pet Toy', 
      image: 'https://m.media-amazon.com/images/I/71Cd5W0NcCL._AC_UF894,1000_QL80_.jpg',
      categoryId: 2,
      categoryName: 'Toy',
      size: 'Large',
      price: '25',
      stockQuantity: 0
    }
  ];

  // Fetch accessories data
  useEffect(() => {
    setLoading(true);
    
    setTimeout(() => {
      let filteredAccessories = [...mockAccessories];
      
      // Lọc theo danh mục
      if (filters.categoryId !== 'all') {
        filteredAccessories = filteredAccessories.filter(
          accessory => accessory.categoryId === parseInt(filters.categoryId)
        );
      }
      
      // Lọc theo giá
      if (filters.minPrice) {
        filteredAccessories = filteredAccessories.filter(
          accessory => parseFloat(accessory.price) >= parseFloat(filters.minPrice)
        );
      }
      
      if (filters.maxPrice) {
        filteredAccessories = filteredAccessories.filter(
          accessory => parseFloat(accessory.price) <= parseFloat(filters.maxPrice)
        );
      }
      
      // Lọc theo tình trạng stock
      if (filters.stockStatus.length > 0) {
        filteredAccessories = filteredAccessories.filter(accessory => {
          if (filters.stockStatus.includes('inStock') && accessory.stockQuantity > 0) {
            return true;
          }
          if (filters.stockStatus.includes('outOfStock') && accessory.stockQuantity === 0) {
            return true;
          }
          return false;
        });
      }
      
      // Sắp xếp
      if (filters.sortBy === 'price-low') {
        filteredAccessories.sort((a, b) => parseFloat(a.price) - parseFloat(b.price));
      } else if (filters.sortBy === 'price-high') {
        filteredAccessories.sort((a, b) => parseFloat(b.price) - parseFloat(a.price));
      }
      
      // Phân trang
      const startIndex = (currentPage - 1) * pageSize;
      const endIndex = startIndex + pageSize;
      const paginatedAccessories = filteredAccessories.slice(startIndex, endIndex);
      
      setAccessories(paginatedAccessories);
      setTotalItems(filteredAccessories.length);
      setLoading(false);
    }, 800);
    
  }, [filters, currentPage, pageSize, activeTab]);

  // Handle filter changes
  const handleFilterChange = (filterType, value) => {
    setFilters(prevFilters => ({
      ...prevFilters,
      [filterType]: value
    }));
    setCurrentPage(1);
  };

  // Handle tab change (Categories)
  const handleTabChange = (tab) => {
    setActiveTab(tab);
    setCurrentPage(1);
  };

  // Handle checkbox changes
  const handleStockStatusChange = (status) => {
    const currentStockStatus = [...filters.stockStatus];
    const index = currentStockStatus.indexOf(status);
    
    if (index > -1) {
      currentStockStatus.splice(index, 1);
    } else {
      currentStockStatus.push(status);
    }
    
    handleFilterChange('stockStatus', currentStockStatus);
  };

  // Apply filters
  const applyFilters = () => {
    setCurrentPage(1);
  };

  // Reset filters
  const resetFilters = () => {
    setFilters({
      categoryId: 'all',
      minPrice: '',
      maxPrice: '',
      stockStatus: [],
      sortBy: 'newest'
    });
    setCurrentPage(1);
  };

  // Handle page change
  const handlePageChange = (page) => {
    setCurrentPage(page);
    window.scrollTo(0, 0);
  };

  // Handle add to cart
  const handleAddToCart = (accessory) => {
    console.log('Added to cart:', accessory);
    // Implement cart logic here
  };

  // Lấy tiêu đề trang dựa trên tab đang active
  const getPageTitle = () => {
    if (activeTab === 'all') {
      return "All Accessories";
    } 
    const category = mockCategories.find(cat => cat.id.toString() === activeTab);
    return category ? category.name : "Accessories";
  };

  return (
    <Layout className="accessories-page">
      {/* BreadCrumb */}
      <section className="bread-crumb animate__animated animate__fadeIn">
        <div className="container">
          <Row>
            <Col span={24}>
              <Breadcrumb className="bread-crumb-list" separator={<RightOutlined />}>
                <Breadcrumb.Item>
                  <Link to="/">Home</Link>
                </Breadcrumb.Item>
                <Breadcrumb.Item>Accessories</Breadcrumb.Item>
              </Breadcrumb>
            </Col>
          </Row>
        </div>
      </section>

      {/* Category Tabs */}
      <section className="accessories-tabs">
        <div className="container">
          <Tabs 
            activeKey={activeTab} 
            onChange={handleTabChange}
            className="animate__animated animate__fadeInDown"
            centered
          >
            <TabPane tab="All Accessories" key="all" />
            {mockCategories.map(category => (
              <TabPane tab={category.name} key={category.id.toString()} />
            ))}
          </Tabs>
        </div>
      </section>

      {/* Accessories */}
      <section className="accessories">
        <div className="container">
          <Row gutter={[24, 20]}>
            {/* Filter Column */}
            <Col xs={24} sm={24} md={8} lg={6} xl={6}>
              <div className="filter-items animate__animated animate__fadeInLeft">
                <div className="filter-header">
                  <h2>Filter</h2>
                  <Button 
                    type="text" 
                    onClick={resetFilters}
                    className="reset-btn"
                  >
                    Reset All
                  </Button>
                </div>

                <h3 className="filter-title">Category</h3>
                <Select 
                  defaultValue="all"
                  style={{ width: '100%' }}
                  value={filters.categoryId}
                  onChange={(value) => handleFilterChange('categoryId', value)}
                >
                  <Option value="all">All Categories</Option>
                  {mockCategories.map(category => (
                    <Option key={category.id} value={category.id.toString()}>{category.name}</Option>
                  ))}
                </Select>

                <h3 className="filter-title">Price Range</h3>
                <Row gutter={8} className="price-range">
                  <Col span={12}>
                    <Input
                      placeholder="Min $"
                      type="number"
                      value={filters.minPrice}
                      onChange={(e) => handleFilterChange('minPrice', e.target.value)}
                    />
                  </Col>
                  <Col span={12}>
                    <Input
                      placeholder="Max $"
                      type="number"
                      value={filters.maxPrice}
                      onChange={(e) => handleFilterChange('maxPrice', e.target.value)}
                    />
                  </Col>
                </Row>

                <h3 className="filter-title">Stock Status</h3>
                <div className="filter-stock">
                  <Checkbox 
                    checked={filters.stockStatus.includes('inStock')}
                    onChange={() => handleStockStatusChange('inStock')}
                  >
                    In Stock
                  </Checkbox>
                  <Checkbox 
                    checked={filters.stockStatus.includes('outOfStock')}
                    onChange={() => handleStockStatusChange('outOfStock')}
                  >
                    Out of Stock
                  </Checkbox>
                </div>
                
                <h3 className="filter-title">Sort By</h3>
                <Select 
                  defaultValue="newest"
                  style={{ width: '100%' }}
                  value={filters.sortBy}
                  onChange={(value) => handleFilterChange('sortBy', value)}
                >
                  <Option value="newest">Newest</Option>
                  <Option value="price-low">Price: Low to High</Option>
                  <Option value="price-high">Price: High to Low</Option>
                </Select>

                <Button 
                  type="primary" 
                  className="submit-filter"
                  onClick={applyFilters}
                  icon={<FilterOutlined />}
                >
                  Apply Filters
                </Button>
              </div>
            </Col>

            {/* Accessories Product Column */}
            <Col xs={24} sm={24} md={16} lg={18} xl={18}>
              <h2 className="animate__animated animate__fadeInDown">{getPageTitle()}</h2>
              
              {loading ? (
                <div className="loading-container">
                  <Spin size="large" />
                </div>
              ) : (
                <Row gutter={[16, 24]}>
                  {accessories.length > 0 ? (
                    accessories.map((accessory) => (
                      <Col 
                        key={accessory.id} 
                        xs={24} 
                        sm={12} 
                        md={12} 
                        lg={8} 
                        xl={8}
                      >
                        <AccessoryCard 
                          id={accessory.id}
                          name={accessory.name}
                          image={accessory.image}
                          categoryName={accessory.categoryName}
                          size={accessory.size}
                          price={accessory.price}
                          stockQuantity={accessory.stockQuantity}
                          onAddToCart={() => handleAddToCart(accessory)}
                        />
                      </Col>
                    ))
                  ) : (
                    <div className="no-results">
                      <p>No accessories found matching your criteria.</p>
                      <Button onClick={resetFilters}>Reset Filters</Button>
                    </div>
                  )}
                </Row>
              )}

              {/* Pagination */}
              {accessories.length > 0 && (
                <div className="pagination-container animate__animated animate__fadeInUp">
                  <Pagination
                    current={currentPage}
                    total={totalItems}
                    pageSize={pageSize}
                    onChange={handlePageChange}
                    showSizeChanger={false}
                    showQuickJumper
                  />
                </div>
              )}
            </Col>
          </Row>
        </div>
      </section>
    </Layout>
  );
}

export default Accessories;