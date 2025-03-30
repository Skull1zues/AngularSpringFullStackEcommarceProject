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
  previousCategoryId: number =1;
  searchMode: boolean =false;
  previousKeyWord: string = "";

  // new component for pagination
  thePageNumber: number = 1;
  thePageSize: number = 10;
  theTotalElements: number =0;
 
  

  
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
    

    // if we use different keyword then pageNumber should be 1
    if(this.previousKeyWord != theKeyword){
      this.thePageNumber= 1;
      
    }
    this.previousKeyWord = theKeyword;

    // now search the product for the keyword
    this.productService.searchProductsPaginate(this.thePageNumber - 1,
                                              this.thePageSize,
                                               theKeyword).subscribe(this.processResult())
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

    //
    // check if we have a diffent categoryId
    // Note: angular will reuse the component if it is being viewed
    //

    if(this.previousCategoryId!= this.currentCategoryId){
      this.thePageNumber = 1;
    }
    this.previousCategoryId =this.currentCategoryId;

    console.log(`currentCategoryId= ${this.currentCategoryId}, pageNumber = ${this.thePageNumber}`)


    this.productService.getProductListPaginate(this.thePageNumber-1,
                                      this.thePageSize,
                                      this.currentCategoryId).subscribe(this.processResult()
    )

  }

  updatePageSize(pageSize: string){
    this.thePageSize =+pageSize;
    this.thePageNumber=1;
    this.listProducts();
  }

  processResult(){
    return (data:any) =>{
      this.products = data._embedded.products;
      this.thePageNumber = data.page.number +1;
      this.thePageSize =data.page.size;
      this.theTotalElements = data.page.totalElements;

    }
  }

}
