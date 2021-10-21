import { Supplier } from './../models/supplier';
import { Brand } from './../models/brand';
import { AdministrationService } from './../services/administration.service';
import { Component, OnInit, ViewChild } from '@angular/core';
import { PagedList } from '../models/paged-list';
import { Filter } from '../models/filter';
import { ProductService } from '../services/product.service';
import { MessageService, ConfirmationService } from 'primeng/api';
import { FilterItem, filterType } from '../models/filter-item';
import { ConfigService } from '../services/config.service';
import { SelectedItem } from '../models/selected-item';
import { Product } from '../models/product';
import { Category } from '../models/category'; 

@Component({
  selector: 'app-productlist',
  templateUrl: './productlist.component.html',
  styleUrls: ['./productlist.component.css']
})
export class ProductlistComponent implements OnInit {

  
  productsList: PagedList = new PagedList();
 // displayDialog = false;
  loading = false;
  filter: Filter = new Filter(10);
  brandSelectItemList: SelectedItem[] = [];
  supplierSelectItemList: SelectedItem[] = [];
  categorySelectItemList: SelectedItem[] = [];
  newProduct: Product;
  advancedDateFilter = false;



  constructor(
    private productService: ProductService,
    private messageService: MessageService,
    private confirmationService: ConfirmationService,
    private administrationService: AdministrationService
  ) { }

  ngOnInit() {

    this.newProduct = new Product();
    this.newProduct.brand = new Brand();
    this.newProduct.category = new Category();
    this.newProduct.supplier = new Supplier();

    this.filter.filterItems = [];
    this.getBSelectItems();
    this.getSSelectItems();
    this.getCSelectItems();

    this.filter.filterItems.push(
      new FilterItem("DateInserted", filterType.date) ,
      new FilterItem("DateInserted", filterType.dateFrom) ,
      new FilterItem("DateInserted", filterType.dateTo) ,
      new FilterItem("Model", filterType.text),
      new FilterItem("Barcode", filterType.text),
      new FilterItem("Brand", filterType.brand),
      new FilterItem("Supplier", filterType.supplier),
      new FilterItem("Category", filterType.category),
    )

  }


  onLazyLoad(e) {
    this.filter.first = e.first;
    this.filter.rows = e.rows;
    this.getProducts(this.filter);
  }


  getProducts(filter) {
    this.productService.getAllProducts(filter).subscribe((res: PagedList) => {
      this.productsList = res;
    },
      error => {
        ConfigService.loading = false;
        console.log(error);
        this.messageService.add({ severity: 'error', detail: JSON.stringify(error.error) })
      });
  }

  onSearch() {

    this.filter.first = 0;
    this.getProducts(this.filter);
  }



  getBSelectItems() {
    this.administrationService.getBrandsSelectItems().subscribe((res: SelectedItem[]) => {
      this.brandSelectItemList = res;
    },
      err => {
        this.messageService.add({ severity: 'error', summary: 'Gabim', detail: JSON.stringify(err.error) })

      })
  }

  getSSelectItems() {
    this.administrationService.getSuppliersSelectItems().subscribe((res: SelectedItem[]) => {
      this.supplierSelectItemList = res;
    },
      err => {
        this.messageService.add({ severity: 'error', summary: 'Gabim', detail: JSON.stringify(err.error) })

      })
  }

  getCSelectItems() {
    this.administrationService.getCategoriesSelectItems().subscribe((res: SelectedItem[]) => {
      this.categorySelectItemList = res;
    },
      err => {
        this.messageService.add({ severity: 'error', summary: 'Gabim', detail: JSON.stringify(err.error) })

      })
  }

  onNewProductSave() {

    if (this.newProduct.model != null &&
      this.newProduct.brandId != null &&
      this.newProduct.supplierId != null &&
      this.newProduct.categoryId != null &&
      this.newProduct.salePrice != null &&
      this.newProduct.quantity != null) {

        this.newProduct.userId = parseInt(localStorage.getItem('userid'));

      this.productService.addProduct(this.newProduct).subscribe((res: Product) => {
        this.messageService.add({ severity: 'success', summary: 'Sukses' })
        this.getProducts(this.filter);
        this.newProduct = new Product();
      },
        error => {
          this.messageService.add({ severity: 'error', summary: error.error })
        }
      )
     
    }
    else {
      this.messageService.add({ severity: 'error', summary: 'Ploteso fushat e kerkuara' })

    }

  }

  onAdvancedDateFilterClick(){
    if (this.advancedDateFilter == false){

      this.advancedDateFilter = true;
      this.filter.filterItems[0].value = null;
    }
    else {
      this.advancedDateFilter = false;
      this.filter.filterItems[1].value = null; 
      this.filter.filterItems[2].value = null;

    }
  }

  onProductDelete(id: number) {


    this.confirmationService.confirm({
      message: 'A jeni i sigurte qe deshironi te fshini rekordin',
      header: 'Konfirmo',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {

        this.productService.deleteProduct(id).subscribe(res => {
          this.messageService.add({ severity: 'success', summary: 'Sukses' })
          this.getProducts(this.filter);

        },
          error => {
            this.messageService.add({ severity: 'error', summary: error.error })

          }
        );
      },
      reject: () => {
      }
    });
  }

}
