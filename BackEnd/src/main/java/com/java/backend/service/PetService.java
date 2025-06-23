package com.java.backend.service;

import com.java.backend.entity.PetEntity;
import com.java.backend.entity.UserEntity;
import com.java.backend.entity.BreedEntity;
import com.java.backend.exception.AppException;
import com.java.backend.exception.ErrorCode;
import com.java.backend.dto.request.PetRequest;
import com.java.backend.dto.response.PetResponse;
import com.java.backend.dto.response.Pagination;
import com.java.backend.repository.PetRepository;
import com.java.backend.repository.BreedRepository;
import com.java.backend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.web.multipart.MultipartFile;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;
import java.util.concurrent.TimeUnit;
import com.fasterxml.jackson.core.type.TypeReference;

@Service
@Slf4j
@RequiredArgsConstructor
@Transactional
public class PetService {
  private final PetRepository petRepository;
  private final BreedRepository breedRepository;
  private final UserRepository userRepository;
  private final UploadFileService uploadFileService;
  private final BaseRedisService baseRedisService;

  // Lấy thông tin người dùng hiện tại
  public UserEntity getUser() {
    Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
    if (authentication == null || !authentication.isAuthenticated()) {
      throw new AppException(ErrorCode.UNAUTHORIZED);
    }
    String username = authentication.getName();
    return userRepository.findByUsername(username)
        .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_EXISTED));
  }

  // Kiểm tra quyền ADMIN
  private boolean checkRoleAdmin() {
    return SecurityContextHolder.getContext().getAuthentication().getAuthorities()
        .stream().anyMatch(auth -> auth.getAuthority().equals("ROLE_ADMIN"));
  }

  // Thêm thú cưng mới
  @PreAuthorize("hasRole('ADMIN')")
  public PetResponse addPet(PetRequest request, MultipartFile thumbnailFile, List<MultipartFile> imageFiles) {
    try {
      // Kiểm tra breed tồn tại
      BreedEntity breed = breedRepository.findById(request.getBreedId())
          .orElseThrow(() -> new AppException(ErrorCode.BREED_NOT_FOUND));

      // Upload thumbnail
      String thumbnail = uploadFileService.uploadFile(thumbnailFile);

      // Upload images
      List<String> imageUrls = new ArrayList<>();
      for (MultipartFile imageFile : imageFiles) {
        String imageUrl = uploadFileService.uploadFile(imageFile);
        imageUrls.add(imageUrl);
      }

      // Lưu dữ liệu vào DB
      PetEntity pet = PetEntity.builder()
          .petName(request.getPetName())
          .type(request.getType())
          .breed(breed)
          .gender(request.getGender())
          .unitPrice(request.getUnitPrice())
          .age(request.getAge())
          .status("available")
          .thumbnail(thumbnail)
          .images(String.join(",", imageUrls))
          .build();

      PetEntity savedPet = petRepository.save(pet);

      // Clear cache
      baseRedisService.deleteKeys("pets_*");

      return convertToPetResponse(savedPet);
    } catch (Exception e) {
      log.error("Error adding pet: {}", e.getMessage());
      throw new AppException(ErrorCode.INTERNAL_SERVER_ERROR);
    }
  }

  // Lấy danh sách thú cưng
  public Pagination<PetResponse> getAllPets(int page, int size, String type, Long breedId) {
    String cacheKey = "pets_" + page + "_" + size + "_" + type + "_" + breedId;

    // Kiểm tra cache
    Pagination<PetResponse> cachedResult = baseRedisService.get(cacheKey, new TypeReference<Pagination<PetResponse>>() {
    });
    if (cachedResult != null) {
      return cachedResult;
    }

    try {
      Pageable pageable = PageRequest.of(page, size, Sort.by(Sort.Direction.DESC, "createdAt"));
      Page<PetEntity> petPage;

      if (type != null && breedId != null) {
        petPage = petRepository.findByTypeAndBreed_IdAndStatus(type, breedId, "available", pageable);
      } else if (type != null) {
        petPage = petRepository.findByTypeAndStatus(type, "available", pageable);
      } else if (breedId != null) {
        petPage = petRepository.findByBreed_IdAndStatus(breedId, "available", pageable);
      } else {
        petPage = petRepository.findByStatus("available", pageable);
      }
      List<PetResponse> pets = petPage.getContent().stream()
          .map(this::convertToPetResponse)
          .collect(Collectors.toList());

      Pagination<PetResponse> pagination = new Pagination<>();
      pagination.setContent(pets);
      pagination.setPage(page);
      pagination.setSize(size);
      pagination.setTotalElements(petPage.getTotalElements());
      pagination.setTotalPages(petPage.getTotalPages());

      // Lưu vào cache
      baseRedisService.setObjectForMinutes(cacheKey, pagination, 10);

      return pagination;
    } catch (Exception e) {
      log.error("Error getting pets: {}", e.getMessage());
      throw new AppException(ErrorCode.INTERNAL_SERVER_ERROR);
    }
  }

  // Lấy thông tin chi tiết thú cưng
  public PetResponse getPetById(Long petId) {
    String cacheKey = "pet_" + petId;

    // Kiểm tra cache
    PetResponse cachedResult = baseRedisService.get(cacheKey, new TypeReference<PetResponse>() {
    });
    if (cachedResult != null) {
      return cachedResult;
    }

    PetEntity pet = petRepository.findById(petId)
        .orElseThrow(() -> new AppException(ErrorCode.PET_NOT_FOUND));

    PetResponse response = convertToPetResponse(pet);

    // Lưu vào cache
    baseRedisService.set(cacheKey, response, 30, TimeUnit.MINUTES);

    return response;
  }

  // Cập nhật thông tin thú cưng
  @PreAuthorize("hasRole('ADMIN')")
  public PetResponse updatePet(Long petId, PetRequest request, MultipartFile thumbnailFile,
      List<MultipartFile> imageFiles) {
    PetEntity pet = petRepository.findById(petId)
        .orElseThrow(() -> new AppException(ErrorCode.PET_NOT_FOUND));

    // Cập nhật thông tin chủng loại nếu có
    if (request.getBreedId() != null) {
      BreedEntity breed = breedRepository.findById(request.getBreedId())
          .orElseThrow(() -> new AppException(ErrorCode.BREED_NOT_FOUND));
      pet.setBreed(breed);
    }

    // Cập nhật các thông tin khác
    if (request.getPetName() != null)
      pet.setPetName(request.getPetName());
    if (request.getType() != null)
      pet.setType(request.getType());
    if (request.getGender() != null)
      pet.setGender(request.getGender());
    if (request.getUnitPrice() != null)
      pet.setUnitPrice(request.getUnitPrice());
    if (request.getAge() != null)
      pet.setAge(request.getAge());
    if (request.getStatus() != null)
      pet.setStatus(request.getStatus());

    // Cập nhật thumbnail nếu có
    if (thumbnailFile != null && !thumbnailFile.isEmpty()) {
      String thumbnail = uploadFileService.uploadFile(thumbnailFile);
      pet.setThumbnail(thumbnail);
    }

    // Cập nhật images nếu có
    if (imageFiles != null && !imageFiles.isEmpty()) {
      List<String> imageUrls = new ArrayList<>();
      for (MultipartFile imageFile : imageFiles) {
        String imageUrl = uploadFileService.uploadFile(imageFile);
        imageUrls.add(imageUrl);
      }
      pet.setImages(String.join(",", imageUrls));
    }

    PetEntity updatedPet = petRepository.save(pet);

    // Clear cache
    baseRedisService.deleteKey("pet_" + petId);
    baseRedisService.deleteKeys("pets_*");

    return convertToPetResponse(updatedPet);
  }

  // Xóa thú cưng
  @PreAuthorize("hasRole('ADMIN')")
  public void deletePet(Long petId) {
    PetEntity pet = petRepository.findById(petId)
        .orElseThrow(() -> new AppException(ErrorCode.PET_NOT_FOUND));

    petRepository.delete(pet);

    // Clear cache
    baseRedisService.deleteKey("pet_" + petId);
    baseRedisService.deleteKeys("pets_*");
  }

  // Chuyển đổi từ entity sang response
  private PetResponse convertToPetResponse(PetEntity pet) {
    List<String> imagesList = new ArrayList<>();
    if (pet.getImages() != null && !pet.getImages().isEmpty()) {
      String[] imagesArray = pet.getImages().split(",");
      for (String image : imagesArray) {
        imagesList.add(image);
      }
    }

    return PetResponse.builder()
        .petId(pet.getPetId())
        .petName(pet.getPetName())
        .type(pet.getType())
        .breed(pet.getBreed() != null ? pet.getBreed().getBreedName() : null)
        .breedId(pet.getBreed() != null ? pet.getBreed().getId() : null)
        .gender(pet.getGender())
        .unitPrice(pet.getUnitPrice())
        .age(pet.getAge())
        .status(pet.getStatus())
        .thumbnail(pet.getThumbnail())
        .images(imagesList)
        .createdAt(pet.getCreatedAt())
        .updatedAt(pet.getUpdatedAt())
        .build();
  }

  public List<PetResponse> searchPetsByName(String query) {
    List<PetEntity> pets = petRepository.findByPetNameContainingIgnoreCaseAndStatus(query, "available");
    return pets.stream()
        .map(this::convertToPetResponse)
        .collect(Collectors.toList());
  }
}