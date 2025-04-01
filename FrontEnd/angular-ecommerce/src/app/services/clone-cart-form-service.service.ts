import { Injectable } from '@angular/core';
import { Country, State } from 'country-state-city';
import { Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CloneCartFormServiceService {

  constructor() { }

  getCreditCardMonths(startMonth: number): Observable<number[]>{
    let data: number[] =[];

    // build an array for "Month" dropdown list
    // -start at current month and loop until

    for(let theMonth = startMonth; theMonth<=12;theMonth++){
      data.push(theMonth);
    }

    return of(data);
  }

  getCreditCardYears(): Observable<number[]>{
    let data: number[] = [];
    
    // build an array for "Year" dropdown ist

    const startYear: number = new Date().getFullYear();
    const endYear: number = startYear+10;

    for(let theYear = startYear; theYear<=endYear; theYear++){
      data.push(theYear);

    }
    return of(data);

  }

  getCountries() {
    return Country.getAllCountries();
  }

  getStates(countryCode: string) {
    return State.getStatesOfCountry(countryCode);
  }
}
