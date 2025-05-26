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
  SearchOutlined, 
  FilterOutlined
} from '@ant-design/icons';
import { Link } from 'react-router-dom';
import PetCard from '../Components/PetCard/PetCard';
import 'animate.css';
import './Pets.scss';
import { getPets } from '~/services/petService';

// Import banner images
import puppiesDog from '../../../assets/images/img-dogs/puppies-dog.png';
import MO231 from '../../../assets/images/img-dogs/MO231.png';



const { TabPane } = Tabs;
const { Option } = Select;

function Pets() {
  // States
  const [loading, setLoading] = useState(true);
  const [pets, setPets] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [pageSize, setPageSize] = useState(9);
  const [activeTab, setActiveTab] = useState('all');
  
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

  // Mock data for development - DOGS
  const mockDogs = [
    { 
      id: 'MO231', 
      name: 'MO231 - Pomeranian White', 
      image: MO231,
      gender: 'Male',
      age: '2 months',
      price: '3,000',
      type: 'dog',
      breed: 'Pomeranian'
    },
    { 
      id: 'MO235', 
      name: 'MO235', 
      image: MO231,
      gender: 'Male',
      age: '2 months',
      price: '3,000',
      type: 'dog',
      breed: 'Pomeranian'
    },
    { 
      id: 'MO502', 
      name: 'MO502 - Poodle Tiny Yellow', 
      image: MO231,
      gender: 'Female',
      age: '2 months',
      price: '2,500',
      type: 'dog',
      breed: 'Poodle'
    },
    { 
      id: 'MO102', 
      name: 'MO102 - Poodle Tiny Sepia', 
      image: MO231,
      gender: 'Male',
      age: '2 months',
      price: '3,000',
      type: 'dog',
      breed: 'Poodle'
    },
    { 
      id: 'MO512', 
      name: 'MMO512 - Alaskan Malamute Grey', 
      image: MO231,
      gender: 'Male',
      age: '2 months',
      price: '5,000',
      type: 'dog',
      breed: 'Alaskan Malamute'
    },
    { 
      id: 'MO504', 
      name: 'MO231 - Pembroke Corgi Cream', 
      image: MO231,
      gender: 'Male',
      age: '2 months',
      price: '3,200',
      type: 'dog',
      breed: 'Pembroke Corgi'
    },
    { 
      id: 'MO503', 
      name: 'MO502 - Pembroke Corgi Tricolor', 
      image: MO231,
      gender: 'Female',
      age: '2 months',
      price: '3,000',
      type: 'dog',
      breed: 'Pembroke Corgi'
    },
  ];
  
  // Mock data for development - CATS
  const mockCats = [
    { 
      id: 'MC101', 
      name: 'MC101 - British Shorthair Blue', 
      image: MO231,
      gender: 'Female',
      age: '3 months',
      price: '2,800',
      type: 'cat',
      breed: 'British Shorthair'
    },
    { 
      id: 'MC202', 
      name: 'MC202 - Scottish Fold White', 
      image: MO231,
      gender: 'Male',
      age: '2 months',
      price: '3,500',
      type: 'cat',
      breed: 'Scottish Fold'
    },
    { 
      id: 'MC303', 
      name: 'MC303 - Ragdoll Blue Bicolor', 
      image: MO231,
      gender: 'Male',
      age: '3 months',
      price: '3,200',
      type: 'cat',
      breed: 'Ragdoll'
    },
    { 
      id: 'MC404', 
      name: 'MC404 - Maine Coon Brown Tabby', 
      image: MO231,
      gender: 'Female',
      age: '4 months',
      price: '4,500',
      type: 'cat',
      breed: 'Maine Coon'
    },
    { 
      id: 'MC505', 
      name: 'MC505 - Bengal Spotted', 
      image: MO231,
      gender: 'Male',
      age: '2 months',
      price: '5,000',
      type: 'cat',
      breed: 'Bengal'
    },
    { 
      id: 'MC606', 
      name: 'MC606 - Persian White', 
      image: MO231,
      gender: 'Female',
      age: '3 months',
      price: '3,800',
      type: 'cat',
      breed: 'Persian'
    },
  ];
  
  // Combine all pets for "All Pets" view
  const mockAllPets = [...mockDogs, ...mockCats];
  
  // Danh sách các giống chó và mèo để lọc
  const dogBreeds = ['All', 'Pomeranian', 'Poodle', 'Alaskan Malamute', 'Pembroke Corgi'];
  const catBreeds = ['All', 'British Shorthair', 'Scottish Fold', 'Ragdoll', 'Maine Coon', 'Bengal', 'Persian'];

  // Fetch pets data
  useEffect(() => {
    setLoading(true);
    async function fetchPets() {
      try {
        // Gọi API, truyền filter nếu muốn
        const response = await getPets({
          page: currentPage - 1, // API backend thường dùng 0-based
          size: pageSize,
          type: filters.type !== 'all' ? filters.type : undefined,
          // Có thể truyền thêm breedId, gender, price... nếu backend hỗ trợ
        });
        // response.content hoặc response.data.content tùy API
        setPets(response.content || []);
        setTotalItems(response.totalElements || 0);
      } catch (error) {
        setPets([]);
        setTotalItems(0);
      } finally {
        setLoading(false);
      }
    }
    fetchPets();
  }, [activeTab, filters, currentPage, pageSize]);

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
  };

  // Handle checkbox changes
  const handleGenderChange = (gender) => {
    const currentGenders = [...filters.gender];
    const index = currentGenders.indexOf(gender);
    
    if (index > -1) {
      currentGenders.splice(index, 1);
    } else {
      currentGenders.push(gender);
    }
    
    handleFilterChange('gender', currentGenders);
  };

  // Apply filters
  const applyFilters = () => {
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
    if (activeTab === 'cats') {
      return "Our Cats";
    } else if (activeTab === 'dogs') {
      return "Our Dogs";
    }
    return "Our Pets";
  };

  // Lấy danh sách các giống dựa trên tab đang active
  const getBreedList = () => {
    if (activeTab === 'cats') {
      return catBreeds;
    } else if (activeTab === 'dogs') {
      return dogBreeds;
    }
    return [...new Set([...dogBreeds, ...catBreeds])]; // Kết hợp và loại bỏ trùng lặp
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
                  {activeTab === 'cats' ? 'Cats' : activeTab === 'dogs' ? 'Dogs' : 'Pets'}
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
            <TabPane tab="All Pets" key="all" />
            <TabPane tab="Dogs" key="dogs" />
            <TabPane tab="Cats" key="cats" />
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
                    checked={filters.gender.includes('Male')}
                    onChange={() => handleGenderChange('Male')}
                  >
                    Male
                  </Checkbox>
                  <Checkbox 
                    checked={filters.gender.includes('Female')}
                    onChange={() => handleGenderChange('Female')}
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
                >
                  <Option value="all">All Breeds</Option>
                  {getBreedList().filter(breed => breed !== 'All').map(breed => (
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

            {/* Pets Product Column */}
            <Col xs={24} sm={24} md={16} lg={18} xl={18}>
              <h2 className="animate__animated animate__fadeInDown">{getPageTitle()}</h2>
              
              {loading ? (
                <div className="loading-container">
                  <Spin size="large" />
                </div>
              ) : (
                <Row gutter={[16, 24]}>
                  {pets.length > 0 ? (
                    pets.map((pet, index) => (
                      <Col 
                        key={pet.petId} 
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
                    ))
                  ) : (
                    <div className="no-results">
                      <p>No pets found matching your criteria.</p>
                      <Button onClick={resetFilters}>Reset Filters</Button>
                    </div>
                  )}
                </Row>
              )}

              {/* Pagination */}
              {pets.length > 0 && (
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