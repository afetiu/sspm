import { LoginService } from './services/login.service';
import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'app';
  // loggedIn: boolean;

  constructor(
    private loginService: LoginService
  ) {

  }
  ngOnInit() {
    // this.loggedIn = (localStorage.getItem('isLoggedIn') ? true : false);


  }
}


