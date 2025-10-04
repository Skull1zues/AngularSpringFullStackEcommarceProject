package com.skullzuess.ecommerce.dto;

import java.math.BigDecimal;

// OrderItemDTO.java
public record OrderItemDTO(
        Long id,
        String imageUrl,
        BigDecimal unitPrice,
        int quantity,
        Long productId
) {}
