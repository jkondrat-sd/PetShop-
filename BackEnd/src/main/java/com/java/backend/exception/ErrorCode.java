package com.java.backend.exception;

import lombok.Getter;
import org.springframework.http.HttpStatus;

@Getter
public enum ErrorCode {
    // Common
    INTERNAL_SERVER_ERROR(HttpStatus.INTERNAL_SERVER_ERROR, "Internal server error"),
    BAD_REQUEST(HttpStatus.BAD_REQUEST, "Bad request"),
    UNAUTHORIZED(HttpStatus.UNAUTHORIZED, "Unauthorized"),
    FORBIDDEN(HttpStatus.FORBIDDEN, "Forbidden"),
    NOT_FOUND(HttpStatus.NOT_FOUND, "Resource not found"),
    AUTHENTICATION_FAILED(HttpStatus.UNAUTHORIZED, "Authentication failed"),
    
    // User
    USER_NOT_EXISTED(HttpStatus.NOT_FOUND, "User not found"),
    USER_NOT_FOUND(HttpStatus.NOT_FOUND, "User not found"),
    USER_EXISTED(HttpStatus.BAD_REQUEST, "Username already exists"),
    EMAIL_EXISTED(HttpStatus.BAD_REQUEST, "Email already exists"),
    PASSWORD_NOT_MATCH(HttpStatus.BAD_REQUEST, "Password does not match"),
    ROLE_NOT_FOUND(HttpStatus.NOT_FOUND, "Role not found"),
    REGISTRATION_FAILED(HttpStatus.BAD_REQUEST, "Registration failed"),
    
    // Pet
    PET_NOT_FOUND(HttpStatus.NOT_FOUND, "Pet not found"),
    PET_NOT_AVAILABLE(HttpStatus.BAD_REQUEST, "Pet is not available"),
    
    // Accessory
    ACCESSORY_NOT_FOUND(HttpStatus.NOT_FOUND, "Accessory not found"),
    INSUFFICIENT_STOCK(HttpStatus.BAD_REQUEST, "Insufficient stock"),
    OUT_OF_STOCK(HttpStatus.BAD_REQUEST, "Item is out of stock"),
    
    // Breed
    BREED_NOT_FOUND(HttpStatus.NOT_FOUND, "Breed not found"),
    BREED_EXISTED(HttpStatus.BAD_REQUEST, "Breed already exists"),
    
    // Category
    CATEGORY_NOT_FOUND(HttpStatus.NOT_FOUND, "Category not found"),
    CATEGORY_ALREADY_EXISTS(HttpStatus.BAD_REQUEST, "Category already exists"),
    
    // Order
    ORDER_NOT_FOUND(HttpStatus.NOT_FOUND, "Order not found"),
    ORDER_CANNOT_CANCEL(HttpStatus.BAD_REQUEST, "Order cannot be cancelled"),
    INVALID_ORDER_STATUS(HttpStatus.BAD_REQUEST, "Invalid order status"),
    
    // Payment
    PAYMENT_FAILED(HttpStatus.BAD_REQUEST, "Payment failed"),
    
    // Review
    REVIEW_NOT_FOUND(HttpStatus.NOT_FOUND, "Review not found"),
    ALREADY_REVIEWED(HttpStatus.BAD_REQUEST, "You have already reviewed this item");
    
    private final HttpStatus status;
    private final String message;
    
    ErrorCode(HttpStatus status, String message) {
        this.status = status;
        this.message = message;
    }
}