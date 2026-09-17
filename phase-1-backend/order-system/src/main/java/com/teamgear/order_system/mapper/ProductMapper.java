package com.teamgear.order_system.mapper;

import com.teamgear.order_system.dto.CreateProductDTO;
import com.teamgear.order_system.dto.ProductDTO;
import com.teamgear.order_system.entity.Product;

public class ProductMapper {

    public static ProductDTO toDTO(Product product) {
        return new ProductDTO(
                product.getId(),
                product.getName(),
                product.getPrice(),
                product.getCategory()
        );
    }

    public static Product toEntity(CreateProductDTO dto) {
        return new Product(
                null,
                dto.name(),
                null,
                dto.price(),
                dto.category()
        );
    }
}
