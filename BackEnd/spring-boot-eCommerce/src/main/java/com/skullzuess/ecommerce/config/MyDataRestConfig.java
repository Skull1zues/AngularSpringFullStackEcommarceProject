package com.skullzuess.ecommerce.config;

import com.skullzuess.ecommerce.entity.Product;
import com.skullzuess.ecommerce.entity.ProductCategory;
import org.springframework.context.annotation.Configuration;
import org.springframework.data.rest.core.config.RepositoryRestConfiguration;
import org.springframework.data.rest.webmvc.config.RepositoryRestConfigurer;
import org.springframework.http.HttpMethod;
import org.springframework.web.servlet.config.annotation.CorsRegistry;

@Configuration
public class MyDataRestConfig implements RepositoryRestConfigurer {
    @Override
    public void configureRepositoryRestConfiguration(RepositoryRestConfiguration config, CorsRegistry cors) {
        HttpMethod[] theUnsupportedMethod = {HttpMethod.PUT, HttpMethod.POST, HttpMethod.DELETE};

        // disable HTTP method for product: PUT, POST, DELETE
        config.getExposureConfiguration()
                .forDomainType(Product.class)
                .withItemExposure(((metadata, httpMethods) -> httpMethods.disable(theUnsupportedMethod)))
                .withCollectionExposure(((metadata, httpMethods) -> httpMethods.disable(theUnsupportedMethod)));

        // disable HTTP method for productCategory: PUT, POST, DELETE
        config.getExposureConfiguration()
                .forDomainType(ProductCategory.class)
                .withItemExposure(((metadata, httpMethods) -> httpMethods.disable(theUnsupportedMethod)))
                .withCollectionExposure(((metadata, httpMethods) -> httpMethods.disable(theUnsupportedMethod)));
    }
}
