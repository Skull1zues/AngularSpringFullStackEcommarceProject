import { Injectable } from '@angular/core';
import { CartItem } from '../common/cart-item';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CartService {

  cartItems: CartItem[] = []

  totalPrice: Subject<number> = new Subject<number>();
  totalQuantity: Subject<number> = new Subject<number>();
  // Subject is a subclass of Observable . We can use subject to  publish event in our code. 
  // This event will sent to all of the subcriber.

  constructor() { }

  addToCart(theCartItem: CartItem) {
    // check if already have an item in the cart
    let alreadyExistsInCart: boolean = false;
    let existingCartItem: CartItem | undefined;
    

    if (this.cartItems.length > 0) {
      // find the item based of item id
      for (let tempCartItem of this.cartItems) {
        if (tempCartItem.id === theCartItem.id) {
          existingCartItem = tempCartItem;
          break;
        }
      }
    }
    // check if we found it
    alreadyExistsInCart = (existingCartItem != undefined);
    // increment the quantity
    if (alreadyExistsInCart && existingCartItem) {
      existingCartItem.quantity++;

    }
    else {
      this.cartItems.push(theCartItem);
    }
    this.computeCartTotals();


  }
  computeCartTotals() {
    let totalPriceValue: number =0;
    let totalQuantityValue: number =0;

    for (let currentCartItem of this.cartItems){
      totalPriceValue += currentCartItem.quantity*currentCartItem.unitPrice;
      totalQuantityValue += currentCartItem.quantity;
    }

    // publish the new values ... all subcribers will receive the new data
    this.totalPrice.next(totalPriceValue);
    this.totalQuantity.next(totalQuantityValue);

    // log cart data for debugging purpose
    this.logCartData(totalPriceValue,totalQuantityValue);

  }
  logCartData(totalPriceValue: number, totalQuantityValue: number) {
    console.log('COntents of the cart');
    for (let tempCartItem of this.cartItems){
      const subTotalPrice = tempCartItem.quantity * tempCartItem.unitPrice;
      console.log(`name: ${tempCartItem.name}, quantity=${tempCartItem.quantity}, subTotalPrice=${subTotalPrice}`);
    }
    console.log(`totalPrice: ${totalPriceValue.toFixed(2)}, totalQuantity=${totalQuantityValue}`)
  }
}
