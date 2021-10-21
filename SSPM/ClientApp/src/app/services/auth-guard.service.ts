import { Injectable } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { MessageService } from 'primeng/api';


@Injectable({
  providedIn: 'root'
})
export class AuthGuardService {

  constructor(
    private router: Router,
    ) { }


  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {

    var token = localStorage.getItem('jwt');

    if (token){
      return true
    }
     this.router.navigate(['login']);
     return false;

    // if (localStorage.getItem('isLoggedIn')) {
    //   return true;
    // }
    // this.router.navigate(['login']);

  }
}

@Injectable({
  providedIn: 'root'
})
export class AdminCheck {

  constructor(
    private router: Router,
    private messageService: MessageService

    ) { }


  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {

    var token = localStorage.getItem('jwt');

    if (token && (localStorage.getItem('role')) == 'Admin'){
      return true
    }

    this.router.navigate(['dashboard/stats']); 
    window.alert('Nuk keni qasje ne kete faqe')
     return false;

    // if (localStorage.getItem('isLoggedIn')) {
    //   return true;
    // }
    // this.router.navigate(['login']);

  }
}