import { HttpClient } from '@angular/common/http';
import { Component, Inject, OnInit } from '@angular/core';
import { Router } from '@angular/router';
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
  userEmail: string = '';

  constructor(private httpClient: HttpClient, private router: Router) { }

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
        this.userEmail = data.UserEmail;  // Changed from email to UserEmail to match API response
      
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
  members(){
    if(this.isAuthenticated){
      this.router.navigate(['/members']);
    }else{
      this.login();
    }
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