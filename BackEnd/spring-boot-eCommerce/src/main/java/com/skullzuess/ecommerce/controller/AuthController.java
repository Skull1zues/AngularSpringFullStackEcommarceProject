package com.skullzuess.ecommerce.controller;

import com.skullzuess.ecommerce.dto.OrderDTO;
import com.skullzuess.ecommerce.dto.OrderMapper;
import com.skullzuess.ecommerce.entity.Order;
import com.skullzuess.ecommerce.entity.OrderItem;
import com.skullzuess.ecommerce.service.CheckoutService;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.client.authentication.OAuth2AuthenticationToken;
import org.springframework.security.oauth2.core.oidc.user.OidcUser;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import java.io.IOException;
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

//@CrossOrigin("http://localhost:4200")
@RestController
public class AuthController {
    @Value("${spring.security.oauth2.client.registration.okta.client-id}")
    private String clientId;

    @Value("${spring.security.oauth2.client.registration.okta.logout-redirect}")
    private String logoutRedirect;

    @Value("${spring.security.oauth2.client.resourceserver.jwt.issuer-uri}")
    private String issuerUri;

    @Autowired
    private CheckoutService checkoutService;

    private final OrderMapper orderMapper;

    public AuthController(OrderMapper orderMapper) {
        this.orderMapper = orderMapper;
    }

    @GetMapping("/signin")
    public ResponseEntity<Map<String,Object>> signin(@AuthenticationPrincipal OidcUser oidcUser) {


        /*System.out.println("abc");



        String returnTo = URLEncoder.encode(logoutRedirect, StandardCharsets.UTF_8);
        String logoutUrl = issuerUri+ "v2/logout?client_id="+clientId+"&returnTo="+returnTo;
        System.out.println("logoutUrl:-"+logoutUrl);
*/
        if(oidcUser!=null){
            return ResponseEntity.ok(Map.of("username", oidcUser.getFullName(),"UserEmail",oidcUser.getEmail(),"isAuthenticated",true));
        }else{
            return ResponseEntity.ok(Map.of("username", "","isAuthenticated",false));
        }



    }

    @GetMapping("/logout")
    public ResponseEntity<?> logout(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {

        request.logout();
        /*String returnTo = URLEncoder.encode(logoutRedirect, StandardCharsets.UTF_8);
        String logoutUrl = issuerUri+ "v2/logout?client_id"+clientId+"&returnTo="+returnTo;
        System.out.println("logoutUrl:-"+logoutUrl);*/
        return ResponseEntity.ok().build();

    }

    @GetMapping("api/order/search/findByCustomerEmail")
    public ResponseEntity<?> getOrdersForLoggedPerson(@AuthenticationPrincipal OidcUser oidcUser,
                                                      Pageable pageable){
        if(oidcUser!=null) {
            String email = oidcUser.getEmail();
            List<Order> orders = checkoutService.getOrdersForLoggedPerson(email);
            List<OrderDTO> orderDTOS = orders.stream().map(orderMapper::toDto).toList();


            System.out.println(orderDTOS);
            return ResponseEntity.ok(orderDTOS);
        }else{
            return new ResponseEntity(Map.of("order", "Please Log in to see the order details"),HttpStatus.FORBIDDEN);
        }
    }

}
