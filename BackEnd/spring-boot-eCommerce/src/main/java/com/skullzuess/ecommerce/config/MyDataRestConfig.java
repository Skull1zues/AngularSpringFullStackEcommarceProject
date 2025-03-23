package com.skullzuess.ecommerce.config;

import com.skullzuess.ecommerce.entity.Product;
import com.skullzuess.ecommerce.entity.ProductCategory;
import jakarta.persistence.EntityManager;
import jakarta.persistence.metamodel.EntityType;
import org.springframework.context.annotation.Configuration;
import org.springframework.data.rest.core.config.RepositoryRestConfiguration;
import org.springframework.data.rest.webmvc.config.RepositoryRestConfigurer;
import org.springframework.http.HttpMethod;
import org.springframework.web.servlet.config.annotation.CorsRegistry;

import java.util.ArrayList;
import java.util.List;
import java.util.Set;

@Configuration
public class MyDataRestConfig implements RepositoryRestConfigurer {

    private EntityManager entityManager;

    public MyDataRestConfig(EntityManager theEntityManager){
        entityManager = theEntityManager;
    }

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
        //call the internal helper method
        exposeIds(config);
    }

    private void exposeIds(RepositoryRestConfiguration config) {
        //expose entity ids


        // -get a list of all entity class from entityManager
        Set<EntityType<?>> entities = entityManager.getMetamodel().getEntities();

        // -create an array of the entity types
        List<Class> entityClass =  new ArrayList<>();

        // -get the entity types for the entities
        for (EntityType tempEntityType: entities){
            entityClass.add(tempEntityType.getJavaType());
        }

        // - expose the entity ids for the array of entity/domain types
        Class[] domainType = entityClass.toArray(new Class[0]);
        config.exposeIdsFor(domainType);
    }
}
