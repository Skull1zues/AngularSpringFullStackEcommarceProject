import { state } from '@angular/animations';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Country } from 'country-state-city';
import { Order } from 'src/app/common/order';
import { OrderItem } from 'src/app/common/order-item';
import { PaymentInfo } from 'src/app/common/payment-info';
import { Purchase } from 'src/app/common/purchase';
import { CartService } from 'src/app/services/cart.service';
import { CheckoutService } from 'src/app/services/checkout.service';
import { CloneCartFormServiceService } from 'src/app/services/clone-cart-form-service.service';
import { CloneCartValidator } from 'src/app/validator/clone-cart-validator';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.css']
})
export class CheckoutComponent implements OnInit {
  storage: Storage = sessionStorage;
  storage1: Storage = localStorage;
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

  //initialize stripe payment gateway
  stripe = Stripe(environment.stripePublishableKey);
  paymentInfo!: PaymentInfo;
  cardElement: any;
displayErrors: any = "";
  

  constructor(private formBuilder: FormBuilder, private cartService: CartService,
              private cloneCartFormService: CloneCartFormServiceService,
              private checkOutService: CheckoutService,
              private router: Router) { }

  ngOnInit(): void {
    //setup Stripe payment form
    this.setupStripePaymentForm();
    this.reviewCartDetails();
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
      creditCard: this.formBuilder.group({
        /*
        cardType: new FormControl('', [Validators.required]),
        nameOnCard:  new FormControl('', [Validators.required, Validators.minLength(2), 
                                          CloneCartValidator.notOnlyWhitespace]),
        cardNumber: new FormControl('', [Validators.required, Validators.pattern('[0-9]{16}')]),
        securityCode: new FormControl('', [Validators.required, Validators.pattern('[0-9]{3}')]),
        expirationMonth: [''],
        expirationYear: ['']
        */
      })

    });



    // populate credit card monts
    const startMonth: number = new Date().getMonth() + 1;
    console.log("startMonth: " + startMonth);

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
     
  }

  setupStripePaymentForm() {

    // get a handle to stripe elements
    var elements = this.stripe.elements();

    // Create a card element ... and hide the zip-code field
    this.cardElement = elements.create('card', { hidePostalCode: true });

    // Add an instance of card UI component into the 'card-element' div
    this.cardElement.mount('#card-element');

    // Add event binding for the 'change' event on the card element
    this.cardElement.on('change', (event: any) => {

      // get a handle to card-errors element
      this.displayErrors = document.getElementById('card-errors');

      if (event.complete) {
        this.displayErrors.textContent = "";
      } else if (event.error) {
        // show validation error to customer
        this.displayErrors.textContent = event.error.message;
      }

    });

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

      // bug fix for states
      //this.billingAddressState = [];
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
    console.log("totalPrice: "+this.totalPrice);
    const roundedPrice = parseFloat(this.totalPrice.toFixed(2));


    this.paymentInfo = new PaymentInfo(roundedPrice * 100,"INR");
    // compute payment info


    // if valid form then
    // - create payment intent
    // - confirm card payment
    // - place order
    console.log(this.displayErrors.textContent);
    console.log(this.paymentInfo);

    if (!this.checkoutFormGroup.invalid && this.displayErrors.textContent === "") {
      console.log("Inside the if condition");

      this.checkOutService.createPaymentIntent(this.paymentInfo).subscribe(
        (paymentIntentResponse) => {
          this.stripe.confirmCardPayment(paymentIntentResponse.client_secret,
            {
              payment_method: {
                card: this.cardElement,
                billing_details: {
                  email: purchase.customer.email,
                  name: `${purchase.customer.firstName} ${purchase.customer.lastName}`,
                  address: {
                    line1: purchase.billingAddress.street,
                    city: purchase.billingAddress.city,
                    country: purchase.billingAddress.country,
                    state: purchase.billingAddress.state,
                    postal_code: purchase.billingAddress.pinCode
                  }
              }
            }}, { handleActions: false })
          .then((result: any) => {
            if (result.error) {
              // inform the customer there was an error
              alert(`There was an error: ${result.error.message}`);
            } else {
              
              // call REST API via the CheckoutService
              this.checkOutService.placeOrder(purchase).subscribe({
                next: response => {
                  alert(`Your order has been received.\nOrder tracking number: ${response.orderTrackingNumber}`);

                  // reset cart
                  this.resetCart();
                  this.storage1.removeItem('cartItems');
                },
                error: err => {
                  alert(`There was an error: ${err.message}`);
                }
              })
            }            
          });
        }
      );
    } else {
      this.checkoutFormGroup.markAllAsTouched();
      return;
    }

  }

  resetCart() {
    // reset cart data
    this.cartService.cartItems = [];
    this.cartService.totalPrice.next(0);
    this.cartService.totalQuantity.next(0);
    
    // reset the form
    this.checkoutFormGroup.reset();

    // navigate back to the products page
    this.router.navigateByUrl("/products");
  }

  /*
  handleMonthsAndYears() {

    const creditCardFormGroup = this.checkoutFormGroup.get('creditCard');

    const currentYear: number = new Date().getFullYear();
    const selectedYear: number = Number(creditCardFormGroup.value.expirationYear);

    // if the current year equals the selected year, then start with the current month

    let startMonth: number;

    if (currentYear === selectedYear) {
      startMonth = new Date().getMonth() + 1;
    }
    else {
      startMonth = 1;
    }

    this.luv2ShopFormService.getCreditCardMonths(startMonth).subscribe(
      data => {
        console.log("Retrieved credit card months: " + JSON.stringify(data));
        this.creditCardMonths = data;
      }
    );
  }
  */
 
  // getStates(formGroupName: string) {

  //   const formGroup = this.checkoutFormGroup.get(formGroupName);

  //   const countryCode = formGroup.value.country.code;
  //   const countryName = formGroup.value.country.name;

  //   console.log(`${formGroupName} country code: ${countryCode}`);
  //   console.log(`${formGroupName} country name: ${countryName}`);

  //   this.luv2ShopFormService.getStates(countryCode).subscribe(
  //     data => {

  //       if (formGroupName === 'shippingAddress') {
  //         this.shippingAddressStates = data; 
  //       }
  //       else {
  //         this.billingAddressStates = data;
  //       }

  //       // select first item by default
  //       formGroup.get('state').setValue(data[0]);
  //     }
  //   );
  // }

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
