import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ConfigService } from './config.service';
import { Transaction } from '../models/transaction';

@Injectable({
  providedIn: 'root'
})
export class TransactionService {

  constructor(
    private configService: ConfigService,
    private http: HttpClient
  ) { }


  getAllTransactions(filter) {

    return this.http.post(this.configService.getBaserUrl() + 'transaction/all', filter,
      {
        headers: new HttpHeaders({
          "Authorization": "Bearer " + localStorage.getItem('jwt'),
          "Content-Type": "application/json"
        })
      }
    );
  }

  getAllTransactedProducts(filter) {

    return this.http.post(this.configService.getBaserUrl() + 'transaction/alltransactedproducts', filter,
      {
        headers: new HttpHeaders({
          "Authorization": "Bearer " + localStorage.getItem('jwt'),
          "Content-Type": "application/json"
        })
      }
    );
  }


  getAllTransactedProductsToday(filter) {

    return this.http.post(this.configService.getBaserUrl() + 'transaction/alltransactedproductstoday', filter,
      {
        headers: new HttpHeaders({
          "Authorization": "Bearer " + localStorage.getItem('jwt'),
          "Content-Type": "application/json"
        })
      }
    );
  }



  addSupply(supply: Transaction) {
    return this.http.post(this.configService.getBaserUrl() + 'transaction/addsupply', supply,
      {
        headers: new HttpHeaders({
          "Authorization": "JWT " + localStorage.getItem('jwt'),
          "Content-Type": "application/json"
        })
      });
  }

  addSale(sale: Transaction) {
    return this.http.post(this.configService.getBaserUrl() + 'transaction/addsale', sale,
      {
        headers: new HttpHeaders({
          "Authorization": "JWT " + localStorage.getItem('jwt'),
          "Content-Type": "application/json"
        })
      });
  }

  getTransactedProductsByTransactionId(transactionId, filter) {
    return this.http.post(this.configService.getBaserUrl() + 'transaction/productbytransactionid/' + transactionId, filter,
      {
        headers: new HttpHeaders({
          "Authorization": "JWT " + localStorage.getItem('jwt'),
          "Content-Type": "application/json"
        })
      });
  }
  getTransactedProductsByTransactionIdNoFilter(transactionId) {
    return this.http.get(this.configService.getBaserUrl() + 'transaction/productbytransactionidnofilter/' + transactionId,
      {
        headers: new HttpHeaders({
          "Authorization": "JWT " + localStorage.getItem('jwt'),
          "Content-Type": "application/json"
        })
      });
  }
}


