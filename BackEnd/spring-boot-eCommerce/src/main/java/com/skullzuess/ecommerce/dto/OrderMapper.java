package com.skullzuess.ecommerce.dto;

import com.skullzuess.ecommerce.entity.Order;
import com.skullzuess.ecommerce.entity.OrderItem;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;
import java.util.Date;
import java.util.List;

@Component
public class OrderMapper {

    public OrderDTO toDto(Order order) {
        List<OrderItemDTO> itemDTOs = order.getOrderItems().stream()
                .map(this::toDto)
                .toList();

        return new OrderDTO(
                order.getId(),
                order.getOrderTrackingNumber(),
                order.getTotalQuantity(),
                order.getTotalPrice(),
                order.getStatus(),
                order.getDateCreated(),
                order.getLastUpdated(),
                itemDTOs
        );
    }

    public OrderItemDTO toDto(OrderItem item) {
        return new OrderItemDTO(
                item.getId(),
                item.getImageUrl(),
                item.getUnitPrice(),
                item.getQuantity(),
                item.getProductId()
        );
    }
}
