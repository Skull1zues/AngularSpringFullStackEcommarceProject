import { Component, OnInit } from '@angular/core';
import { OrderHistory } from 'src/app/common/order-history';
import { OrderHistoryServiceService } from 'src/app/services/order-history-service.service';

@Component({
  selector: 'app-order-history',
  templateUrl: './order-history.component.html',
  styleUrls: ['./order-history.component.css']
})
export class OrderHistoryComponent implements OnInit {
  orderHistoryList: OrderHistory[] = [];
  loading: boolean = true;
  error: string = '';

  constructor(private orderHistoryService: OrderHistoryServiceService) { }

  ngOnInit(): void {
    this.handleOrderHistory();
  }

  handleOrderHistory() {
    this.loading = true;
    this.orderHistoryService.getOrderHistory().subscribe({
      next: (data) => {
        this.orderHistoryList = data;
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Failed to fetch order history';
        this.loading = false;
        console.error('Error:', err);
      }
    });
  }
}
