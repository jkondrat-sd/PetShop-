package com.java.backend.service;

import com.fasterxml.jackson.core.type.TypeReference;
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
import org.springframework.data.domain.Sort;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.concurrent.TimeUnit;
import java.util.stream.Collectors;

@Service
@Slf4j
@RequiredArgsConstructor
@Transactional
public class BreedService {
    private final BreedRepository breedRepository;
    private final BaseRedisService baseRedisService;

    public Pagination<BreedResponse> getAllBreeds(int page, int size) {
        String cacheKey = "breeds:" + page + ":" + size;
        Pagination<BreedResponse> cachedResult = baseRedisService.get(cacheKey, new TypeReference<Pagination<BreedResponse>>() {});
        if (cachedResult != null) {
            return cachedResult;
        }

        Pageable pageable = PageRequest.of(page, size, Sort.by(Sort.Direction.DESC, "id"));
        Page<BreedEntity> breedPage = breedRepository.findAll(pageable);
        List<BreedResponse> breeds = breedPage.getContent().stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());

        Pagination<BreedResponse> pagination = Pagination.<BreedResponse>builder()
                .content(breeds)
                .totalElements(breedPage.getTotalElements())
                .totalPages(breedPage.getTotalPages())
                .page(page)
                .build();

        baseRedisService.set(cacheKey, pagination, 60 * 24, TimeUnit.MINUTES);
        return pagination;
    }

    public List<BreedResponse> getBreedsByPetType(String petType) {
        String cacheKey = "breeds:type:" + petType;
        List<BreedResponse> cachedResult = baseRedisService.get(cacheKey, new TypeReference<List<BreedResponse>>() {});
        if (cachedResult != null) {
            return cachedResult;
        }
        
        try {
            List<BreedEntity> breeds = breedRepository.findByPetType(petType);
            
            List<BreedResponse> breedResponses = breeds.stream()
                    .map(this::mapToResponse)
                    .collect(Collectors.toList());
            
            baseRedisService.set(cacheKey, breedResponses, 60 * 24, TimeUnit.MINUTES);
            
            return breedResponses;
        } catch (Exception e) {
            log.error("Error getting breeds by type {}: {}", petType, e.getMessage());
            throw new AppException(ErrorCode.INTERNAL_SERVER_ERROR);
        }
    }

    public BreedResponse getBreedById(Long id) {
        String cacheKey = "breed:" + id;
        BreedResponse cachedBreed = baseRedisService.get(cacheKey, BreedResponse.class);
        if (cachedBreed != null) {
            return cachedBreed;
        }

        BreedEntity breed = breedRepository.findById(id)
                .orElseThrow(() -> new AppException(ErrorCode.BREED_NOT_FOUND));
        BreedResponse response = mapToResponse(breed);
        baseRedisService.set(cacheKey, response, 60 * 24, TimeUnit.MINUTES);
        return response;
    }

    @PreAuthorize("hasRole('ADMIN')")
    public BreedResponse createBreed(BreedRequest request) {
        if (breedRepository.existsByBreedName(request.getBreedName())) {
            throw new AppException(ErrorCode.BREED_EXISTED);
        }

        BreedEntity breed = BreedEntity.builder()
                .breedName(request.getBreedName())
                .petType(request.getPetType())
                .description(request.getDescription())
                .status(request.getStatus())
                .build();

        BreedEntity savedBreed = breedRepository.save(breed);
        return mapToResponse(savedBreed);
    }

    @PreAuthorize("hasRole('ADMIN')")
    public BreedResponse updateBreed(Long id, BreedRequest request) {
        BreedEntity breed = breedRepository.findById(id)
                .orElseThrow(() -> new AppException(ErrorCode.BREED_NOT_FOUND));

        if (!breed.getBreedName().equals(request.getBreedName()) &&
                breedRepository.existsByBreedName(request.getBreedName())) {
            throw new AppException(ErrorCode.BREED_EXISTED);
        }

        breed.setBreedName(request.getBreedName());
        breed.setPetType(request.getPetType());
        breed.setDescription(request.getDescription());
        breed.setStatus(request.getStatus());

        BreedEntity updatedBreed = breedRepository.save(breed);
        return mapToResponse(updatedBreed);
    }

    @PreAuthorize("hasRole('ADMIN')")
    public void deleteBreed(Long id) {
        if (!breedRepository.existsById(id)) {
            throw new AppException(ErrorCode.BREED_NOT_FOUND);
        }
        breedRepository.deleteById(id);
    }

    private BreedResponse mapToResponse(BreedEntity entity) {
        return BreedResponse.builder()
                .id(entity.getId())
                .breedName(entity.getBreedName())
                .description(entity.getDescription())
                .build();
    }
}