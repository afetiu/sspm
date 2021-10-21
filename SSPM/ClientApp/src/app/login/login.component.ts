import { AdministrationService } from './../services/administration.service';
import { Login } from './../models/login';
import { LoginService } from './../services/login.service';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/primeng';
import { Role } from '../models/Role';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {


  userLogin: Login = new Login();
  load = false;

  arrivedUserLogin: Login = new Login();

  constructor(
    private loginService: LoginService,
    private router: Router,
    private messageService: MessageService,
    private administrationService: AdministrationService
  ) { }

  ngOnInit() {
    this.userLogin.role = new Role();
    this.arrivedUserLogin.role = new Role();
  }

  onLogin() {
    this.load =true;
    this.loginService.login(this.userLogin).subscribe((res: Login) => {

      this.arrivedUserLogin = res;
      this.arrivedUserLogin.role = res.role;
       localStorage.setItem("jwt", this.arrivedUserLogin.token);


          localStorage.setItem('username', this.arrivedUserLogin.username);
          localStorage.setItem('userid', this.arrivedUserLogin.userId.toString());
          localStorage.setItem('firstname', this.arrivedUserLogin.firstName);
          localStorage.setItem('lastname', this.arrivedUserLogin.lastName);
          localStorage.setItem('role',this.arrivedUserLogin.role.name);
         this.load = false;

        this.router.navigate(['/dashboard/stats']);
    },
      err => {
        this.load = false
        this.messageService.add({ severity: 'error', summary: err.error });

      })
  }

}
