package com.skullzuess.ecommerce.service.impl;

import com.skullzuess.ecommerce.dao.CustomerRepository;
import com.skullzuess.ecommerce.dao.OrderRepository;
import com.skullzuess.ecommerce.dto.Purchase;
import com.skullzuess.ecommerce.dto.PurchaseResponse;
import com.skullzuess.ecommerce.entity.Customer;
import com.skullzuess.ecommerce.entity.Order;
import com.skullzuess.ecommerce.entity.OrderItem;
import com.skullzuess.ecommerce.service.CheckoutService;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.Optional;
import java.util.Set;
import java.util.UUID;

@Service
public class CheckoutServiceImpl implements CheckoutService {
    @Autowired
    private CustomerRepository customerRepository;

    @Autowired
    private OrderRepository orderRepository;



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
        // Check if this is an existing customer
        String cusEmail = customer.getEmail();

        Optional<Customer> cusFromDbOpt = customerRepository.findByEmail(cusEmail);
        if(cusFromDbOpt.isPresent()){
            customer = cusFromDbOpt.get();
        }
        customer.add(order);



        // save to the database
        customerRepository.save(customer);

        //return a response
        return new PurchaseResponse(orderTrackingNumber);
    }

    @Override
    public Page<Order> getOrdersForLoggedPerson(String email,Pageable pageable) {

        Page<Order> orders = orderRepository.findByCustomerEmail(email,pageable);
        return orders;
    }

    private String generateOrderTrackingNumber() {
        // generate a random UUID
        return UUID.randomUUID().toString();
    }
}
