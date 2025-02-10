import { Component } from '@angular/core';
import { SalesPerson } from './sales-person';

@Component({
  selector: 'app-sales-person-list',
  templateUrl: './sales-person-list-bootstrap.component.html',
  styleUrl: './sales-person-list.component.css'
})
export class SalesPersonListComponent {
  salesPersonList: SalesPerson[] = [
    new SalesPerson("Soumya","Barik","barikSoumyadip@gmail.com", 99),
    new SalesPerson("Soumyadip","Barik","barikSoumyadip@gmail.com",100),
    new SalesPerson("Ramesh","Das","rd@gmail.com",65),
    new SalesPerson("Sudesh","Das","sd@gmail.com",65000)

  ];

}
