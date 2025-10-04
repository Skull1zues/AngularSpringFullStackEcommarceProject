import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { OrderHistory } from '../common/order-history';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class OrderHistoryServiceService {

  private baseUrl = 'http://localhost:8080/api/order/search/findByCustomerEmail';
  constructor(private httpClient: HttpClient) { }
  getOrderHistory(): Observable<OrderHistory[]> {

    return this.httpClient.get<OrderHistory[]>(this.baseUrl, {
      withCredentials: true
    });
  }
}



