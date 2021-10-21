import { SaleService } from './../services/sale.service';
import { TransactionType, DiscountType } from './../models/transaction';
import { Component, OnInit } from '@angular/core';
import { PagedList } from '../models/paged-list';
import { Filter } from '../models/filter';
import { Transaction } from '../models/transaction';
import { FilterItem, filterType } from '../models/filter-item';
import { TransactionService } from '../services/transaction.service';
import { MessageService, ConfirmationService } from 'primeng/api';
import { AdministrationService } from '../services/administration.service';
import { SelectedItem } from '../models/selected-item';
import { ConfigService } from '../services/config.service';
import { TransactionPagedList } from '../models/transaction-paged-list';
import { SupplyService } from '../services/supply.service';
import * as pdfMake from 'pdfmake/build/pdfmake';
import * as pdfFonts from 'pdfmake/build/vfs_fonts';
import { TransactedProduct } from '../models/transacted-product';
import { DecimalPipe } from '@angular/common';

@Component({
  selector: 'app-transactionlist',
  templateUrl: './transactionlist.component.html',
  styleUrls: ['./transactionlist.component.css']
})
export class TransactionlistComponent implements OnInit {


  transactionList: TransactionPagedList = new TransactionPagedList();
  suppliesList: PagedList = new PagedList();
  loading = false;
  filter: Filter = new Filter(10);
  transactedProductsfilter: Filter = new Filter(10);
  brandSelectItemList: SelectedItem[] = [];
  categorySelectItemList: SelectedItem[] = [];
  transactionTypeList: SelectedItem[] = [];
  advancedDateFilter = false;
  showDialog = false;
  transactionProductsList: PagedList = new PagedList();

  constructor(
    private transactionService: TransactionService,
    private messageService: MessageService,
    private confirmationService: ConfirmationService,
    private administrationService: AdministrationService,
    private tranasctionService: TransactionService,
    private decimalPipe: DecimalPipe
  ) { pdfMake.vfs = pdfFonts.pdfMake.vfs; }

  ngOnInit() {

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
    this.transactedProductsfilter.filterItems = [];
    this.filter.filterItems.push(
      new FilterItem("Id", filterType.number),
      new FilterItem("DateInserted", filterType.dateFrom),
      new FilterItem("DateInserted", filterType.dateTo),
      new FilterItem("TransactionType", filterType.transactionType),
      new FilterItem("User.Username", filterType.text));
  }


  onLazyLoad(e) {
    this.filter.first = e.first;
    this.filter.rows = e.rows;
    this.getTransactions(this.filter);
  }

  onTransactedProductsLazyLoad(e) {
    this.transactedProductsfilter.first = e.first;
    this.transactedProductsfilter.rows = e.rows;
    // this.getTransactions(this.transactedProductsfilter); 
  }



  getTransactions(filter) {
    this.tranasctionService.getAllTransactions(filter).subscribe((res: TransactionPagedList) => {
      this.transactionList = res;
    },
      error => {
        this.messageService.add({ severity: 'error', summary: 'Gabim', detail: JSON.stringify(error.error) })
      });
  }

  onSearch() {
    this.filter.first = 0;
    this.getTransactions(this.filter);
  }

  onAdvancedDateFilterClick() {
    if (this.advancedDateFilter == false) {

      this.advancedDateFilter = true;
      this.filter.filterItems[0].value = null;
    }
    else {
      this.advancedDateFilter = false;
      this.filter.filterItems[1].value = null;
      this.filter.filterItems[2].value = null;

    }
  }

  onTransactionDetail(transactionId) {

    this.transactionService.getTransactedProductsByTransactionId(transactionId, this.transactedProductsfilter).subscribe((res: PagedList) => {
      this.transactionProductsList = res;
      this.showDialog = true;
    }, error => {
      this.messageService.add({ severity: 'error', summary: 'Gabim', detail: JSON.stringify(error.error) })
    });
  }

  onTransactionPrint(transaction) {

    this.transactionService.getTransactedProductsByTransactionId(transaction.id, this.transactedProductsfilter).subscribe((res: PagedList) => {
      this.transactionProductsList = res;
      this.transactionPrint(transaction);
    }, error => {
      this.messageService.add({ severity: 'error', summary: 'Gabim', detail: JSON.stringify(error.error) })
    });
  }


  transactionPrint(transaction: Transaction) {

    let ColsNumber = 0;
    let realContentCount = 0;
    let pdfHeaders = [];
    let pdfContent = [];

    pdfHeaders = [
      { text: 'Barkodi', style: 'tableHeader', bold: true },
      { text: 'Modeli', style: 'tableHeader', bold: true },
      { text: 'Pershkrimi', style: 'tableHeader', bold: true },
      // { text: 'Firma', style: 'tableHeader' },
      // { text: 'Kategoria', style: 'tableHeader' },
      { text: 'Sasia', style: 'tableHeader', bold: true },
    ];

    var totalHeader = { text: 'Total', style: 'tableHeader', bold: true };
    var cmimiHeader = null;

    if (transaction.discount) {
      cmimiHeader = { text: 'Cmimi pas zbritjes', style: 'tableHeader', bold: true };
    }
    else {
      cmimiHeader = { text: 'Cmimi', style: 'tableHeader', bold: true };

    }

    pdfHeaders.push(cmimiHeader, totalHeader);


    var total = 0;
    pdfContent.push(pdfHeaders);

    var clientCol = null;
    if (transaction.client) {
      clientCol = { text: 'Klienti: ' + transaction.client, alignment: 'right', fontSize: 10 };
    }
    else {
      clientCol = { text: '', alignment: 'right', fontSize: 10 };
    }

    this.transactionService.getTransactedProductsByTransactionIdNoFilter(transaction.id).subscribe((res: PagedList) => {
      this.transactionProductsList = res;

      this.transactionProductsList.data.forEach(row => {
        total = total + row.transactionPrice * row.transactionQuantity
        pdfContent.push([
          row.barcode,
          row.model,
          row.description,
          // row.brand.name,
          // row.category.name,
          row.transactionQuantity,
          this.decimalPipe.transform(row.transactionPrice) + ' €',
          this.decimalPipe.transform(row.transactionPrice * row.transactionQuantity) + ' €'

        ]);
      });

      var colTotalLabel = null;
      var colTotal = null;
      var colDiscountEuro = null;
      var colDiscountEuroLabel = null;
      var colDiscountPercentageLabel = null;
      var colDiscountPercentage = null;
      var colTotalAfterDiscountLabel = null;
      var colTotalAfterDiscount = null;


      colTotalLabel = { text: 'Total', fontSize: 10 };
      colTotal = { text: this.decimalPipe.transform(transaction.initialPrice) + ' €', fontSize: 12 };

      if (transaction.discountType == DiscountType.euro) {
        colDiscountEuroLabel = { text: 'Zbritje', fontSize: 10 };
        colDiscountEuro = { text: transaction.discount + ' €', fontSize: 10 };
      }
      else if (transaction.discountType == DiscountType.percentage) {
        colDiscountPercentageLabel = { text: 'Zbritje', fontSize: 10 };
        colDiscountPercentage = { text: transaction.discount + ' %', fontSize: 10 };
      }

      colTotalAfterDiscountLabel = { text: 'Total pas zbritjes', fontSize: 10 };
      colTotalAfterDiscount = { text: this.decimalPipe.transform(transaction.totalPrice) + ' €', fontSize: 12 };



      var totalTable = null;

      var totalBodyWithDiscountEuro = [
        [colTotalLabel, colTotal],
        [colDiscountEuroLabel, colDiscountEuro],
        [colTotalAfterDiscountLabel, colTotalAfterDiscount]]

      var totalBodyWithDiscountPercentage = [
        [colTotalLabel, colTotal],
        [colDiscountPercentageLabel, colDiscountPercentage],
        [colTotalAfterDiscountLabel, colTotalAfterDiscount]]

      var totalBodyWithoutDiscount = [
        [colTotalLabel, colTotal]];


      if (transaction.discount) {
        if (transaction.discountType == DiscountType.percentage) {
          totalTable = totalBodyWithDiscountPercentage
        }
        else {
          totalTable = totalBodyWithDiscountEuro
        }
      }
      else {
        totalTable = totalBodyWithoutDiscount;
      }







      ColsNumber = pdfHeaders.length;
      realContentCount = pdfContent.length - 1;

      // gjeresia e kolonave, varesisht nga numri kolonave
      let colWidths = [];
      for (let i = 0; i < ColsNumber; i++) {
        colWidths.push('*');
      }

      var date = new Date();
      var transactionDate = new Date(transaction.dateInserted);
      var dateString = date.getDate().toString()
        + '/' + (date.getMonth() + 1).toString()
        + '/' + date.getFullYear().toString();

      var transactionDateString = transactionDate.getDate().toString()
        + '/' + (transactionDate.getMonth() + 1).toString()
        + '/' + transactionDate.getFullYear().toString();


      var title = 'Fature e shitjes - DPZ Skenda';


      let dd = {
        pageOrientation: 'portrait',
        content: [
          {
            columns: [
              { image: 'logo', width: 150, alignment: 'left' },
              { text: title, alignment: 'right', fontSize: 14 },
            ]
          },

          {
            columns: [
              { text: 'NR Biznesit:  70370010 ', alignment: 'left', fontSize: 10 },
              { text: 'Id e Fatures: ' + transaction.id, alignment: 'right', fontSize: 10 },
            ],
          },
          {
            columns: [
              { text: 'Rr. Skenderbeu', alignment: 'left', fontSize: 10 },
              { text: 'Data e Printimit te Fatures: ' + dateString, alignment: 'right', fontSize: 10 }

            ],
          },
          {
            columns: [
              { text: 'NR Fiskal: 600694568', alignment: 'left', fontSize: 10 },
              { text: 'Data e Shitjes: ' + transactionDateString, alignment: 'right', fontSize: 10 }
            ],
          },

          {
            columns: [
              { text: 'Suharekë, 23000', alignment: 'left', fontSize: 10 },
              clientCol
            ],
          },
          {
            columns: [
              { text: 'Nr. tel: 044/049 218 239', alignment: 'left', fontSize: 10 },

            ],
          },
          {
            fontSize: 10,
            margin: [0, 50, 0, 0],
            style: 'tableExample',
            table: {
              widths: ['15%', '15%', '30%', '10%', '20%', '10%'],
              headerRows: 1,
              body: pdfContent
            },
            //  layout: 'lightHorizontalLines'
            //layout: 'headerLineOnly'
          },

          {
            columns: [
              {
                text: '',
                width: '*'
              },
              {
                width: 'auto',
                colWidths: ['60%','40%'],
                alignment: 'right',
                style: 'tableExample',
                margin: [0, -1, 0, 0],
                table: {
                  body: totalTable

                },
              },

            ]
          },


        ],
        images: {
          'logo': 'data:image/png;base64,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'
        },
      };
      pdfMake.createPdf(dd).download('FatureShitje_Id_' + transaction.id + '.pdf');
      pdfMake.createPdf(dd).print();
    })
  }


}
