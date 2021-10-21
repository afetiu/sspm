import { SelectedItem } from '../models/selected-item';
import { filterType } from './../models/filter-item';
import { Filter } from './../models/filter';
import { Brand } from '../models/brand';
import { AdministrationService } from './../services/administration.service';
import { Component, OnInit } from '@angular/core';
import { Category } from '../models/category';
import { MessageService, ConfirmationService } from 'primeng/primeng';
import { ConfigService } from '../services/config.service';
import { FilterItem } from '../models/filter-item';
import { PagedList } from '../models/paged-list';

@Component({
  selector: 'app-administration',
  templateUrl: './administration.component.html',
  styleUrls: ['./administration.component.css']
})
export class AdministrationComponent implements OnInit {


  brandList: PagedList = new PagedList();
  categoryList: PagedList = new PagedList();
  supplierList: PagedList = new PagedList();
  brandListView = true;
  categoryListView = true;
  supplierListView = true;
  newBrand: Brand = new Brand();
  newCategory: Category = new Category();
  newSupplier: Category = new Category();
  displayDialogCategory = false;
  displayDialogBrand = false;
  loading = false;
  brandFilter: Filter = new Filter(10);
  categoryFilter: Filter = new Filter(10);
  supplierFilter: Filter = new Filter(10);
  


  constructor(
    private administrationService: AdministrationService,
    private messageService: MessageService,
    private confirmationService: ConfirmationService
  ) { }

  ngOnInit() {
    this.brandFilter.filterItems = [];
    this.categoryFilter.filterItems = [];
    this.supplierFilter.filterItems = [];


    
  }

  onBrandsLazyLoad(e)
  {
    this.brandFilter.first = e.first;
    this.brandFilter.rows = e.rows;
    this.getBrands(this.brandFilter);
  }

  onCategoryLazyLoad(e)
  {
    this.categoryFilter.first = e.first;
    this.categoryFilter.rows = e.rows;
    this.getCategories(this.categoryFilter);
  }

  onSupplierLazyLoad(e)
  {
    this.supplierFilter.first = e.first;
    this.supplierFilter.rows = e.rows;
    this.getSuppliers(this.categoryFilter);
  }



  getBrands(brandFilter) { 
    this.administrationService.getAllBrands(brandFilter).subscribe((res: PagedList) => {
      this.brandList = res; 
    },
      error => { 
        this.messageService.add({ severity: 'error', summary: JSON.stringify(error) })
      });
  }

  getCategories(categoryFilter) { 
    this.administrationService.getAllCategories(categoryFilter).subscribe((res: PagedList) => {
      this.categoryList = res;
    },
      error => { 
        this.messageService.add({ severity: 'error', summary: JSON.stringify(error) })
      });
  }

  getSuppliers(supplyFilter) { 
    this.administrationService.getAllSuppliers(supplyFilter).subscribe((res: PagedList) => {
      this.supplierList = res;
    },
      error => { 
        this.messageService.add({ severity: 'error', summary: JSON.stringify(error) })
      });
  }


  // toggleBrandListView() {
  //   if (this.brandListView == true) this.brandListView = false;
  //   else if (this.brandListView == false) this.brandListView = true;
  // }

  // toggleCategoryListView() {
  //   if (this.categoryListView == true) this.categoryListView = false;
  //   else if (this.categoryListView == false) this.categoryListView = true;
  // }

  // toggleCategoryListView() {
  //   if (this.categoryListView == true) this.categoryListView = false;
  //   else if (this.categoryListView == false) this.categoryListView = true;
  // }


  onBrandSave() {
      
    this.administrationService.registerNewBrand(this.newBrand).subscribe(
      res => {
        this.brandListView = true;
        this.messageService.add({ severity: 'success', summary: 'Sukses' });
        this.getBrands(this.brandFilter);
        this.newBrand.name = null; 
      },
      error => {
        this.messageService.add({ severity: 'error', summary: error.error });
        console.log(error.error);
        this.brandListView = false; 
      }
    );
  }

  
  onSupplierSave() {
      
    this.administrationService.registerNewSupplier(this.newSupplier).subscribe(
      res => {
        // this.brandListView = true;
        this.messageService.add({ severity: 'success', summary: 'Sukses' });
        this.getSuppliers(this.supplierFilter);
        this.newSupplier.name = null; 
      },
      error => {
        this.messageService.add({ severity: 'error', summary: error.error });
        console.log(error.error);
        // this.brandListView = false; 
      }
    );
  }


  onCategorySave() { 
    this.administrationService.registerNewCategory(this.newCategory).subscribe(
      res => {
        this.categoryListView = true;
        this.messageService.add({ severity: 'success', summary: 'Sukses' });
        this.getCategories(this.categoryFilter);
        this.newCategory.name = null; 
      },
      error => {
        this.messageService.add({ severity: 'error', summary: error.error });
        console.log(error.error);
        this.categoryListView = false;
         ConfigService.loading = false
      }
    );
  }

  onBrandDelete(id) {
    this.confirmationService.confirm({
      message: 'A jeni i sigurte qe deshironi te fshini rekordin',
      header: 'Konfirmo',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.administrationService.deleteBrand(id).subscribe(res => {
          this.messageService.add({ severity: 'success', summary: 'Sukses' });
          this.getBrands(this.brandFilter);
        },
        err => {
          this.messageService.add({ severity: 'error', summary: err.error });
        }
        );
      },
      reject: () => {
      }
    });
  }


  onSupplierDelete(id) {
    this.confirmationService.confirm({
      message: 'A jeni i sigurte qe deshironi te fshini rekordin',
      header: 'Konfirmo',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.administrationService.deleteSupplier(id).subscribe(res => {
          this.messageService.add({ severity: 'success', summary: 'Sukses' });
          this.getSuppliers(this.brandFilter);
        },
        err => {
          this.messageService.add({ severity: 'error', summary: err.error });
        }
        );
      },
      reject: () => {
      }
    });
  }
 

  onCategoryDelete(id) {
    this.confirmationService.confirm({
      message: 'A jeni i sigurte qe deshironi te fshini rekordin',
      header: 'Konfirmo',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.administrationService.deleteCategory(id).subscribe(res => {
          this.messageService.add({ severity: 'success', summary: 'Sukses' });
          this.getCategories(this.categoryFilter);
        },
        err => {
          this.messageService.add({ severity: 'error', summary: err.error });
        }
        );
      },
      reject: () => {
      }
    });
  }


  onBrandSearch(){
    this.brandFilter.first=0;
    this.getBrands(this.brandFilter);
  }

  onCategorySearch(){
    this.categoryFilter.first=0;
    this.getCategories(this.categoryFilter);
  }

  onSupplierSearch(){
    this.supplierFilter.first=0;
    this.getSuppliers(this.supplierFilter);
  }



}
