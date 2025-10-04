import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Country } from 'country-state-city';
import { Order } from 'src/app/common/order';
import { OrderItem } from 'src/app/common/order-item';
import { Purchase } from 'src/app/common/purchase';
import { CartService } from 'src/app/services/cart.service';
import { CheckoutService } from 'src/app/services/checkout.service';
import { CloneCartFormServiceService } from 'src/app/services/clone-cart-form-service.service';
import { CloneCartValidator } from 'src/app/validator/clone-cart-validator';

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.css']
})
export class CheckoutComponent implements OnInit {
  storage: Storage = sessionStorage;
  isAuthenticated: boolean = false;

  checkoutFormGroup!: FormGroup;

  totalPrice: number=0;
  totalQuantity: number = 0;

  creditCardYears: number[] =[];
  creditCardMonths: number[] =[];

  countries: any[] = [];
  states: any[] = [];
  BillingCountry: string = '';
  ShippingCountry: any;

  

  constructor(private formBuilder: FormBuilder, private cartService: CartService,
              private cloneCartFormService: CloneCartFormServiceService,
              private checkOutService: CheckoutService,
              private router: Router) { }

  ngOnInit(): void {
    // Get user email if authenticated
    this.checkOutService.getUserEmail().subscribe(
      data => {
        this.isAuthenticated = data.isAuthenticated;
        if (data.isAuthenticated) {
          this.checkoutFormGroup.patchValue({
            customer: {
              email: data.UserEmail
            }
          });
          // Make email field readonly when authenticated
          this.checkoutFormGroup.get('customer.email')?.disable();
        } else {
          alert('To track the order please signin with the same emailId');
        }
      }
    );
  
    this.checkoutFormGroup = this.formBuilder.group({
      customer: this.formBuilder.group({
        firstName: new FormControl('',[Validators.required, 
                                    Validators.minLength(2), CloneCartValidator.notOnlyWhitespace]),
        lastName:  new FormControl('',[Validators.required, 
                                  Validators.minLength(2),CloneCartValidator.notOnlyWhitespace]),
        email:  new FormControl('',[Validators.required, 
                                    Validators.pattern('[a-zA-Z0-9._%±]+@[a-zA-Z0-9.-]+.[a-zA-Z]{2,4}$'),CloneCartValidator.notOnlyWhitespace])
      }),
      shippingAddress : this.formBuilder.group({
        street: new FormControl('',[Validators.required, 
          Validators.minLength(2),CloneCartValidator.notOnlyWhitespace]),
        city:new FormControl('',[Validators.required, 
          Validators.minLength(2),CloneCartValidator.notOnlyWhitespace]),
        state: [''],
        country:new FormControl('',[Validators.required]),
        pincode: new FormControl('',[Validators.required, 
                                  Validators.minLength(6),CloneCartValidator.notOnlyWhitespace]),
      }),
      billingAddress : this.formBuilder.group({
        street: new FormControl('',[Validators.required, 
          Validators.minLength(2),CloneCartValidator.notOnlyWhitespace]),
        city:new FormControl('',[Validators.required, 
          Validators.minLength(2),CloneCartValidator.notOnlyWhitespace]),
        state: [''],
        country:new FormControl('',[Validators.required]),
        pincode: new FormControl('',[Validators.required, 
                                  Validators.minLength(6),CloneCartValidator.notOnlyWhitespace]),
      }),
      creditCard : this.formBuilder.group({
        cardType: new FormControl('',[Validators.required]),
        nameOnCard: new FormControl('',[Validators.required, Validators.minLength(2),CloneCartValidator.notOnlyWhitespace]),
        cardNumber: new FormControl('',[Validators.required, Validators.pattern('[0-9]{16}'),
                      CloneCartValidator.notOnlyWhitespace]),
        cvv: new FormControl('',[Validators.required, Validators.pattern('[0-9]{3}')]),
        enpirationMonth:[''],
        enpirationYear:['']
      })

    });

    

    // populate credit card monts
    const startMonth: number = new Date().getMonth() + 1;
    this.cloneCartFormService.getCreditCardMonths(startMonth).subscribe(
    data => {
      console.log("Retrieved credit card months: " + JSON.stringify(data));
      this.creditCardMonths =data;
    });

    this.cloneCartFormService.getCreditCardYears().subscribe(
      data=> {
        console.log("Retrieve credit card year: "+JSON.stringify(data));
        this.creditCardYears= data;
      }
    );

    this.countries = this.cloneCartFormService.getCountries();
    this.reviewCartDetails();


  }
  reviewCartDetails() {
    this.cartService.totalQuantity.subscribe(
      totalQuantity => this.totalQuantity = totalQuantity
    );

    this.cartService.totalPrice.subscribe(
      totalPrice => this.totalPrice =totalPrice
    );
  }

  get firstName(){ return this.checkoutFormGroup.get('customer.firstName');}
  get lastName(){ return this.checkoutFormGroup.get('customer.lastName');}
  get email(){ return this.checkoutFormGroup.get('customer.email');}

  get shippingAddressStreet(){ return this.checkoutFormGroup.get('shippingAddress.street');}
  get shippingAddressCity(){ return this.checkoutFormGroup.get('shippingAddress.city');}
  get shippingAddressCountry(){ return this.checkoutFormGroup.get('shippingAddress.country');}
  get shippingAddressPincode(){ return this.checkoutFormGroup.get('shippingAddress.pincode');}

  get billingAddressStreet(){ return this.checkoutFormGroup.get('billingAddress.street');}
  get billingAddressCity(){ return this.checkoutFormGroup.get('billingAddress.city');}
  get billingAddressCountry(){ return this.checkoutFormGroup.get('billingAddress.country');}
  get billingAddressPincode(){ return this.checkoutFormGroup.get('billingAddress.pincode');}

  get creditCardType(){ return this.checkoutFormGroup.get('creditCard.cardType');}
  get creditCardNameOfCard(){ return this.checkoutFormGroup.get('creditCard.nameOnCard');}
  get creditCardNumber(){ return this.checkoutFormGroup.get('creditCard.cardNumber');}
  get creditCardCvv(){ return this.checkoutFormGroup.get('creditCard.cvv');}



  copyShippingAddressToBillingAddress(event: Event) {
    const inputElement = event.target as HTMLInputElement;
    console.log('Checkbox state:', inputElement.checked);
    if (inputElement.checked){
      this.checkoutFormGroup.controls['billingAddress'].
      setValue(this.checkoutFormGroup.controls['shippingAddress'].value)
    }else{
      this.checkoutFormGroup.controls['billingAddress'].reset();
    }
    }

  onSubmit(){
    console.log("Handling the submit button");

    if(this.checkoutFormGroup.invalid){
      this.checkoutFormGroup.markAllAsTouched();
      return;
    }
    // set Up order
    let order = new Order();
    order.totalPrice = this.totalPrice;
    order.totalQuantity = this.totalQuantity;

    // get Cart Item
    const cartItems = this.cartService.cartItems;

    // create orderItems for cartItems
    let orderItems: OrderItem[] = cartItems.map(orderItem => new OrderItem(orderItem));

    // set up purchase
    let purchase = new Purchase();

    // populate purchase - customer (including disabled fields)
    purchase.customer = this.checkoutFormGroup.get('customer')?.getRawValue();

    // populate purchase - shipping address
    purchase.shippingAddress = this.checkoutFormGroup.controls['shippingAddress'].value;

    // populate purchase - billing address
    purchase.billingAddress = this.checkoutFormGroup.controls['billingAddress'].value;

    // populate purchase - order and orderItems
    purchase.order = order;
    purchase.orderItems = orderItems;


    

    // call the rest api via checkoutService
    this.checkOutService.placeOrder(purchase).subscribe(
      {
        next: response => {
          alert(`Your order has been received.\nOrder Tracking number : ${response.orderTrackingNumber}`);

          // reset cart
          this.resetCart();
        },
        error: err =>{
          alert(`There was an error: ${err.message}`);
        }
      }
    )
  }
  resetCart() {
    // reset cart data
    this.cartService.cartItems = [];
    this.cartService.totalPrice.next(0);
    this.cartService.totalQuantity.next(0);

    // reset the form
    this.checkoutFormGroup.reset();

    // navigate back to the product page
    this.router.navigateByUrl("/products");
  }

  handleMonthsAndYear() {
    
    const creditCardFormGroup = this.checkoutFormGroup.get('creditCard');

    const curretYear: number = new Date().getFullYear();
    const selectedYear: number =Number(creditCardFormGroup?.value.enpirationYear);

    // if the current year equals the selected year, then start with current month

    let startMonth: number;
    if (curretYear === selectedYear) {
      startMonth = new Date().getMonth() +1;
    }else{
      startMonth =1;
    }

    this.cloneCartFormService.getCreditCardMonths(startMonth).subscribe(
      data=>{
      console.log("Retrieved credit card months: " + JSON.stringify(data));
      this.creditCardMonths =data;
    });

    const countries = Country.getAllCountries();
    console.log(countries);
  }

  onShippingCountryChange() {
    const ShippingAddressGroup =this.checkoutFormGroup.get('shippingAddress')
    this.ShippingCountry =ShippingAddressGroup?.value.country;
    console.log(this.ShippingCountry)
    this.states = this.cloneCartFormService.getStates(this.ShippingCountry);
    console.log(this.states);
  }

  onBillingCountryChange() {
    const BillingAddressGroup =this.checkoutFormGroup.get('billingAddress')
    this.BillingCountry =BillingAddressGroup?.value.country;
    console.log(this.BillingCountry)
    this.states = this.cloneCartFormService.getStates(this.BillingCountry);
    console.log(this.states);
  }

  
  

}
