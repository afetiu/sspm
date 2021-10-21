import { ConfigService } from './../services/config.service';
import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { map } from 'rxjs/operators';
import { Router } from '@angular/router';
import { ConfirmationService } from 'primeng/api';



@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

  loading = ConfigService.loading;


  loggedInUsername = localStorage.getItem('username');
  loggedInRoleName = localStorage.getItem('role');

  isHandset$: Observable<boolean> = this.breakpointObserver.observe(Breakpoints.Handset)
    .pipe(
      map(result => result.matches)
    );


  constructor(
    private breakpointObserver: BreakpointObserver,
    private router: Router,
    private confirmationService: ConfirmationService

  ) { }

  ngOnInit() {

  }

  onLogOut() {


    this.confirmationService.confirm({
      message: 'A jeni i sigurte qe deshironi te dilni',
      header: 'Konfirmo',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {

        localStorage.removeItem('username');
        localStorage.removeItem('firstname');
        localStorage.removeItem('lastname');
        localStorage.removeItem('userid');
        localStorage.removeItem('role');
        localStorage.removeItem('jwt');
        this.router.navigate(['login']);

      },
      reject: () => {
      }
    });









  }




}
