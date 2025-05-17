package com.java.backend.dto.response;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ApiResponse<T> {
    private boolean success;
    private String message;
    private T data;

    // Constructor bổ sung cho TH không có data
    public ApiResponse(boolean success, String message) {
      this.success = success;
      this.message = message;
      this.data = null;
  }
}