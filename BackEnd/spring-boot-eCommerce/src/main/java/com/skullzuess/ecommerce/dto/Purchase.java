package com.skullzuess.ecommerce.dto;

import com.skullzuess.ecommerce.entity.Address;
import com.skullzuess.ecommerce.entity.Customer;
import com.skullzuess.ecommerce.entity.Order;
import com.skullzuess.ecommerce.entity.OrderItem;
import lombok.Data;

import java.util.Set;

@Data
public class Purchase {
    private Customer customer;
    private Address shippingAddress;
    private Address billingAddress;
    private Order order;
    private Set<OrderItem> orderItems;


}
