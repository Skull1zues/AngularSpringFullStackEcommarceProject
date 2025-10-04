package com.skullzuess.ecommerce.dao;

import com.skullzuess.ecommerce.entity.Order;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.repository.query.Param;
import org.springframework.data.rest.core.annotation.RepositoryRestResource;

import java.util.List;

//@RepositoryRestResource(collectionResourceRel = "order",path= "order")
public interface OrderRepository extends JpaRepository<Order,Long> {
    List<Order> findByCustomerEmailOrderByDateCreatedDesc(String email);
    //Page<Order> findByEmail(@Param("email") String email, Pageable pageable);
}
