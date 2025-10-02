package com.skullzuess.ecommerce.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import org.antlr.v4.runtime.misc.NotNull;

@Data
@AllArgsConstructor
public class PurchaseResponse {
    private String orderTrackingNumber;

}
