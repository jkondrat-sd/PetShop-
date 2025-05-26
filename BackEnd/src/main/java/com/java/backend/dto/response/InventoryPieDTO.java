package com.java.backend.dto.response;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class InventoryPieDTO {
    private String type; // Pet/Accessory/...
    private int value;   // Số lượng tồn kho
}
