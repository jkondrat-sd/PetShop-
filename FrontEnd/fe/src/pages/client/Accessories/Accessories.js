import React, { useState, useEffect, useCallback } from 'react';
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
  message,
} from 'antd';
import { 
  RightOutlined
} from '@ant-design/icons';
import { Link } from 'react-router-dom';
import AccessoryCard from '../Components/AccesssoryCard/AccesssoryCard';
import 'animate.css';
import './Accessories.scss';
import { getAccessories } from '~/services/accessoryService';
import { getCategories } from '~/services/categoryService';

const { Option } = Select;

function Accessories() {
  // States
  const [loading, setLoading] = useState(true);
  const [categoriesLoading, setCategoriesLoading] = useState(true);
  const [allAccessories, setAllAccessories] = useState([]); // Lưu trữ tất cả accessories
  const [filteredAccessories, setFilteredAccessories] = useState([]); // Accessories sau khi filter
  const [categories, setCategories] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [pageSize, setPageSize] = useState(12);
  const [activeTab, setActiveTab] = useState('all');
  const [error, setError] = useState(null);
  const [categoriesError, setCategoriesError] = useState(null);
  
  // Filter states
  const [filters, setFilters] = useState({
    categoryId: 'all',
    minPrice: '',
    maxPrice: '',
    sortBy: 'newest'
  });

  // Fetch categories data
  useEffect(() => {
    const fetchCategories = async () => {
      setCategoriesLoading(true);
      setCategoriesError(null);
      try {
        const categoriesResponse = await getCategories({
          status: 'active',
          page: 0,
          size: 100
        });
        setCategories(categoriesResponse?.content || []);
      } catch (error) {
        console.error('Error fetching categories:', error);
        setCategoriesError('Failed to load categories. Please try again later.');
        message.error('Failed to load categories');
      } finally {
        setCategoriesLoading(false);
      }
    };

    fetchCategories();
  }, []);

  // Fetch accessories data
  useEffect(() => {
    const fetchAccessories = async () => {
      setLoading(true);
      setError(null);
      try {
        // Fetch ALL accessories (no server-side filtering)
        const params = {
          status: 'active',
          page: 0, // Get all data
          size: 1000 // Large size to get all accessories
        };

        const response = await getAccessories(params);
        const fetchedAccessories = response?.content || [];
        setAllAccessories(fetchedAccessories);
        setError(null);
      } catch (error) {
        console.error('Error fetching accessories:', error);
        setAllAccessories([]);
        setError('Failed to load accessories. Please try again later.');
        message.error('Failed to load accessories');
      } finally {
        setLoading(false);
      }
    };

    fetchAccessories();
  }, []);

  // Apply filters whenever filters or allAccessories change
  useEffect(() => {
    if (allAccessories.length === 0) {
      setFilteredAccessories([]);
      setTotalItems(0);
      return;
    }

    // Apply ALL filters client-side
    let filtered = [...allAccessories];
    
    // 1. Filter by category
    if (filters.categoryId !== 'all') {
      filtered = filtered.filter(
        accessory => accessory?.categoryId?.toString() === filters.categoryId
      );
    }
    
    // 2. Filter by price range
    if (filters.minPrice && filters.minPrice !== '') {
      filtered = filtered.filter(
        accessory => parseFloat(accessory?.unitPrice || 0) >= parseFloat(filters.minPrice)
      );
    }
    
    if (filters.maxPrice && filters.maxPrice !== '') {
      filtered = filtered.filter(
        accessory => parseFloat(accessory?.unitPrice || 0) <= parseFloat(filters.maxPrice)
      );
    }
  
    
    // 3. Sort results
    if (filters.sortBy === 'price-low') {
      filtered.sort((a, b) => parseFloat(a?.unitPrice || 0) - parseFloat(b?.unitPrice || 0));
    } else if (filters.sortBy === 'price-high') {
      filtered.sort((a, b) => parseFloat(b?.unitPrice || 0) - parseFloat(a?.unitPrice || 0));
    } else if (filters.sortBy === 'newest') {
      // Sort by newest (assuming there's a createdAt field)
      filtered.sort((a, b) => new Date(b?.createdAt || 0) - new Date(a?.createdAt || 0));
    }
    
    setFilteredAccessories(filtered);
    setTotalItems(filtered.length);
  }, [filters, allAccessories]);

  // Sync activeTab with categoryId filter
  useEffect(() => {
    if (filters.categoryId !== 'all' && activeTab !== filters.categoryId) {
      setActiveTab(filters.categoryId);
    } else if (filters.categoryId === 'all' && activeTab !== 'all') {
      setActiveTab('all');
    }
  }, [filters.categoryId, activeTab]);

  // Handle filter changes
  const handleFilterChange = (filterType, value) => {
    setFilters(prevFilters => ({
      ...prevFilters,
      [filterType]: value
    }));
    // Reset to page 1 when filters change
    setCurrentPage(1);
  };

  // Handle tab change (Categories)
  const handleTabChange = (tab) => {
    setActiveTab(tab);
    setCurrentPage(1);
    
    // Update category filter based on tab
    if (tab === 'all') {
      setFilters(prevFilters => ({
        ...prevFilters,
        categoryId: 'all'
      }));
    } else {
      setFilters(prevFilters => ({
        ...prevFilters,
        categoryId: tab
      }));
    }
  };

  // Reset filters
  const resetFilters = () => {
    setFilters({
      categoryId: 'all',
      minPrice: '',
      maxPrice: '',
      sortBy: 'newest'
    });
    setActiveTab('all');
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
    const category = (categories || []).find(cat => cat?.categoryId?.toString() === activeTab);
    return category ? (category.categoryName || 'Unknown Category') : "Accessories";
  };

  // Đếm số lượng accessories theo category
  const getCategoryCount = (categoryId) => {
    if (!allAccessories || allAccessories.length === 0) return 0;
    
    if (categoryId === 'all') {
      return allAccessories.length;
    }
    
    return allAccessories.filter(
      accessory => accessory?.categoryId?.toString() === categoryId
    ).length;
  };

  return (
    <Layout className="accessories-page">
      {/* BreadCrumb */}
      <section className="bread-crumb animate__animated animate__fadeIn">
        <div className="container">
          <Row>
            <Col span={24}>
              <Breadcrumb 
                className="bread-crumb-list" 
                separator={<RightOutlined />}
                items={[
                  {
                    title: <Link to="/">Home</Link>
                  },
                  {
                    title: 'Accessories'
                  }
                ]}
              />
            </Col>
          </Row>
        </div>
      </section>

      {/* Category Tabs */}
      <section className="accessories-tabs">
        <div className="container">
          {categoriesLoading ? (
            <div className="categories-loading">
              <Spin size="large" />
              <p>Loading categories...</p>
            </div>
          ) : categoriesError ? (
            <div className="categories-error">
              <p>{categoriesError}</p>
              <Button onClick={() => window.location.reload()}>Retry</Button>
            </div>
          ) : (
            <Tabs 
              activeKey={activeTab} 
              onChange={handleTabChange}
              className="animate__animated animate__fadeInDown"
              centered
              items={[
                {
                  key: 'all',
                  label: `All Accessories (${getCategoryCount('all')})`
                },
                ...(categories || [])
                  .filter(category => category && category.categoryId)
                  .map(category => ({
                    key: category.categoryId.toString(),
                    label: `${category.categoryName || 'Unknown Category'} (${getCategoryCount(category.categoryId.toString())})`
                  }))
              ]}
            />
          )}
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
                  onChange={(value) => {
                    handleFilterChange('categoryId', value);
                    // Sync with active tab
                    if (value === 'all') {
                      setActiveTab('all');
                    } else {
                      setActiveTab(value);
                    }
                  }}
                  loading={categoriesLoading}
                >
                  <Option value="all">All Categories ({getCategoryCount('all')})</Option>
                  {(categories || [])
                    .filter(category => category && category.categoryId)
                    .map(category => (
                      <Option key={category.categoryId} value={category.categoryId.toString()}>
                        {category.categoryName || 'Unknown Category'} ({getCategoryCount(category.categoryId.toString())})
                      </Option>
                  ))}
                </Select>

                <h3 className="filter-title">Price Range</h3>
                <Row gutter={8} className="price-range">
                  <Col span={12}>
                    <Input
                      placeholder="Min $"
                      type="number"
                      min="0"
                      step="0.01"
                      value={filters.minPrice}
                      onChange={(e) => {
                        const value = e.target.value;
                        if (value === '' || parseFloat(value) >= 0) {
                          handleFilterChange('minPrice', value);
                        }
                      }}
                    />
                  </Col>
                  <Col span={12}>
                    <Input
                      placeholder="Max $"
                      type="number"
                      min="0"
                      step="0.01"
                      value={filters.maxPrice}
                      onChange={(e) => {
                        const value = e.target.value;
                        if (value === '' || parseFloat(value) >= 0) {
                          handleFilterChange('maxPrice', value);
                        }
                      }}
                    />
                  </Col>
                </Row>
                
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
              </div>
            </Col>

            {/* Accessories Product Column */}
            <Col xs={24} sm={24} md={16} lg={18} xl={18}>
              <div className="accessories-header">
                <h2 className="animate__animated animate__fadeInDown">{getPageTitle()}</h2>
              </div>
              
              {loading ? (
                <div className="loading-container">
                  <Spin size="large" />
                </div>
              ) : error ? (
                <div className="error-container">
                  <p className="error-message">{error}</p>
                  <Button onClick={() => window.location.reload()}>Retry</Button>
                </div>
              ) : (
                <Row gutter={[16, 24]}>
                  {(filteredAccessories || []).length > 0 ? (
                    (() => {
                      const startIndex = (currentPage - 1) * pageSize;
                      const endIndex = startIndex + pageSize;
                      const paginatedAccessories = filteredAccessories.slice(startIndex, endIndex);
                      
                      return paginatedAccessories.map((accessory) => (
                        <Col 
                          key={accessory?.accessoryId || Math.random()} 
                          xs={24} 
                          sm={12} 
                          md={12} 
                          lg={8} 
                          xl={8}
                        >
                          <AccessoryCard 
                            id={accessory?.accessoryId}
                            name={accessory?.accessoryName || 'Unknown Accessory'}
                            image={accessory?.thumbnail || ''}
                            categoryName={accessory?.category || 'Unknown Category'}
                            size={accessory?.size || "Standard"}
                            price={(accessory?.unitPrice || 0).toString()}
                            stockQuantity={accessory?.stockQuantity || 0}
                            onAddToCart={() => handleAddToCart(accessory)}
                          />
                        </Col>
                      ));
                    })()
                  ) : (
                    <div className="no-results">
                      <p>
                        {activeTab === 'all' 
                          ? 'No accessories found matching your criteria.' 
                          : `No accessories found in "${getPageTitle()}" matching your criteria.`
                        }
                      </p>
                      <Button onClick={resetFilters}>Reset Filters</Button>
                    </div>
                  )}
                </Row>
              )}

              {/* Pagination */}
              {(filteredAccessories || []).length > 0 && (
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