package com.skullzuess.ecommerce.dto;

import java.math.BigDecimal;
import java.util.Date;
import java.util.List;

// OrderDTO.java
public record OrderDTO(
        Long id,
        String orderTrackingNumber,
        int totalQuantity,
        BigDecimal totalPrice,
        String status,
        Date dateCreated,
        Date lastUpdated,
        List<OrderItemDTO> items
) {}
