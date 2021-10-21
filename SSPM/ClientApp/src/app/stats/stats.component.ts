import { Component, OnInit, ViewChild } from '@angular/core';
import { StatsService } from '../services/stats.service';
import { Router } from '@angular/router';
import { Stats } from '../models/stats';
import { TransactionPagedList } from '../models/transaction-paged-list';
import { Filter } from '../models/filter';
import { FilterItem, filterType } from '../models/filter-item';
import { TransactionType } from '../models/transaction';
import { TransactionService } from '../services/transaction.service';
import { MessageService, ConfirmationService } from 'primeng/api';
import { toDate } from '@angular/common/src/i18n/format_date';
import { ServicingService } from '../services/servicing.service';
import { Options } from 'fullcalendar';
import { CalendarComponent } from 'ng-fullcalendar';
import { EventService } from '../services/event.service';
import { PagedList } from '../models/paged-list';
import { EventCalendar } from '../models/event';

@Component({
    selector: 'app-stats',
    templateUrl: './stats.component.html',
    styleUrls: ['./stats.component.css']
})
export class StatsComponent implements OnInit {

    stats: Stats = new Stats();
    transactedProductList: TransactionPagedList = new TransactionPagedList();
    servicingsList: TransactionPagedList = new TransactionPagedList();
    salesfilter: Filter = new Filter(10);
    supplyfilter: Filter = new Filter(10);

    data: any;
    data1: any;
    data2: any;
    options: any;
    options1: any;
    options2: any;


    calendarOptions: Options;
    displayEvent: any;
    @ViewChild(CalendarComponent) ucCalendar: CalendarComponent;

    constructor(
        private statsService: StatsService,
        private router: Router,
        private transactionService: TransactionService,
        private messageService: MessageService,
        private servicingService: ServicingService,
        private eventService: EventService,
        private confirmationService: ConfirmationService,
    ) { }

    ngOnInit() {


        this.getEvents();
        this.salesfilter.filterItems = [];
        this.supplyfilter.filterItems = [];


        this.statsService.getAllStats().subscribe((res: Stats) => {
            this.stats = res;


            this.data = {
                labels: ['Shitje', 'Furnizim'],
                datasets: [
                    {
                        data: [this.stats.totalGain, this.stats.totalSpendings],
                        backgroundColor: [

                            "darkgreen",
                            "darkred"
                        ],
                        hoverBackgroundColor:
                            [

                                "darkgreen",
                                "darkred"
                            ]
                    },
                ]
            };

            this.options = {
                title: {
                    display: true,
                    text: 'Raporti i shprehur ne (€)',
                    fontSize: 16
                },
                legend: {
                    position: 'bottom'
                }
            };


            this.data1 = {
                labels: ['Shitje', 'Furnizim'],
                datasets: [
                    {
                        data: [this.stats.totalSoldProductsQuantity, this.stats.totalSuppliedProductsQuantity],
                        backgroundColor: [

                            "darkgreen",
                            "darkred"
                        ],
                        hoverBackgroundColor:
                            [

                                "darkgreen",
                                "darkred"
                            ]
                    },
                ]
            };

            this.options1 = {
                title: {
                    display: true,
                    text: 'Raporti i shprehur ne sasi',
                    fontSize: 16
                },
                legend: {
                    position: 'bottom'
                }
            };
        });
    }


    onSalesLazyLoad(e) {
        this.salesfilter.first = e.first;
        this.salesfilter.rows = e.rows;
        this.getTransactedProducts(this.salesfilter);
    }

    onServicingLazyLoad(e) {
        this.supplyfilter.first = e.first;
        this.supplyfilter.rows = e.rows;
        this.getServicings(this.supplyfilter, parseInt(localStorage.getItem('userid')));
    }


    getServicings(filter: Filter, userid: number) {
        this.servicingService.getAllServicingsToday(filter, userid).subscribe((res: TransactionPagedList) => {
            this.servicingsList = res;

        },
            error => {
                console.log(error);
                this.messageService.add({ severity: 'error', detail: JSON.stringify(error.error) })
            });
    }

    getTransactedProducts(filter: Filter) {
        this.transactionService.getAllTransactedProductsToday(filter).subscribe((res: TransactionPagedList) => {
            this.transactedProductList = res;
        },
            error => {
                this.messageService.add({ severity: 'error', detail: JSON.stringify(error.error) })
            });
    }


    navigateToProdductList() {
        this.router.navigate(['dashboard/productlist']);
    }
    navigateToSuppply() {
        this.router.navigate(['dashboard/supply']);
    }
    navigateToSale() {
        this.router.navigate(['dashboard/sale']);
    }
    navigateToServicing() {
        this.router.navigate(['dashboard/servicinglist']);
    }



    getEvents() {
        var userid = parseInt(localStorage.getItem('userid'));
        this.eventService.getAllEvents(userid).subscribe((res: EventCalendar[]) => {


            var events = [];

            res.forEach(element => {
                var e = { id: element.id, title: element.description, start: element.startDate, end: element.endDate }
                events.push(e);
            });



            this.calendarOptions = {
                editable: true,
                eventLimit: false,
                locale: 'sq',
                timeFormat: 'H:mm',
                defaultView: 'month',
                header: {
                    left: 'prev,next today',
                    center: 'title',
                    right: 'listYear,month,agendaDay'
                },
                events: events
            }; 

        })
    }


    eventClick(model: any) {
        // model = {
        //   event: {
        //     id: model.event.id,
        //     start: model.event.start,
        //     end: model.event.end,
        //     title: model.event.title,
        //     allDay: model.event.allDay
        //     // other params
        //   },
        //   duration: {}
        // }
        // this.displayEvent = model;

        console.log(model.event.id);

    }

    updateEvent(model: any) { 
        this.confirmationService.confirm({
            message: 'A jeni i sigurte qe deshironi te ndryshoni te dhenat e eventit?',
            header: 'Konfirmo',
            icon: 'pi pi-question',
            accept: () => {
                var event = new EventCalendar;

                event.id = model.event.id;
                event.startDate = model.event.start;
                event.endDate = model.event.end;
                event.description = model.event.title;
                event.allDay = model.event.allDay;

                this.eventService.updateEvent(event).subscribe((res: EventCalendar) => {
                this.messageService.add({ severity: 'success', detail: 'Sukses' })

                });
                
            },
            reject: () => {  

                this.getEvents();
            }
        });






    }



}
