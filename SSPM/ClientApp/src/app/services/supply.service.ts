import { Injectable } from '@angular/core';
import { ConfigService } from './config.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Supply } from '../models/supply';

@Injectable({
  providedIn: 'root'
})
export class SupplyService {

  constructor(
    private configService: ConfigService,
    private http: HttpClient
  ) { }


  getAllSupplies(filter) {

    return this.http.post(this.configService.getBaserUrl() + 'supply/all', filter,
      {
        headers: new HttpHeaders({
          "Authorization": "Bearer " + localStorage.getItem('jwt'),
          "Content-Type": "application/json"
        })
      }
    );
  }


  addSupply(supply: Supply) {
    return this.http.post(this.configService.getBaserUrl() + 'supply/addsupply', supply,
      {
        headers: new HttpHeaders({
          "Authorization": "JWT " + localStorage.getItem('jwt'),
          "Content-Type": "application/json"
        })
      });
  }
 
}
