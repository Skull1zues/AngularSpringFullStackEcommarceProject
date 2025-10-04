package com.skullzuess.ecommerce.service;

import com.skullzuess.ecommerce.dto.Purchase;
import com.skullzuess.ecommerce.dto.PurchaseResponse;
import com.skullzuess.ecommerce.entity.Order;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.List;

public interface CheckoutService {
    PurchaseResponse placeOrder(Purchase purchase);
    List<Order> getOrdersForLoggedPerson(String email);
}
