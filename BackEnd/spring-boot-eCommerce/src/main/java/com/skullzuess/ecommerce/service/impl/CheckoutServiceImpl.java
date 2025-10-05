package com.skullzuess.ecommerce.service.impl;

import com.skullzuess.ecommerce.dao.CustomerRepository;
import com.skullzuess.ecommerce.dao.OrderRepository;
import com.skullzuess.ecommerce.dto.PaymentInfo;
import com.skullzuess.ecommerce.dto.Purchase;
import com.skullzuess.ecommerce.dto.PurchaseResponse;
import com.skullzuess.ecommerce.entity.Customer;
import com.skullzuess.ecommerce.entity.Order;
import com.skullzuess.ecommerce.entity.OrderItem;
import com.skullzuess.ecommerce.service.CheckoutService;
import com.stripe.Stripe;
import com.stripe.exception.StripeException;
import com.stripe.model.PaymentIntent;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.*;

@Service
public class CheckoutServiceImpl implements CheckoutService {

    private CustomerRepository customerRepository;

    private OrderRepository orderRepository;


    public CheckoutServiceImpl(CustomerRepository customerRepository,
                               OrderRepository orderRepository,
                               @Value("${stripe.key.secret}") String secretKey) {
        this.customerRepository = customerRepository;
        this.orderRepository = orderRepository;

        //initialize Stripe API with Secret Key
        Stripe.apiKey = secretKey;
    }

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
    public List<Order> getOrdersForLoggedPerson(String email) {

        List<Order> orders = orderRepository.findByCustomerEmailOrderByDateCreatedDesc(email);
        return orders;
    }

    @Override
    public PaymentIntent createPaymentIntent(PaymentInfo paymentInfo) throws StripeException {
        List<String> paymentMethodTypes = new ArrayList<>();
        paymentMethodTypes.add("card");

        Map<String, Object> params = new HashMap<>();
        params.put("amount",paymentInfo.getAmount());
        params.put("currency",paymentInfo.getCurrency());
        params.put("payment_method_types", paymentMethodTypes);
        params.put("description","cloneCart_purchase");
        return PaymentIntent.create(params);
    }

    private String generateOrderTrackingNumber() {
        // generate a random UUID
        return UUID.randomUUID().toString();
    }
}
