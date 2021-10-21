import { Servicing } from './../models/servicing';
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
import { ServicingService } from '../services/servicing.service';
import { TransactionPagedList } from '../models/transaction-paged-list';

@Component({
  selector: 'app-servicing',
  templateUrl: './servicing.component.html',
  styleUrls: ['./servicing.component.css']
})
export class ServicingComponent implements OnInit {


  servicingsList: TransactionPagedList = new TransactionPagedList();
  // displayDialog = false;
  loading = false;
  filter: Filter = new Filter(10);
  brandSelectItemList: SelectedItem[] = [];
  supplierSelectItemList: SelectedItem[] = [];
  categorySelectItemList: SelectedItem[] = [];
  newServicing: Servicing;
  total = 0;


  constructor(
    private servicingService: ServicingService,
    private messageService: MessageService,
    private confirmationService: ConfirmationService,
    private administrationService: AdministrationService
  ) { }

  ngOnInit() {

    this.newServicing = new Servicing();
    this.filter.filterItems = [];
    this.filter.filterItems.push(
      new FilterItem("DateInserted", filterType.dateFrom),
      new FilterItem("DateInserted", filterType.dateTo),
      new FilterItem("Client", filterType.text)
    )

  }


  onLazyLoad(e) {
    this.filter.first = e.first;
    this.filter.rows = e.rows;
    this.getServicings(this.filter, parseInt(localStorage.getItem('userid')));
  }


  getServicings(filter: Filter, userid: number) {
    this.servicingService.getAllServicings(filter, userid).subscribe((res: TransactionPagedList) => {
      this.servicingsList = res;

    },
      error => {
        ConfigService.loading = false;
        console.log(error);
        this.messageService.add({ severity: 'error', detail: JSON.stringify(error.error) })
      });
  }

  onSearch() {

    this.filter.first = 0;
    this.getServicings(this.filter, parseInt(localStorage.getItem('userid')));
  }


  onNewServicingSave() {

    if (this.newServicing.description != null &&
      this.newServicing.servicePrice != null &&
      this.newServicing.client != null) {

      this.newServicing.userId = parseInt(localStorage.getItem('userid'));

      this.servicingService.addServicing(this.newServicing).subscribe((res: Servicing) => {
        this.messageService.add({ severity: 'success', summary: 'Sukses' })
        this.getServicings(this.filter, parseInt(localStorage.getItem('userid')));
        this.newServicing = new Servicing();
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
  // onProductDelete(id: number) {


  //   this.confirmationService.confirm({
  //     message: 'A jeni i sigurte qe deshironi te fshini rekordin',
  //     header: 'Konfirmo',
  //     icon: 'pi pi-exclamation-triangle',
  //     accept: () => {

  //       this.productService.deleteProduct(id).subscribe(res => {
  //         this.messageService.add({ severity: 'success', summary: 'Sukses' })
  //         this.getServicings(this.filter);

  //       },
  //         error => {
  //           this.messageService.add({ severity: 'error', summary: error.error })

  //         }
  //       );
  //     },
  //     reject: () => {
  //     }
  //   });
  // }
}
