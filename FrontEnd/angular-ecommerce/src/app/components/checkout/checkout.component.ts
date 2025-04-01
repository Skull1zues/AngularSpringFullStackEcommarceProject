import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Country } from 'country-state-city';
import { CloneCartFormServiceService } from 'src/app/services/clone-cart-form-service.service';
import { CloneCartValidator } from 'src/app/validator/clone-cart-validator';

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.css']
})
export class CheckoutComponent implements OnInit {


  checkoutFormGroup!: FormGroup;

  totalPrice: number=0;
  totalQuantity: number = 0;

  creditCardYears: number[] =[];
  creditCardMonths: number[] =[];

  countries: any[] = [];
  states: any[] = [];
  BillingCountry: string = '';
  ShippingCountry: any;

  

  constructor(private formBuilder: FormBuilder,
              private cloneCartFormService: CloneCartFormServiceService) { }

  ngOnInit(): void {
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
        street: [''],
        city: [''],
        state: [''],
        country:[''],
        pincode: ['']
      }),
      billingAddress : this.formBuilder.group({
        street: [''],
        city: [''],
        state: [''],
        country:[''],
        pincode: ['']
      }),
      creditCard : this.formBuilder.group({
        cardType: [''],
        nameOnCard: [''],
        cardNumber: [''],
        cvv: [''],
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


  }

  get firstName(){ return this.checkoutFormGroup.get('customer.firstName');}
  get lastName(){ return this.checkoutFormGroup.get('customer.lastName');}
  get email(){ return this.checkoutFormGroup.get('customer.email');}


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
    }
    console.log(this.checkoutFormGroup.get('customer')?.value);
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
