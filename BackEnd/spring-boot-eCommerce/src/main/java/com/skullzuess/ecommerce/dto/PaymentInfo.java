package com.skullzuess.ecommerce.dto;

import lombok.*;

@Data
public class PaymentInfo {
    private int amount;
    private String currency;
    private String receiptEmail;
}
