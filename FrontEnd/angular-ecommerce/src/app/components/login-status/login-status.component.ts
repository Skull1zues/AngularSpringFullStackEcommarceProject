import { HttpClient } from '@angular/common/http';
import { Component, Inject, OnInit } from '@angular/core';
import { OktaAuthStateService, OKTA_AUTH } from '@okta/okta-angular';
import { OktaAuth } from '@okta/okta-auth-js';

@Component({
  selector: 'app-login-status',
  templateUrl: './login-status.component.html',
  styleUrls: ['./login-status.component.css']
})
export class LoginStatusComponent implements OnInit {

  isAuthenticated: boolean = false;
  userFullName: string = '';

  constructor(private httpClient: HttpClient) { }

  ngOnInit(): void {
    this.checkAuth();
    

    // Subscribe to authentication state changes
    // this.oktaAuthService.authState$.subscribe(
    //   (result) => {
    //     this.isAuthenticated = result.isAuthenticated!;
    //     this.getUserDetails();
    //   }
    // );
  }
  checkAuth() {
    this.httpClient.get<any>(
      'http://localhost:8080/signin',{withCredentials: true}
    ).subscribe(
      data=>{
        this.userFullName = data.username;
        this.isAuthenticated = data.isAuthenticated;
      
    });
  }
  login(){
    window.location.href = 'http://localhost:8080/oauth2/authorization/okta'
  }

  logout(){
    
    
    window.location.href = 'http://localhost:8080/logout'
    this.userFullName = '';
    this.isAuthenticated = false;

  }



  // getUserDetails() {
  //   if (this.isAuthenticated) {

  //     // Fetch the logged in user details (user's claims)
  //     //
  //     // user full name is exposed as a property name
  //     this.oktaAuth.getUser().then(
  //       (res) => {
  //         this.userFullName = res.name as string;
  //       }
  //     );
  //   }
  // }

  // logout() {
  //   // Terminates the session with Okta and removes current tokens.
  //   this.oktaAuth.signOut();
  // }

}