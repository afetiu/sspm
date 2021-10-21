import { ConfigService } from './config.service';
import { Injectable } from '@angular/core';
import { HttpClientModule,HttpHeaders, HttpClient } from '@angular/common/http';

import { Login } from '../models/login';

const httpOptions = {
  headers: new HttpHeaders({ 
    'Access-Control-Allow-Origin':'*'
  })
};

@Injectable({
  providedIn: 'root'
})
export class LoginService {

  user: Login;
  userList : Login[] = [];

  constructor(
    private http: HttpClient,
    private configService: ConfigService
  ) { }

  login(userLogin){
    return this.http.post(this.configService.getBaserUrl()+'login',userLogin);
  }
}
