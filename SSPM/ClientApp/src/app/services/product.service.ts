import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ConfigService } from './config.service';
import { Product } from '../models/product';




@Injectable({
  providedIn: 'root'
})
export class ProductService {



  constructor(
    private http: HttpClient,
    private configService: ConfigService
  ) { }


  getAllProducts(filter) {

    return this.http.post(this.configService.getBaserUrl() + 'product/all', filter,
      {
        headers: new HttpHeaders({
          "Authorization": "Bearer " + localStorage.getItem('jwt'),
          "Content-Type": "application/json"
        })
      }
    );
  }


  addProduct(newProduct: Product) {
    return this.http.post(this.configService.getBaserUrl() + 'product/addnewproduct', newProduct,
      {
        headers: new HttpHeaders({
          "Authorization": "JWT " + localStorage.getItem('jwt'),
          "Content-Type": "application/json"
        })
      }
    );
  }

  deleteProduct(id: number) {
    return this.http.delete(this.configService.getBaserUrl() + 'product/deleteproduct/' + id,
      {
        headers: new HttpHeaders({
          "Authorization": "JWT " + localStorage.getItem('jwt'),
          "Content-Type": "application/json"
        })
      }
    );
  }

  getModelsSelectItems() {
    return this.http.get(this.configService.getBaserUrl() + 'product/selectitem/productmodels',
    {
      headers: new HttpHeaders({
        "Authorization": "JWT " + localStorage.getItem('jwt'),
        "Content-Type": "application/json"
      })
    });
  }

  getProductByModel(model: string){
    return this.http.get(this.configService.getBaserUrl() + 'product/getproduct/'+ model);
  }

  getProductsByModel(model: string){
    return this.http.get(this.configService.getBaserUrl() + 'product/getproducts/'+ model);
  }

  getAll(){
    return this.http.get(this.configService.getBaserUrl() + 'product/getALLproducts/');
  }

  getProductByBarcode(barcode: string){
    return this.http.get(this.configService.getBaserUrl() + 'product/getproductbybarcode/'+ barcode);
  }

}
