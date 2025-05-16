package com.java.backend.exception;

import com.java.backend.dto.response.ApiResponse;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

@RestControllerAdvice
@Slf4j
public class GlobalExceptionHandler {

    @ExceptionHandler(AppException.class)
    public ResponseEntity<ApiResponse<String>> handleAppException(AppException ex) {
        log.error("App exception: {}", ex.getMessage());
        return ResponseEntity
                .status(ex.getErrorCode().getStatus())
                .body(new ApiResponse<>(false, ex.getMessage(), null));
    }

    @ExceptionHandler(BadCredentialsException.class)
    public ResponseEntity<ApiResponse<String>> handleBadCredentialsException(BadCredentialsException ex) {
        log.error("Bad credentials: {}", ex.getMessage());
        return ResponseEntity
                .status(ErrorCode.AUTHENTICATION_FAILED.getStatus())
                .body(new ApiResponse<>(false, "Invalid username or password", null));
    }

    @ExceptionHandler(AccessDeniedException.class)
    public ResponseEntity<ApiResponse<String>> handleAccessDeniedException(AccessDeniedException ex) {
        log.error("Access denied: {}", ex.getMessage());
        return ResponseEntity
                .status(ErrorCode.UNAUTHORIZED.getStatus())
                .body(new ApiResponse<>(false, "Access denied", null));
    }

    @ExceptionHandler(Exception.class)
    public ResponseEntity<ApiResponse<String>> handleGlobalException(Exception ex) {
        log.error("Unhandled exception: {}", ex.getMessage(), ex);
        return ResponseEntity
                .status(ErrorCode.INTERNAL_SERVER_ERROR.getStatus())
                .body(new ApiResponse<>(false, "An unexpected error occurred", null));
    }
}