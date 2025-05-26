// import React, { useState, useEffect, useRef } from 'react';
// import { Input, Spin, Empty } from 'antd';
// import { SearchOutlined } from '@ant-design/icons';
// import { Link, useNavigate } from 'react-router-dom';
// import classNames from 'classnames/bind';
// import styles from './Search.module.scss';
// import { searchProducts } from '~/services/searchService'; // Cần tạo file này

// const cx = classNames.bind(styles);
// const { Search: AntdSearch } = Input;

// const Search = () => {
//   const [searchValue, setSearchValue] = useState('');
//   const [searchResults, setSearchResults] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const [showResults, setShowResults] = useState(false);
//   const searchRef = useRef(null);
//   const navigate = useNavigate();

//   // Đóng kết quả tìm kiếm khi click ra ngoài
//   useEffect(() => {
//     const handleClickOutside = (event) => {
//       if (searchRef.current && !searchRef.current.contains(event.target)) {
//         setShowResults(false);
//       }
//     };

//     document.addEventListener('mousedown', handleClickOutside);
//     return () => {
//       document.removeEventListener('mousedown', handleClickOutside);
//     };
//   }, []);

//   // Debounce search để tránh gọi API quá nhiều lần
//   useEffect(() => {
//     const delayDebounceFn = setTimeout(async () => {
//       if (searchValue.trim().length >= 2) {
//         setLoading(true);
//         try {
//           // Gọi API tìm kiếm
//           const results = await searchProducts(searchValue);
//           setSearchResults(results);
//           setShowResults(true);
//         } catch (error) {
//           console.error('Lỗi tìm kiếm:', error);
//           setSearchResults([]);
//         } finally {
//           setLoading(false);
//         }
//       } else {
//         setSearchResults([]);
//         setShowResults(searchValue.trim().length > 0);
//       }
//     }, 500);

//     return () => clearTimeout(delayDebounceFn);
//   }, [searchValue]);

//   const handleSearch = (value) => {
//     if (value.trim().length > 0) {
//       navigate(`/search?q=${encodeURIComponent(value)}`);
//       setShowResults(false);
//     }
//   };

//   const handleChange = (e) => {
//     setSearchValue(e.target.value);
//   };

//   return (
//     <div className={cx('search-container')} ref={searchRef}>
//       <AntdSearch
//         placeholder="Tìm thú cưng, phụ kiện, thức ăn..."
//         value={searchValue}
//         onChange={handleChange}
//         onSearch={handleSearch}
//         className={cx('search-input')}
//         prefix={<SearchOutlined />}
//         allowClear
//       />
      
//       {showResults && (
//         <div className={cx('search-results')}>
//           {loading ? (
//             <div className={cx('loading-container')}>
//               <Spin size="small" />
//               <span className={cx('loading-text')}>Đang tìm kiếm...</span>
//             </div>
//           ) : searchResults.length > 0 ? (
//             <>
//               <div className={cx('results-container')}>
//                 {/* Hiển thị kết quả thú cưng */}
//                 {searchResults.filter(item => item.type === 'pet').length > 0 && (
//                   <div className={cx('result-section')}>
//                     <h4 className={cx('section-title')}>Thú cưng</h4>
//                     {searchResults
//                       .filter(item => item.type === 'pet')
//                       .slice(0, 3)
//                       .map(item => (
//                         <Link 
//                           key={`pet-${item.id}`} 
//                           to={`/pets/${item.id}`} 
//                           className={cx('result-item')}
//                           onClick={() => setShowResults(false)}
//                         >
//                           <div className={cx('item-image')}>
//                             <img src={item.thumbnail} alt={item.name} />
//                           </div>
//                           <div className={cx('item-info')}>
//                             <h5>{item.name}</h5>
//                             <p>${item.price}</p>
//                           </div>
//                         </Link>
//                       ))}
//                   </div>
//                 )}

//                 {/* Hiển thị kết quả phụ kiện */}
//                 {searchResults.filter(item => item.type === 'accessory').length > 0 && (
//                   <div className={cx('result-section')}>
//                     <h4 className={cx('section-title')}>Phụ kiện</h4>
//                     {searchResults
//                       .filter(item => item.type === 'accessory')
//                       .slice(0, 3)
//                       .map(item => (
//                         <Link 
//                           key={`accessory-${item.id}`} 
//                           to={`/accessories/${item.id}`} 
//                           className={cx('result-item')}
//                           onClick={() => setShowResults(false)}
//                         >
//                           <div className={cx('item-image')}>
//                             <img src={item.thumbnail} alt={item.name} />
//                           </div>
//                           <div className={cx('item-info')}>
//                             <h5>{item.name}</h5>
//                             <p>${item.price}</p>
//                           </div>
//                         </Link>
//                       ))}
//                   </div>
//                 )}
//               </div>
              
//               {/* Hiển thị nút xem tất cả kết quả nếu có nhiều hơn */}
//               {searchResults.length > 6 && (
//                 <div className={cx('view-all')}>
//                   <Link 
//                     to={`/search?q=${encodeURIComponent(searchValue)}`}
//                     onClick={() => setShowResults(false)}
//                   >
//                     Xem tất cả kết quả ({searchResults.length})
//                   </Link>
//                 </div>
//               )}
//             </>
//           ) : (
//             <div className={cx('no-results')}>
//               <Empty
//                 image={Empty.PRESENTED_IMAGE_SIMPLE}
//                 description="Không tìm thấy kết quả"
//               />
//             </div>
//           )}
//         </div>
//       )}
//     </div>
//   );
// };

// export default Search;