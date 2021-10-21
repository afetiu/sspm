import { Component, OnInit } from '@angular/core';
import { PagedList } from '../models/paged-list';
import { Filter } from '../models/filter';
import { SelectedItem } from '../models/selected-item';
import { TransactionService } from '../services/transaction.service';
import { MessageService, ConfirmationService } from 'primeng/api';
import { AdministrationService } from '../services/administration.service';
import { FilterItem, filterType } from '../models/filter-item';
import { TransactionPagedList } from '../models/transaction-paged-list';

@Component({
  selector: 'app-transacted-products-list',
  templateUrl: './transacted-products-list.component.html',
  styleUrls: ['./transacted-products-list.component.css']
})
export class TransactedProductsListComponent implements OnInit {

 
  transactedProductList: TransactionPagedList = new TransactionPagedList();
  suppliesList:  PagedList = new PagedList();
  loading = false;
  filter: Filter = new Filter(10);
  brandSelectItemList: SelectedItem[] = [];
  categorySelectItemList: SelectedItem[] = [];
  supplierSelectItemList: SelectedItem[] = [];
  transactionTypeList: SelectedItem[] = [];
  advancedDateFilter = false;

  constructor(
    private transactionService: TransactionService,
    private messageService: MessageService,
    private confirmationService: ConfirmationService,
    private administrationService: AdministrationService,  
  ) { }

  ngOnInit() {
    this.getSuppliersSelectItem();
    this.getBSelectItems();
    this.getCSelectItems();
    var supplySelectitem = new SelectedItem();
    var saleSelectitem = new SelectedItem();

    saleSelectitem.label = 'Shitje';
    saleSelectitem.value = 1;
    supplySelectitem.label = 'Furnizim';
    supplySelectitem.value = 2;

    this.transactionTypeList.push(
      saleSelectitem,
      supplySelectitem
    );

    this.filter.filterItems = [];
    this.filter.filterItems.push(
      new FilterItem("Transaction.Id", filterType.number), 
      new FilterItem("DateInserted", filterType.dateFrom),
      new FilterItem("DateInserted", filterType.dateTo),
      new FilterItem("Transaction.TransactionType", filterType.transactionType),
      new FilterItem("Barcode", filterType.text),  
      new FilterItem("Model", filterType.text), 
      new FilterItem("Supplier", filterType.supplier),
      new FilterItem("Brand", filterType.brand),
      new FilterItem("Category", filterType.category));

  }


  onLazyLoad(e) {
    this.filter.first = e.first;
    this.filter.rows = e.rows;
    this.getTransactedProducts(this.filter);
  }


  getTransactedProducts(filter) {
    this.transactionService.getAllTransactedProducts(filter).subscribe((res: TransactionPagedList) => {
      this.transactedProductList = res;
    },
      error => {
        this.messageService.add({ severity: 'error', detail: JSON.stringify(error.error) })
      });
  }

  onSearch() {
    this.filter.first = 0;
    this.getTransactedProducts(this.filter);
    console.log(this.filter);
    console.log(new Date);

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

  getSuppliersSelectItem(){
    this.administrationService.getSuppliersSelectItems().subscribe((res:SelectedItem[])=>{
      this.supplierSelectItemList = res;
    })
  }

  getBSelectItems() {
    this.administrationService.getBrandsSelectItems().subscribe((res: SelectedItem[]) => {
      this.brandSelectItemList = res;
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

}
