import { Supplier } from './../models/supplier';
import { Category } from '../models/category';
import { Brand } from '../models/brand';
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ConfigService } from './config.service';

@Injectable({
  providedIn: 'root'
})
export class AdministrationService {

  constructor(
    private http: HttpClient,
    private configService: ConfigService
  ) { }


  getAllBrands(filter) {
    return this.http.post(this.configService.getBaserUrl() + 'administration/brands', filter,
      {
        headers: new HttpHeaders({
          "Authorization": "Bearer " + localStorage.getItem('jwt'),
          "Content-Type": "application/json"
        })
      }
    );
  }
  getAllCategories(filter) {
    return this.http.post(this.configService.getBaserUrl() + 'administration/categories', filter,
      {
        headers: new HttpHeaders({
          "Authorization": "Bearer " + localStorage.getItem('jwt'),
          "Content-Type": "application/json"
        })
      }
    );
  }

  getAllSuppliers(filter) {
    return this.http.post(this.configService.getBaserUrl() + 'administration/suppliers', filter,
      {
        headers: new HttpHeaders({
          "Authorization": "Bearer " + localStorage.getItem('jwt'),
          "Content-Type": "application/json"
        })
      }
    );
  }
  
  getSupplierById(id: number) {
    return this.http.get(this.configService.getBaserUrl() + 'administration/getsupplierbyid/'+ id,
      {
        headers: new HttpHeaders({
          "Authorization": "Bearer " + localStorage.getItem('jwt'),
          "Content-Type": "application/json"
        })
      }
    );
  }

  registerNewBrand(newBrand: Brand) {
    return this.http.post(this.configService.getBaserUrl() + 'administration/newbrand', newBrand,
      {
        headers: new HttpHeaders({
          "Authorization": "Bearer " + localStorage.getItem('jwt'),
          "Content-Type": "application/json"
        })
      }
    );
  }

  registerNewSupplier(newSupplier: Supplier) {
    return this.http.post(this.configService.getBaserUrl() + 'administration/newsupplier', newSupplier,
      {
        headers: new HttpHeaders({
          "Authorization": "Bearer " + localStorage.getItem('jwt'),
          "Content-Type": "application/json"
        })
      }
    );
  }


  registerNewCategory(newCategory: Category) {
    return this.http.post(this.configService.getBaserUrl() + 'administration/newcategory', newCategory,
      {
        headers: new HttpHeaders({
          "Authorization": "Bearer " + localStorage.getItem('jwt'),
          "Content-Type": "application/json"
        })
      }
    );
  }


  deleteBrand(id) {
    return this.http.delete(this.configService.getBaserUrl() + 'administration/deletebrand/' + id,
      {
        headers: new HttpHeaders({
          "Authorization": "Bearer " + localStorage.getItem('jwt'),
          "Content-Type": "application/json"
        })
      }
    );
  }

  deleteSupplier(id) {
    return this.http.delete(this.configService.getBaserUrl() + 'administration/deletesupplier/' + id,
      {
        headers: new HttpHeaders({
          "Authorization": "Bearer " + localStorage.getItem('jwt'),
          "Content-Type": "application/json"
        })
      }
    );
  }

  deleteCategory(id) {
    return this.http.delete(this.configService.getBaserUrl() + 'administration/deletecategory/' + id,
      {
        headers: new HttpHeaders({
          "Authorization": "Bearer " + localStorage.getItem('jwt'),
          "Content-Type": "application/json"
        })
      }
    );

  }

  getBrandsSelectItems() {
    return this.http.get(this.configService.getBaserUrl() + 'administration/selectitem/brands',
      {
        headers: new HttpHeaders({
          "Authorization": "Bearer " + localStorage.getItem('jwt'),
          "Content-Type": "application/json"
        })
      }
    );
  }

  getSuppliersSelectItems() {
    return this.http.get(this.configService.getBaserUrl() + 'administration/selectitem/suppliers',
      {
        headers: new HttpHeaders({
          "Authorization": "Bearer " + localStorage.getItem('jwt'),
          "Content-Type": "application/json"
        })
      }
    );
  }

  getCategoriesSelectItems() {
    return this.http.get(this.configService.getBaserUrl() + 'administration/selectitem/categories',
      {
        headers: new HttpHeaders({
          "Authorization": "Bearer " + localStorage.getItem('jwt'),
          "Content-Type": "application/json"
        })
      }
    );

  }


}