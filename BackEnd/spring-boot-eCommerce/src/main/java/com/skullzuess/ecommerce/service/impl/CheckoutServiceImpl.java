package com.skullzuess.ecommerce.service.impl;

import com.skullzuess.ecommerce.dao.CustomerRepository;
import com.skullzuess.ecommerce.dto.Purchase;
import com.skullzuess.ecommerce.dto.PurchaseResponse;
import com.skullzuess.ecommerce.entity.Customer;
import com.skullzuess.ecommerce.entity.Order;
import com.skullzuess.ecommerce.entity.OrderItem;
import com.skullzuess.ecommerce.service.CheckoutService;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Set;
import java.util.UUID;

@Service
public class CheckoutServiceImpl implements CheckoutService {
    @Autowired
    private CustomerRepository customerRepository;



    @Override
    @Transactional
    public PurchaseResponse placeOrder(Purchase purchase) {
        // retrieve the order info from dto
        Order order = purchase.getOrder();

        // generate tracking number
        String orderTrackingNumber = generateOrderTrackingNumber();
        order.setOrderTrackingNumber(orderTrackingNumber);

        //populate order with orderItem
        Set<OrderItem> orderItems = purchase.getOrderItems();
        orderItems.forEach(item -> order.add(item));

        // Populate order with billingAddress and ShippingAddress
        order.setBillingAddress(purchase.getBillingAddress());
        order.setShippingAddress(purchase.getShippingAddress());
        // populate customer with order
        Customer customer = purchase.getCustomer();
        customer.add(order);


        // save to the database
        customerRepository.save(customer);

        //return a response
        return new PurchaseResponse(orderTrackingNumber);
    }

    private String generateOrderTrackingNumber() {
        // generate a random UUID
        return UUID.randomUUID().toString();
    }
}
