import { AuthGuardService, AdminCheck, LoginGuard } from './services/auth-guard.service';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';
import { AccordionModule, MessageService } from 'primeng/primeng';
import { PanelModule } from 'primeng/primeng';
import { ButtonModule } from 'primeng/primeng';
import { RadioButtonModule } from 'primeng/primeng';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CardModule } from 'primeng/card';
import { RouterModule, Routes } from '@angular/router';
import { UserlistComponent } from './userlist/userlist.component';
import { LayoutModule } from '@angular/cdk/layout';
import { MatToolbarModule, MatButtonModule, MatSidenavModule, MatIconModule, MatListModule } from '@angular/material';
import { DashboardComponent } from './dashboard/dashboard.component';
import { StatsComponent } from './stats/stats.component';
import { ChartModule } from 'primeng/chart';
import { HomeComponent } from './home/home.component';
import { InputTextModule } from 'primeng/inputtext';
import { AdministrationComponent } from './administration/administration.component';
import { TableModule } from 'primeng/table';
import { ToastModule } from 'primeng/toast';
import { DialogModule } from 'primeng/dialog';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ConfirmationService } from 'primeng/api';
import { NgxLoadingModule } from 'ngx-loading';
import { ProductlistComponent } from './productlist/productlist.component';
import { DropdownModule } from 'primeng/dropdown';
import { SupplyComponent } from './supply/supply.component';
import { AutoCompleteModule } from 'primeng/autocomplete';
import { StepsModule } from 'primeng/steps';
import { DatePipe } from './pipes/date.pipe';
import { InputMaskModule } from 'primeng/inputmask';
import { CalendarModule } from 'primeng/calendar';
import { SaleComponent } from './sale/sale.component';
import { CheckboxModule } from 'primeng/checkbox';
import { TransactionlistComponent } from './transactionlist/transactionlist.component';
import { TransactionTypePipe } from './pipes/transaction-type.pipe';
import { SpinnerModule } from 'primeng/spinner';
import { TransactedProductsListComponent } from './transacted-products-list/transacted-products-list.component';
import { OverlayPanelModule } from 'primeng/overlaypanel';
import { ServicingComponent } from './servicing/servicing.component';
import { CommonModule, DecimalPipe } from '@angular/common';
import { FieldsetModule } from 'primeng/fieldset';
import { FullCalendarModule } from 'ng-fullcalendar';




const appRoutes: Routes = [
  { path: 'login', component: LoginComponent, canActivate: [LoginGuard] },
  {
    path: 'dashboard', component: DashboardComponent, canActivate: [AuthGuardService], children:
      [
        { path: 'userlist', component: UserlistComponent, canActivate: [AdminCheck] },
        { path: 'stats', component: StatsComponent },
        { path: 'administration', component: AdministrationComponent, canActivate: [AdminCheck] },
        { path: 'productlist', component: ProductlistComponent },
        { path: 'supply', component: SupplyComponent, canActivate: [AdminCheck] },
        { path: 'sale', component: SaleComponent },
        { path: 'transactionlist', component: TransactionlistComponent },
        { path: 'transactedproductlist', component: TransactedProductsListComponent },
        { path: 'servicinglist', component: ServicingComponent }

      ]
  },
  {
    path: '', redirectTo: 'dashboard/stats', pathMatch: 'full', canActivate: [AuthGuardService]
  },
];



@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    UserlistComponent,
    DashboardComponent,
    StatsComponent,
    HomeComponent,
    AdministrationComponent,
    ProductlistComponent,
    SupplyComponent,
    DatePipe,
    SaleComponent,
    TransactionlistComponent,
    TransactionTypePipe,
    TransactedProductsListComponent,
    ServicingComponent,


  ],
  imports: [
    RouterModule.forRoot(appRoutes, { useHash: true }),
    BrowserModule,
    HttpClientModule,
    BrowserAnimationsModule,
    FormsModule,
    AccordionModule,
    PanelModule,
    ButtonModule,
    RadioButtonModule,
    CardModule,
    LayoutModule,
    MatToolbarModule,
    MatButtonModule,
    MatSidenavModule,
    MatIconModule,
    MatListModule,
    ChartModule,
    InputTextModule,
    TableModule,
    ReactiveFormsModule,
    ToastModule,
    DialogModule,
    ConfirmDialogModule,
    NgxLoadingModule.forRoot({}),
    DropdownModule,
    AutoCompleteModule,
    StepsModule,
    InputMaskModule,
    CalendarModule,
    CheckboxModule,
    SpinnerModule,
    OverlayPanelModule,
    CommonModule,
    FieldsetModule,
    FullCalendarModule


  ],
  providers: [
    MessageService,
    ConfirmationService,
    DecimalPipe],
  bootstrap: [AppComponent]
})
export class AppModule { }
