import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Purchase } from '../common/purchase';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

const theBackEndUrl = environment.cloneCartApiUrl;
@Injectable({
  providedIn: 'root'
})
export class CheckoutService {

  private purchaseUrl = `${theBackEndUrl}/api/checkout/purchase`;

  constructor(private httpClient: HttpClient) { }

  placeOrder(purchase: Purchase): Observable<any>{
    return this.httpClient.post<Purchase>(this.purchaseUrl, purchase);
  }

  getUserEmail(): Observable<any> {
    return this.httpClient.get<any>(`${theBackEndUrl}/signin`, { withCredentials: true });
  }
}
