import { BrowserModule } from "@angular/platform-browser";
import { NgModule } from "@angular/core";
import { AppRoutingModule } from "./app-routing.module";
import { AppComponent } from "./app.component";
import { FormsModule } from "@angular/forms";
import { AngularFireModule } from "@angular/fire";
import { AngularFireDatabaseModule } from "@angular/fire/database";
import { AngularFireAuthModule } from "@angular/fire/auth";
import { environment } from "../environments/environment";
import { ListComponent } from "./components/companies/list/list.component";
import { CreateComponent } from "./components/companies/create/create.component";
import { CurrentComponent } from "./components/companies/current/current.component";
import { TakeTiketComponent } from "./components/take-tiket/take-tiket.component";
import { DatePipe } from "@angular/common";
import { LoginComponent } from "./components/login/login.component";
import { MyComponent } from "./components/companies/my/my.component";
import { NavbarComponent } from "./components/navbar/navbar.component";
import { SweetAlert2Module } from "@sweetalert2/ngx-sweetalert2";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { ToastrModule } from "ngx-toastr";
import { NgbModule, NgbDropdownModule } from "@ng-bootstrap/ng-bootstrap";
import { CompanyItemComponent } from "./components/companies/company-item/company-item.component";
import { QRCodeModule } from "angularx-qrcode";
import { NgSelectModule } from "@ng-select/ng-select";
import { NgxPrintModule } from "ngx-print";
import { CompanyItemSellerComponent } from "./components/companies/company-item-seller/company-item-seller.component";
import { CompanyItemRegisterComponent } from './components/companies/company-item-register/company-item-register.component';
import { WeekdaysNumberToStringPipe } from './pipes/weekdays-number-to-string.pipe';

@NgModule({
  declarations: [
    AppComponent,
    ListComponent,
    CreateComponent,
    CurrentComponent,
    TakeTiketComponent,
    LoginComponent,
    MyComponent,
    NavbarComponent,
    CompanyItemComponent,
    CompanyItemSellerComponent,
    CompanyItemRegisterComponent,
    WeekdaysNumberToStringPipe,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    AngularFireModule.initializeApp(environment.firebaseConfig),
    AngularFireAuthModule,
    AngularFireDatabaseModule,
    SweetAlert2Module.forRoot(),
    BrowserAnimationsModule,
    ToastrModule.forRoot({
      maxOpened: 3,
      preventDuplicates: true,
    }),
    NgbModule,
    QRCodeModule,
    NgSelectModule,
    NgbDropdownModule,
    NgxPrintModule,
  ],
  providers: [DatePipe],
  entryComponents: [NavbarComponent, CompanyItemComponent, CompanyItemSellerComponent],
  bootstrap: [AppComponent],
})
export class AppModule {}
