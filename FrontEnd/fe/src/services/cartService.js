import * as request from '../utils/request';

export const addToCart = async (item) => {
  try {
    // Convert values to appropriate types
    const itemData = {
      itemType: item.type,
      itemId: Number(item.itemId) || item.itemId,
      quantity: Number(item.quantity)
    };
    
    // Package data in the format backend expects
    const payload = {
      items: [itemData]
    };
    
    console.log('Sending cart request with data:', payload);
    
    const response = await request.post('/cart', payload);
    console.log('Add to cart response:', response);
    
    // Lưu một bản sao vào localStorage để dự phòng
    try {
      // Thêm trực tiếp vào localStorage backup
      const backupCart = localStorage.getItem('cartBackup');
      let cart = backupCart ? JSON.parse(backupCart) : { items: [], totalAmount: 0, totalItems: 0 };
      
      // Tìm xem item đã có trong giỏ chưa
      const existingItem = cart.items.find(i => 
        i.itemType === itemData.itemType && i.itemId === itemData.itemId
      );
      
      if (existingItem && itemData.quantity > 0) {
        // Cập nhật số lượng nếu đã có
        existingItem.quantity = itemData.quantity;
        existingItem.subtotal = existingItem.price * itemData.quantity;
      } else if (itemData.quantity > 0) {
        // Thêm item mới
        cart.items.push({
          itemId: itemData.itemId,
          itemType: itemData.itemType,
          name: `Item ${itemData.itemId}`,
          price: 0, // Sẽ được cập nhật sau
          quantity: itemData.quantity,
          subtotal: 0
        });
      } else if (existingItem) {
        // Xóa item nếu quantity = 0
        cart.items = cart.items.filter(i => 
          !(i.itemType === itemData.itemType && i.itemId === itemData.itemId)
        );
      }
      
      // Cập nhật tổng
      cart.totalItems = cart.items.reduce((sum, i) => sum + i.quantity, 0);
      cart.totalAmount = cart.items.reduce((sum, i) => sum + (i.subtotal || 0), 0);
      
      localStorage.setItem('cartBackup', JSON.stringify(cart));
    } catch (storageError) {
      console.warn('Failed to update localStorage cart', storageError);
    }
    
    // Dispatch event sau một khoảng thời gian để đảm bảo đã cập nhật Redis
    setTimeout(() => {
      window.dispatchEvent(new Event("cartUpdated"));
      console.log('Cart updated event dispatched');
    }, 300);
    
    return response;
  } catch (error) {
    console.error('Add to cart error:', error);
    throw error;
  }
};

export const getCart = async () => {
  try {
    console.log('Fetching cart from API');
    const response = await request.get('/cart');
    console.log('Get cart response:', response);
    
    // Đảm bảo response có đúng cấu trúc
    if (response && response.success) {
      // Đảm bảo response.data tồn tại và có items
      if (!response.data) {
        console.log('Response data is missing, using empty cart');
        response.data = { items: [], totalAmount: 0, totalItems: 0 };
      } else if (!response.data.items) {
        console.log('Response data.items is missing, initializing empty array');
        response.data.items = [];
        response.data.totalAmount = response.data.totalAmount || 0;
        response.data.totalItems = response.data.totalItems || 0;
      }
      
      // Lưu vào localStorage để dự phòng
      try {
        localStorage.setItem('cartBackup', JSON.stringify(response.data));
      } catch (e) {
        console.warn('Failed to save cart to localStorage', e);
      }
    } else if (!response) {
      // Nếu không có response, tìm từ localStorage
      try {
        const backupCart = localStorage.getItem('cartBackup');
        if (backupCart) {
          const parsedCart = JSON.parse(backupCart);
          console.log('Using backup cart from localStorage');
          return {
            success: true,
            message: 'Cart retrieved from localStorage',
            data: parsedCart
          };
        }
      } catch (e) {
        console.warn('Failed to retrieve backup cart from localStorage', e);
      }
      
      // Trả về giỏ hàng rỗng nếu không có gì
      return {
        success: true,
        message: 'Empty cart returned',
        data: { items: [], totalAmount: 0, totalItems: 0 }
      };
    }
    
    return response;
  } catch (error) {
    console.error('Get cart error:', error);
    
    // Trả về giỏ hàng từ localStorage nếu API lỗi
    try {
      const backupCart = localStorage.getItem('cartBackup');
      if (backupCart) {
        return {
          success: true,
          message: 'Cart retrieved from localStorage (API failed)',
          data: JSON.parse(backupCart)
        };
      }
    } catch (storageError) {
      console.error('Error reading from localStorage:', storageError);
    }
    
    // Trả về giỏ hàng rỗng nếu không có gì
    return {
      success: true,
      message: 'Empty cart returned (API failed)',
      data: { items: [], totalAmount: 0, totalItems: 0 }
    };
  }
};


// Hàm trợ giúp xử lý localStorage
function getLocalStorageCart() {
  const cart = localStorage.getItem('cart');
  if (cart) {
    return JSON.parse(cart);
  }
  return { items: [], totalAmount: 0, totalItems: 0 };
}

function saveLocalStorageCart(cart) {
  localStorage.setItem('cart', JSON.stringify(cart));
}

function updateLocalStorageCartItem(cart, itemData) {
  // Xóa item nếu quantity = 0
  if (itemData.quantity <= 0) {
    cart.items = cart.items.filter(i => 
      !(i.itemType === itemData.itemType && i.itemId === itemData.itemId)
    );
  } else {
    // Tìm item đã tồn tại
    const existingItem = cart.items.find(i => 
      i.itemType === itemData.itemType && i.itemId === itemData.itemId
    );
    
    if (existingItem) {
      // Cập nhật số lượng
      existingItem.quantity = itemData.quantity;
      existingItem.subtotal = existingItem.price * itemData.quantity;
    } else {
      // Thêm item mới (với giá tạm thời)
      cart.items.push({
        itemId: itemData.itemId,
        itemType: itemData.itemType,
        name: `Item ${itemData.itemId}`,
        price: 0, // Sẽ được cập nhật khi loadProductDetails
        quantity: itemData.quantity,
        subtotal: 0, // Sẽ được cập nhật khi loadProductDetails
      });
      
      // Thử tải thông tin chi tiết sản phẩm
      loadProductDetails(itemData.itemType, itemData.itemId)
        .then(details => {
          if (details) {
            const updatedCart = getLocalStorageCart();
            const itemToUpdate = updatedCart.items.find(i => 
              i.itemType === itemData.itemType && i.itemId === itemData.itemId
            );
            
            if (itemToUpdate) {
              itemToUpdate.name = details.name;
              itemToUpdate.price = details.price;
              itemToUpdate.subtotal = details.price * itemToUpdate.quantity;
              itemToUpdate.thumbnail = details.thumbnail;
              
              saveLocalStorageCart(updatedCart);
              console.log('Updated item details in localStorage');
            }
          }
        })
        .catch(error => console.error('Error loading product details:', error));
    }
  }
  
  // Tính lại tổng
  cart.totalItems = cart.items.reduce((sum, item) => sum + item.quantity, 0);
  cart.totalAmount = cart.items.reduce((sum, item) => sum + (item.subtotal || 0), 0);
}

// Hàm tải chi tiết sản phẩm
async function loadProductDetails(type, id) {
  try {
    if (type === 'pet') {
      const response = await request.get(`/pets/${id}`);
      if (response && response.success && response.data) {
        return {
          name: response.data.name,
          price: response.data.price,
          thumbnail: response.data.thumbnail
        };
      }
    } else if (type === 'accessory') {
      const response = await request.get(`/accessories/${id}`);
      if (response && response.success && response.data) {
        return {
          name: response.data.name,
          price: response.data.price,
          thumbnail: response.data.thumbnail
        };
      }
    }
    return null;
  } catch (error) {
    console.error('Error loading product details:', error);
    return null;
  }
}

export const clearCart = async () => {
  try {
    const response = await request.del('/cart');
    // Thông báo cho các component khác biết giỏ hàng đã được cập nhật
    setTimeout(() => {
      window.dispatchEvent(new Event("cartUpdated"));
    }, 100);
    return response;
  } catch (error) {
    console.error('Clear cart error:', error);
    throw error;
  }
};