import { TransactedProduct } from './../models/transacted-product'; 
import { ConfirmationService } from 'primeng/primeng';
import { ProductService } from './../services/product.service';
import { Component, OnInit } from '@angular/core';
import { MessageService } from 'primeng/api';
import { Product } from '../models/product';
import { AdministrationService } from '../services/administration.service';
import { TransactionService } from '../services/transaction.service';
import { Transaction } from '../models/transaction';
import { SelectedItem } from '../models/selected-item';
import { Brand } from '../models/brand';
import { Category } from '../models/category';
import { Supplier } from '../models/supplier';
import { DecimalPipe } from '@angular/common';
import { PagedList } from '../models/paged-list';

@Component({
  selector: 'app-supply',
  templateUrl: './supply.component.html',
  styleUrls: ['./supply.component.css']
})
export class SupplyComponent implements OnInit { 

  foundProduct: Product = new Product();
  newTransactedProduct: TransactedProduct = new TransactedProduct();
  transactionProductsList: PagedList = new PagedList();
  newSupply: Transaction = new Transaction();
  discountType: SelectedItem[] = [];
  transactedProducts: TransactedProduct[] = [];
  supplierSelectItemList: SelectedItem[] = [];


  constructor(
    private messageService: MessageService,
    private productService: ProductService,
    private confirmationService: ConfirmationService,
    private transactionService: TransactionService,
    private decimalPipe: DecimalPipe,
    private administrationService: AdministrationService
  ) {
  }

  ngOnInit() {

    this.newSupply.discountType = 0;
    this.newSupply.totalPrice = 0;
    this.newSupply.initialPrice = 0;
    this.newSupply.discount = 0;
    this.newSupply.userId = parseInt(localStorage.getItem('userid'));

    this.getSSelectItems();
    this.newSupply.transactedProducts = [];
    this.foundProduct.brand = new Brand();
    this.foundProduct.category = new Category();
    this.foundProduct.supplier = new Supplier();
  }


  onProdSearch() {

    this.getProduct().subscribe((res: Product) => {
      this.foundProduct = res;
      this.newTransactedProduct.model = res.model;
      this.newTransactedProduct.barcode = res.barcode;
      this.newTransactedProduct.transactionPrice = res.supplyPrice;
      this.newTransactedProduct.transactionQuantity = 1;
      this.newTransactedProduct.supplierId = res.supplierId;
    }, err => {
      this.messageService.add({ severity: 'error', summary: 'Gabim', detail: JSON.stringify(err.error) })
    })
  }

  getProduct() {
    if (this.newTransactedProduct.barcode) {
      return this.productService.getProductByBarcode(this.newTransactedProduct.barcode);
    }
    else if ((this.newTransactedProduct.barcode == null || this.newTransactedProduct.barcode == "") && this.newTransactedProduct.model) {
      return this.productService.getProductByModel(this.newTransactedProduct.model);
    }
  }

  handleEnter() {
    if (this.newTransactedProduct.id) {
      this.onAddToList();
    }
    else {
      this.onProdSearch();
    }
  }


  onAddToList() {
    if (!this.newTransactedProduct.transactionPrice || !this.newTransactedProduct.transactionQuantity
      || (!this.newTransactedProduct.barcode && !this.newTransactedProduct.model)) {
      this.messageService.add({ severity: 'error', summary: 'Gabim', detail: 'Ploteso fushat e nevojshme' })
      return;
    }

    this.getProduct().subscribe((res: Product) => {

      this.newTransactedProduct.model = res.model;
      this.newTransactedProduct.barcode = res.barcode;
      this.newTransactedProduct.brand = res.brand;
      this.newTransactedProduct.brandId = res.brandId;
      this.newTransactedProduct.category = res.category;
      this.newTransactedProduct.categoryId = res.categoryId; 
      this.newTransactedProduct.description = res.description;




      var alreadyInList = this.newSupply.transactedProducts.find(x => x.barcode == this.newTransactedProduct.barcode);

      if (alreadyInList) {
        this.messageService.add({ severity: 'error', summary: 'Gabim', detail: 'Ky produkt eshte ne liste ' })
        return;
      }

      this.newSupply.transactedProducts.push(this.newTransactedProduct);
      this.transactedProducts.push(this.newTransactedProduct);


      this.newSupply.initialPrice = this.newSupply.initialPrice + (this.newTransactedProduct.transactionPrice * this.newTransactedProduct.transactionQuantity);
      this.newTransactedProduct = new TransactedProduct();
      this.foundProduct = new Product();



    }, err => {
      this.messageService.add({ severity: 'error', summary: 'Gabim', detail: JSON.stringify(err.error) })
      this.newTransactedProduct = new TransactedProduct();
      this.foundProduct = new Product();

    })
  }

  onRemoveFromList(index) {
    this.newSupply.initialPrice = this.newSupply.initialPrice - (this.newSupply.transactedProducts[index].transactionPrice * this.newSupply.transactedProducts[index].transactionQuantity);

    this.newSupply.transactedProducts.splice(index, 1);
  }


  onSupply() {

    this.confirmationService.confirm({
      message: 'A jeni i sigurte qe deshironi te kryeni shitjen',
      header: 'Konfirmo',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {

        this.newSupply.totalQuantity = 0;
        this.newSupply.transactedProducts.forEach(element => {
          this.newSupply.totalQuantity = this.newSupply.totalQuantity + element.transactionQuantity;
        });

        this.newSupply.totalPrice = this.newSupply.initialPrice;

        this.transactionService.addSupply(this.newSupply).subscribe((res: Transaction) => {
          this.newSupply = res;
          this.newSupply = new Transaction();
          this.newSupply.transactedProducts = [];
          this.messageService.add({ severity: 'success', summary: 'Sukses'  })

        },
          err => {
            this.messageService.add({ severity: 'error', summary: 'Gabim', detail: JSON.stringify(err.error) })
          })
      },
      reject: () => {
      }
    });
  }


  getSSelectItems() {
    this.administrationService.getSuppliersSelectItems().subscribe((res: SelectedItem[]) => {
      this.supplierSelectItemList = res;
    },
      err => {
        this.messageService.add({ severity: 'error', summary: 'Gabim', detail: JSON.stringify(err.error) })

      })
  }

}
