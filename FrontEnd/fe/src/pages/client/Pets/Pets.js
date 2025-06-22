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
  Tabs,
  Radio,
  Select
} from 'antd';
import { 
  HomeOutlined, 
  RightOutlined, 
  SearchOutlined
} from '@ant-design/icons';
import { Link } from 'react-router-dom';
import PetCard from '../Components/PetCard/PetCard';
import 'animate.css';
import './Pets.scss';
import { getPets } from '~/services/petService';
import { getBreeds } from '~/services/breedService';

// Import banner images
import puppiesDog from '../../../assets/images/img-dogs/puppies-dog.png';
import MO231 from '../../../assets/images/img-dogs/MO231.png';

const { TabPane } = Tabs;
const { Option } = Select;

function Pets() {
  // States
  const [loading, setLoading] = useState(true);
  const [allPets, setAllPets] = useState([]); // Lưu trữ tất cả pets
  const [filteredPets, setFilteredPets] = useState([]); // Pets sau khi filter
  const [currentPage, setCurrentPage] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [pageSize, setPageSize] = useState(9);
  const [activeTab, setActiveTab] = useState('all');
  const [error, setError] = useState(null);
  const [breeds, setBreeds] = useState([]);
  const [breedsLoading, setBreedsLoading] = useState(true);
  
  // Filter states
  const [filters, setFilters] = useState({
    type: 'all', // 'all', 'dog', 'cat'
    gender: [],
    minPrice: '',
    maxPrice: '',
    age: '',
    breedType: 'all', // Để lọc theo giống
    sortBy: 'newest' // Để sắp xếp kết quả
  });
  
  // Danh sách các giống chó và mèo để lọc
  const dogBreeds = ['All', 'Pomeranian', 'Poodle', 'Alaskan Malamute', 'Pembroke Corgi'];
  const catBreeds = ['All', 'British Shorthair', 'Scottish Fold', 'Ragdoll', 'Maine Coon', 'Bengal', 'Persian'];

  // Fetch pets data
  useEffect(() => {
    const fetchPets = async () => {
    setLoading(true);
      setError(null);
      try {
        // Fetch ALL pets from database
        const response = await getPets({
          page: 0, // Get all data
          size: 1000 // Large size to get all pets
        });
        
        // Handle different response formats
        let fetchedPets = [];
        if (response?.data?.content) {
          fetchedPets = response.data.content;
        } else if (response?.content) {
          fetchedPets = response.content;
        } else if (Array.isArray(response)) {
          fetchedPets = response;
        }
        
        setAllPets(fetchedPets);
        setError(null);
        
        // Debug: Log first few pets to check data structure
        console.log('Fetched pets sample:', fetchedPets.slice(0, 3));
        console.log('Pet genders found:', [...new Set(fetchedPets.map(pet => pet?.gender))]);
      } catch (error) {
        console.error('Error fetching pets:', error);
        setAllPets([]);
        setError('Failed to load pets. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchPets();
  }, []);

  // Fetch breeds data
  useEffect(() => {
    const fetchBreeds = async () => {
      setBreedsLoading(true);
      try {
        const response = await getBreeds();
        let fetchedBreeds = [];
        
        if (response?.data?.content) {
          fetchedBreeds = response.data.content;
        } else if (response?.content) {
          fetchedBreeds = response.content;
        } else if (Array.isArray(response)) {
          fetchedBreeds = response;
        }
        
        setBreeds(fetchedBreeds);
      } catch (error) {
        console.error('Error fetching breeds:', error);
        setBreeds([]);
      } finally {
        setBreedsLoading(false);
      }
    };

    fetchBreeds();
  }, []);

  // Apply filters whenever filters or allPets change
  useEffect(() => {
    if (allPets.length === 0) {
      setFilteredPets([]);
      setTotalItems(0);
      return;
    }

    // Apply ALL filters client-side
    let filtered = [...allPets];
    
    // 1. Filter by type (tab)
    if (activeTab !== 'all') {
      filtered = filtered.filter(pet => {
        const petType = pet?.type?.toLowerCase();
        return petType === activeTab;
      });
    }
    
    // 2. Filter by gender
    if (filters.gender.length > 0) {
      console.log('Filtering by gender:', filters.gender);
      filtered = filtered.filter(pet => {
        const petGender = pet?.gender?.toUpperCase();
        const isMatch = filters.gender.some(filterGender => 
          filterGender.toUpperCase() === petGender
        );
        console.log(`Pet ${pet?.petName}: gender=${pet?.gender}, petGender=${petGender}, isMatch=${isMatch}`);
        return isMatch;
      });
    }
    
    // 3. Filter by price range
    if (filters.minPrice && filters.minPrice !== '') {
      filtered = filtered.filter(
        pet => parseFloat(pet?.unitPrice || 0) >= parseFloat(filters.minPrice)
      );
    }
    
    if (filters.maxPrice && filters.maxPrice !== '') {
      filtered = filtered.filter(
        pet => parseFloat(pet?.unitPrice || 0) <= parseFloat(filters.maxPrice)
      );
    }
    
    // 4. Filter by age
    if (filters.age && filters.age !== '') {
      filtered = filtered.filter(
        pet => parseInt(pet?.age || 0) === parseInt(filters.age)
      );
    }
    
    // 5. Filter by breed
    if (filters.breedType !== 'all') {
      filtered = filtered.filter(
        pet => pet?.breed === filters.breedType
      );
    }
    
    // 6. Sort results
    if (filters.sortBy === 'price-low') {
      filtered.sort((a, b) => parseFloat(a?.unitPrice || 0) - parseFloat(b?.unitPrice || 0));
    } else if (filters.sortBy === 'price-high') {
      filtered.sort((a, b) => parseFloat(b?.unitPrice || 0) - parseFloat(a?.unitPrice || 0));
    } else if (filters.sortBy === 'newest') {
      // Sort by newest (assuming there's a createdAt field)
      filtered.sort((a, b) => new Date(b?.createdAt || 0) - new Date(a?.createdAt || 0));
    }
    
    setFilteredPets(filtered);
    setTotalItems(filtered.length);
  }, [filters, allPets, activeTab]);

  // Handle tab change
  const handleTabChange = (tab) => {
    setActiveTab(tab);
    setCurrentPage(1);
  };

  // Handle filter changes
  const handleFilterChange = (filterType, value) => {
    setFilters(prevFilters => ({
      ...prevFilters,
      [filterType]: value
    }));
    // Reset to page 1 when filters change
    setCurrentPage(1);
  };

  // Handle checkbox changes
  const handleGenderChange = (gender) => {
    setFilters(prevFilters => {
      const currentGenders = [...prevFilters.gender];
    const index = currentGenders.indexOf(gender);
    
    if (index > -1) {
      currentGenders.splice(index, 1);
    } else {
      currentGenders.push(gender);
    }
    
      return {
        ...prevFilters,
        gender: currentGenders
  };
    });
    setCurrentPage(1);
  };

  // Reset filters
  const resetFilters = () => {
    setFilters({
      type: 'all',
      gender: [],
      minPrice: '',
      maxPrice: '',
      age: '',
      breedType: 'all',
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
  const handleAddToCart = (pet) => {
    console.log('Added to cart:', pet);
    // Implement cart logic here
  };

  // Lấy tiêu đề trang dựa trên tab đang active
  const getPageTitle = () => {
    if (activeTab === 'cat') {
      return "Our Cats";
    } else if (activeTab === 'dog') {
      return "Our Dogs";
    }
    return "Our Pets";
  };

  // Đếm số lượng pets theo type
  const getTypeCount = (type) => {
    if (!allPets || allPets.length === 0) return 0;
    
    if (type === 'all') {
      return allPets.length;
    }
    
    return allPets.filter(pet => {
      const petType = pet?.type?.toLowerCase();
      return petType === type;
    }).length;
  };

  // Lấy danh sách các giống dựa trên tab đang active
  const getBreedList = () => {
    if (!breeds || breeds.length === 0) return [];
    
    let filteredBreeds = breeds;
    
    // Filter breeds based on active tab
    if (activeTab === 'cat') {
      filteredBreeds = breeds.filter(breed => breed?.type?.toLowerCase() === 'cat');
    } else if (activeTab === 'dog') {
      filteredBreeds = breeds.filter(breed => breed?.type?.toLowerCase() === 'dog');
    }
    
    return filteredBreeds.map(breed => breed.breedName || breed.name);
  };

  return (
    <Layout className="pets-page">
      {/* BreadCrumb */}
      <section className="bread-crumb animate__animated animate__fadeIn">
        <div className="container">
          <Row>
            <Col span={24}>
              <Breadcrumb className="bread-crumb-list" separator={<RightOutlined />}>
                <Breadcrumb.Item>
                  <Link to="/">Home</Link>
                </Breadcrumb.Item>
                <Breadcrumb.Item>
                  {activeTab === 'cat' ? 'Cats' : activeTab === 'dog' ? 'Dogs' : 'Pets'}
                </Breadcrumb.Item>
              </Breadcrumb>
            </Col>
          </Row>
        </div>
      </section>

      {/* Banner */}
      <section className="banner-pets animate__animated animate__fadeInUp">
        <div className="container">
          <Row>
            <Col span={24}>
              <div className="inner-wrap">
                <Col xs={24} sm={24} md={12} lg={14} xl={14}>
                  <div className="inner-img animate__animated animate__fadeInLeft">
                    <img src={puppiesDog} alt="Banner Pets" />
                  </div>
                </Col>

                <Col xs={24} sm={24} md={12} lg={10} xl={10}>
                  <div className="content animate__animated animate__fadeInRight">
                    <h2 className="inner-title">One More Friend</h2>
                    <h3 className="title-2">Thousands More Fun!</h3>
                    <p className="inner-desc">
                      Having a pet means you have more joy, a new friend, a happy person who will always be with you
                      to have fun. We have 200+ different pets that can meet your needs!
                    </p>
                    <div className="inner-button">
                      <Button className="btn btn-secondary-reverse" icon={<i className="fa-regular fa-circle-play"></i>}>
                        View Intro
                      </Button>
                      <Button className="btn btn-primary-reverse">
                        Explore Now
                      </Button>
                    </div>
                  </div>
                </Col>
              </div>
            </Col>
          </Row>
        </div>
      </section>

      {/* Tabs để chuyển đổi giữa Dogs và Cats */}
      <section className="pets-tabs">
        <div className="container">
          <Tabs 
            activeKey={activeTab} 
            onChange={handleTabChange}
            className="animate__animated animate__fadeInDown"
            centered
          >
            <TabPane tab={`All Pets (${getTypeCount('all')})`} key="all" />
            <TabPane tab={`Dogs (${getTypeCount('dog')})`} key="dog" />
            <TabPane tab={`Cats (${getTypeCount('cat')})`} key="cat" />
          </Tabs>
        </div>
      </section>

      {/* Pets List */}
      <section className="pets">
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

                <h3 className="filter-title">Gender</h3>
                <div className="filter-gender">
                  <Checkbox 
                    checked={filters.gender.includes('MALE')}
                    onChange={() => handleGenderChange('MALE')}
                  >
                    Male
                  </Checkbox>
                  <Checkbox 
                    checked={filters.gender.includes('FEMALE')}
                    onChange={() => handleGenderChange('FEMALE')}
                  >
                    Female
                  </Checkbox>
                </div>

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

                <h3 className="filter-title">Age</h3>
                <Input
                  placeholder="Age in months"
                  type="number"
                  value={filters.age}
                  onChange={(e) => handleFilterChange('age', e.target.value)}
                />

                <h3 className="filter-title">Breed</h3>
                <Select 
                  defaultValue="all"
                  style={{ width: '100%' }}
                  value={filters.breedType}
                  onChange={(value) => handleFilterChange('breedType', value)}
                  loading={breedsLoading}
                >
                  <Option value="all">All Breeds</Option>
                  {getBreedList().map(breed => (
                    <Option key={breed} value={breed}>{breed}</Option>
                  ))}
                </Select>
                
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

            {/* Pets Product Column */}
            <Col xs={24} sm={24} md={16} lg={18} xl={18}>
              <div className="pets-header">
              <h2 className="animate__animated animate__fadeInDown">{getPageTitle()}</h2>
                {filteredPets.length > 0 && (
                  <p className="results-count">
                    Showing {filteredPets.length} of {allPets.length} pets
                  </p>
                )}
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
                  {filteredPets.length > 0 ? (
                    (() => {
                      const startIndex = (currentPage - 1) * pageSize;
                      const endIndex = startIndex + pageSize;
                      const paginatedPets = filteredPets.slice(startIndex, endIndex);
                      
                      return paginatedPets.map((pet) => (
                      <Col 
                          key={pet?.petId || Math.random()} 
                        xs={24} 
                        sm={12} 
                        md={12} 
                        lg={8} 
                        xl={8}
                      >
                        <PetCard 
                          id={pet.petId}
                          name={pet.petName}
                          image={pet.thumbnail}
                          gender={pet.gender}
                          age={pet.age}
                          price={pet.unitPrice}
                          petType={pet.type}
                          breed={pet.breed}
                          onAddToCart={() => handleAddToCart(pet)}
                        />
                      </Col>
                      ));
                    })()
                  ) : (
                    <div className="no-results">
                      <p>
                        {activeTab === 'all' 
                          ? 'No pets found matching your criteria.' 
                          : `No pets found in "${getPageTitle()}" matching your criteria.`
                        }
                      </p>
                      <Button onClick={resetFilters}>Reset Filters</Button>
                    </div>
                  )}
                </Row>
              )}

              {/* Pagination */}
              {filteredPets.length > 0 && (
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

export default Pets;