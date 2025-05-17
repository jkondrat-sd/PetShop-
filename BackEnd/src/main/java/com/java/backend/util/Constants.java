package com.java.backend.util;

/**
 * Class chứa các hằng số được sử dụng trong ứng dụng
 */
public class Constants {
    // Hằng số cho trạng thái đơn hàng
    public static final String ORDER_STATUS_PENDING = "pending";
    public static final String ORDER_STATUS_PAID = "paid";
    public static final String ORDER_STATUS_PROCESSING = "processing";
    public static final String ORDER_STATUS_SHIPPED = "shipped";
    public static final String ORDER_STATUS_DELIVERED = "delivered";
    public static final String ORDER_STATUS_CANCELLED = "cancelled";
    
    // Hằng số cho loại sản phẩm
    public static final String ITEM_TYPE_PET = "pet";
    public static final String ITEM_TYPE_ACCESSORY = "accessory";
    
    // Hằng số cho trạng thái thú cưng
    public static final String PET_STATUS_AVAILABLE = "available";
    public static final String PET_STATUS_SOLD = "sold";
    public static final String PET_STATUS_RESERVED = "reserved";
    
    // Hằng số cho trạng thái phụ kiện
    public static final String ACCESSORY_STATUS_ACTIVE = "active";
    public static final String ACCESSORY_STATUS_INACTIVE = "inactive";
    
    // Cache keys
    public static final String CACHE_KEY_PETS = "pets:";
    public static final String CACHE_KEY_ACCESSORIES = "accessories:";
    public static final String CACHE_KEY_CART = "cart:";
    
    // Thời gian hết hạn cache (phút)
    public static final long CACHE_EXPIRATION_MINUTES = 60;
    
    // Đường dẫn upload
    public static final String CLOUDINARY_FOLDER = "pet-shop";
}