import { Sale } from './../models/sale';
import { Injectable } from '@angular/core';
import { ConfigService } from './config.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class SaleService {

  constructor(
    private configService: ConfigService,
    private http: HttpClient
  ) { }


  getAllSales(filter) {

    return this.http.post(this.configService.getBaserUrl() + 'sale/all', filter,
      {
        headers: new HttpHeaders({
          "Authorization": "Bearer " + localStorage.getItem('jwt'),
          "Content-Type": "application/json"
        })
      }
    );
  }


  addSale(sale: Sale) {
    return this.http.post(this.configService.getBaserUrl() + 'sale/addsale', sale,
      {
        headers: new HttpHeaders({
          "Authorization": "JWT " + localStorage.getItem('jwt'),
          "Content-Type": "application/json"
        })
      });
  }
 
}
