package com.java.backend.service;

import com.java.backend.entity.AccessoryEntity;
import com.java.backend.entity.PetEntity;
import com.java.backend.exception.AppException;
import com.java.backend.exception.ErrorCode;
import com.java.backend.repository.AccessoryRepository;
import com.java.backend.repository.PetRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@Slf4j
@RequiredArgsConstructor
@Transactional
public class InventoryService {
    private final AccessoryRepository accessoryRepository;
    private final PetRepository petRepository;
    private final BaseRedisService baseRedisService;
    
    // Kiểm tra và cập nhật tồn kho
    public boolean checkAndUpdateInventory(String itemType, Long itemId, Integer quantity) {
        if ("pet".equals(itemType)) {
            PetEntity pet = petRepository.findById(itemId)
                .orElseThrow(() -> new AppException(ErrorCode.PET_NOT_FOUND));
                
            // Kiểm tra trạng thái thú cưng
            if (!"available".equals(pet.getStatus())) {
                return false;
            }
            
            // Thú cưng chỉ có thể bán 1 con (không thể bán nhiều)
            if (quantity > 1) {
                throw new AppException(ErrorCode.BAD_REQUEST, "Cannot purchase more than one pet");
            }
            
            // Cập nhật trạng thái
            pet.setStatus("reserved");
            petRepository.save(pet);
            
            // Xóa cache
            baseRedisService.deleteByPattern("pets:");
            
            return true;
        } else if ("accessory".equals(itemType)) {
            AccessoryEntity accessory = accessoryRepository.findById(itemId)
                .orElseThrow(() -> new AppException(ErrorCode.ACCESSORY_NOT_FOUND));
                
            // Kiểm tra số lượng tồn
            if (accessory.getStock() < quantity) {
                return false;
            }
            
            // Cập nhật số lượng tồn
            accessory.setStock(accessory.getStock() - quantity);
            accessoryRepository.save(accessory);
            
            // Xóa cache
            baseRedisService.deleteByPattern("accessories:");
            
            return true;
        }
        
        return false;
    }
    
    // Hoàn trả lại số lượng khi hủy đơn hàng
    public void restoreInventory(String itemType, Long itemId, Integer quantity) {
        try {
            if ("pet".equals(itemType)) {
                PetEntity pet = petRepository.findById(itemId)
                    .orElseThrow(() -> new AppException(ErrorCode.PET_NOT_FOUND));
                
                // Cập nhật trạng thái
                pet.setStatus("available");
                petRepository.save(pet);
                
                // Xóa cache
                baseRedisService.deleteByPattern("pets:");
            } else if ("accessory".equals(itemType)) {
                AccessoryEntity accessory = accessoryRepository.findById(itemId)
                    .orElseThrow(() -> new AppException(ErrorCode.ACCESSORY_NOT_FOUND));
                
                // Cập nhật số lượng tồn
                accessory.setStock(accessory.getStock() + quantity);
                accessoryRepository.save(accessory);
                
                // Xóa cache
                baseRedisService.deleteByPattern("accessories:");
            }
        } catch (Exception e) {
            log.error("Error restoring inventory: {}", e.getMessage());
            throw new AppException(ErrorCode.INTERNAL_SERVER_ERROR);
        }
    }
}