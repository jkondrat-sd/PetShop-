package com.java.backend.controller;

import com.java.backend.dto.response.ApiResponse;
import com.java.backend.dto.response.PetResponse;
import com.java.backend.dto.response.AccessoryResponse;
import com.java.backend.service.PetService;
import com.java.backend.service.AccessoryService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.List;

@RestController
@RequestMapping("/api/search")
@RequiredArgsConstructor
public class SearchController {
    private final PetService petService;
    private final AccessoryService accessoryService;

    @GetMapping
    public ResponseEntity<ApiResponse<List<Object>>> searchAll(@RequestParam String query) {
        List<Object> results = new ArrayList<>();
        // Tìm kiếm thú cưng
        List<PetResponse> pets = petService.searchPetsByName(query);
        // Tìm kiếm phụ kiện
        List<AccessoryResponse> accessories = accessoryService.searchAccessoriesByName(query);
        results.addAll(pets);
        results.addAll(accessories);
        return ResponseEntity.ok(new ApiResponse<>(true, "Search results", results));
    }
}
