package com.java.backend.service;

import com.java.backend.dto.request.BreedRequest;
import com.java.backend.dto.response.BreedResponse;
import com.java.backend.dto.response.Pagination;
import com.java.backend.entity.BreedEntity;
import com.java.backend.exception.AppException;
import com.java.backend.exception.ErrorCode;
import com.java.backend.repository.BreedRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@Slf4j
@RequiredArgsConstructor
@Transactional
public class BreedService {
    private final BreedRepository breedRepository;
    private final BaseRedisService baseRedisService;

    public Pagination<BreedResponse> getAllBreeds(int page, int size) {
        String cacheKey = "breeds_" + page + "_" + size;
        
        // Kiểm tra cache
        Object cachedResult = baseRedisService.get(cacheKey);
        if (cachedResult instanceof Pagination) {
            return (Pagination<BreedResponse>) cachedResult;
        }
        
        try {
            Pageable pageable = PageRequest.of(page, size);
            Page<BreedEntity> breedPage = breedRepository.findByStatus("active", pageable);
            
            List<BreedResponse> breeds = breedPage.getContent().stream()
                    .map(this::convertToBreedResponse)
                    .collect(Collectors.toList());
            
            Pagination<BreedResponse> pagination = new Pagination<>();
            pagination.setContent(breeds);
            pagination.setPage(page);
            pagination.setSize(size);
            pagination.setTotalElements(breedPage.getTotalElements());
            pagination.setTotalPages(breedPage.getTotalPages());
            
            // Lưu vào cache
            baseRedisService.setObjectForMinutes(cacheKey, pagination, 10);
            
            return pagination;
        } catch (Exception e) {
            log.error("Error getting breeds: {}", e.getMessage());
            throw new AppException(ErrorCode.INTERNAL_SERVER_ERROR);
        }
    }

    public List<BreedResponse> getBreedsByType(String petType) {
        String cacheKey = "breeds_type_" + petType;
        
        // Kiểm tra cache
        Object cachedResult = baseRedisService.get(cacheKey);
        if (cachedResult instanceof List) {
            return (List<BreedResponse>) cachedResult;
        }
        
        try {
            List<BreedEntity> breeds = breedRepository.findByPetType(petType);
            
            List<BreedResponse> breedResponses = breeds.stream()
                    .map(this::convertToBreedResponse)
                    .collect(Collectors.toList());
            
            // Lưu vào cache
            baseRedisService.setObjectForMinutes(cacheKey, breedResponses, 30);
            
            return breedResponses;
        } catch (Exception e) {
            log.error("Error getting breeds by type {}: {}", petType, e.getMessage());
            throw new AppException(ErrorCode.INTERNAL_SERVER_ERROR);
        }
    }

    public BreedResponse getBreedById(Long breedId) {
        String cacheKey = "breed_" + breedId;
        
        // Kiểm tra cache
        Object cachedResult = baseRedisService.get(cacheKey);
        if (cachedResult instanceof BreedResponse) {
            return (BreedResponse) cachedResult;
        }
        
        BreedEntity breed = breedRepository.findById(breedId)
                .orElseThrow(() -> new AppException(ErrorCode.BREED_NOT_FOUND));
        
        BreedResponse response = convertToBreedResponse(breed);
        
        // Lưu vào cache
        baseRedisService.setObjectForMinutes(cacheKey, response, 30);
        
        return response;
    }

    @PreAuthorize("hasRole('ADMIN')")
    public BreedResponse addBreed(BreedRequest request) {
        if (breedRepository.existsByBreedName(request.getBreedName())) {
            throw new AppException(ErrorCode.BREED_EXISTED);
        }
        
        BreedEntity breed = BreedEntity.builder()
                .breedName(request.getBreedName())
                .petType(request.getPetType())
                .description(request.getDescription())
                .status("active")
                .build();
        
        BreedEntity savedBreed = breedRepository.save(breed);
        
        // Clear cache
        baseRedisService.deleteKeys("breeds_*");
        
        return convertToBreedResponse(savedBreed);
    }

    @PreAuthorize("hasRole('ADMIN')")
    public BreedResponse updateBreed(Long breedId, BreedRequest request) {
        BreedEntity breed = breedRepository.findById(breedId)
                .orElseThrow(() -> new AppException(ErrorCode.BREED_NOT_FOUND));
        
        // Update fields
        if (request.getBreedName() != null) breed.setBreedName(request.getBreedName());
        if (request.getPetType() != null) breed.setPetType(request.getPetType());
        if (request.getDescription() != null) breed.setDescription(request.getDescription());
        if (request.getStatus() != null) breed.setStatus(request.getStatus());
        
        BreedEntity updatedBreed = breedRepository.save(breed);
        
        // Clear cache
        baseRedisService.deleteKey("breed_" + breedId);
        baseRedisService.deleteKeys("breeds_*");
        
        return convertToBreedResponse(updatedBreed);
    }

    @PreAuthorize("hasRole('ADMIN')")
    public void deleteBreed(Long breedId) {
        BreedEntity breed = breedRepository.findById(breedId)
                .orElseThrow(() -> new AppException(ErrorCode.BREED_NOT_FOUND));
        
        // Soft delete - set status to inactive
        breed.setStatus("inactive");
        breedRepository.save(breed);
        
        // Clear cache
        baseRedisService.deleteKey("breed_" + breedId);
        baseRedisService.deleteKeys("breeds_*");
    }
    
    private BreedResponse convertToBreedResponse(BreedEntity breed) {
        return BreedResponse.builder()
                .breedId(breed.getBreedId())
                .breedName(breed.getBreedName())
                .petType(breed.getPetType())
                .description(breed.getDescription())
                .status(breed.getStatus())
                .build();
    }
}