import { Component, OnInit } from '@angular/core';
import { ProductService } from 'src/app/services/product.service';
import { Product } from 'src/app/common/product';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-product-list',
  templateUrl: './product-list-grid.comonent.html',
 

  styleUrls: ['./product-list.component.css']
})
export class ProductListComponent implements OnInit {

  products: Product[] = [];
  currentCategoryId: number | undefined;
  searchMode: boolean =false;
  
  constructor(private productService: ProductService, 
              private route: ActivatedRoute) { }

  ngOnInit() {
    this.route.paramMap.subscribe(()=> {
      this.listProducts();
    });
  }

  listProducts() {
    
    this.searchMode = this.route.snapshot.paramMap.has('keyword')

    if(this.searchMode) {
      this.handleSearchProducts();
    }else{
      this.handleListProducts();
    }
  }

  handleSearchProducts() {

    const theKeyword: string=  this.route.snapshot.paramMap.get('keyword')??'';

    // now search the product for the keyword
    this.productService.searchProducts(theKeyword).subscribe(
      data => {
        this.products = data;
      }
    )
  }

  handleListProducts() {
    // check if "id" parameter is available
    const hasCategoryId: boolean =this.route.snapshot.paramMap.has('id');
    const id = this.route.snapshot.paramMap.get('id')

    if (id) {
      
      // get the "id" param string. convert string to a number using "+" symbol
      this.currentCategoryId = +id
    }
    else{
      // not catagory id available .. default category id is 1
      this.currentCategoryId = 1;
    }


    this.productService.getProductList(this.currentCategoryId).subscribe(
      data => {
        this.products = data;
      }
    )

  }

}
