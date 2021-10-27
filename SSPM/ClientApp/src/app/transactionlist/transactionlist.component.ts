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
  display: boolean;

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
                colWidths: ['60%', '40%'],
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
        }
      };
      pdfMake.createPdf(dd).download('FatureShitje_Id_' + transaction.id + '.pdf');
      pdfMake.createPdf(dd).print();
    })
  }


}
