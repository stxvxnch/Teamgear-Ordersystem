package com.teamgear.order_system.service;

import com.teamgear.order_system.dto.CreateProductDTO;
import com.teamgear.order_system.dto.ProductDTO;
import com.teamgear.order_system.entity.Product;
import com.teamgear.order_system.mapper.ProductMapper;
import com.teamgear.order_system.repository.ProductRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class ProductService {
    private final ProductRepository productRepository;

    public ProductService(ProductRepository productRepository) {
        this.productRepository = productRepository;
    }

    public List<ProductDTO> findAll() {
        return productRepository.findAll().stream()
                .map(ProductMapper::toDTO)
                .toList();
    }

    public Optional<ProductDTO> findById(Long id) {
        return productRepository.findById(id)
                .map(ProductMapper::toDTO);
    }

    public ProductDTO create(CreateProductDTO dto) {
        Product product = ProductMapper.toEntity(dto);
        Product saved = productRepository.save(product);
        return ProductMapper.toDTO(saved);
    }
}
