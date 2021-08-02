import { Component, OnInit, NgZone, ViewChild, OnDestroy } from "@angular/core";
import { Company } from "src/app/models/company.model";
import { CompaniesService } from "src/app/services/companies.service";
import { Router, ActivatedRoute } from "@angular/router";
import { User } from "firebase";
import { AngularFireAuth } from "@angular/fire/auth";
import { SwalComponent } from "@sweetalert2/ngx-sweetalert2";
import { ToastrService } from "ngx-toastr";
import { DatePipe } from "@angular/common";
import { Subscription } from "rxjs";
import { tap, filter } from "rxjs/operators";

@Component({
  selector: "app-my",
  templateUrl: "./my.component.html",
  styleUrls: ["./my.component.scss"],
})
export class MyComponent implements OnInit, OnDestroy {
  @ViewChild("nextSwal") private nextSwal: SwalComponent;
  confirmationCode: string = null;
  nextCode: string = null;
  user: User;
  model: Company = null;
  id: string = null;
  isFirstToast = true;
  subscriptions: Subscription[] = [];

  constructor(
    private afAuth: AngularFireAuth,
    private companiesService: CompaniesService,
    private route: ActivatedRoute,
    private datePipe: DatePipe,
    private toastr: ToastrService,
    private ngZone: NgZone
  ) {}

  ngOnInit() {
    this.afAuth.onAuthStateChanged((user) => {
      if (user) {
        this.user = user;
        this.fetchCompany();
      } else {
        this.user = null;
      }
    });
  }

  ngOnDestroy(): void {
    for (let i = 0; i < this.subscriptions.length; i++) {
      this.subscriptions[i].unsubscribe();
    }
  }

  toDate(fecha: any) {
    if (!fecha) return null;
    if (fecha instanceof Date) return fecha;
    return fecha.toDate();
  }

  fetchCompany() {
    const sub1 = this.route.params.subscribe((val) => {
      this.id = this.route.snapshot.paramMap.get("id");
      if (this.id) {
        const sub2 = this.companiesService
          .getCompany(this.id)
          .pipe(
            filter(
              (x: Company) =>
              this.model == null || x.current !== this.model.current || x.next !== this.model.next
            ),
            tap((x) => this.showToast(x))
          )
          .subscribe((company: Company) => {
            this.model = company;
            this.confirmationCode = this.companiesService.generateCode(
              this.model.current,
              this.model.date
            );
          });
        this.subscriptions.push(sub2);
      }
    });
    this.subscriptions.push(sub1);
  }

  showToast(company: Company) {
    if (!this.isFirstToast && company.next > this.model.next) {
      this.toastr.success("", "Nuevo Turno", {
        positionClass: "toast-bottom-full-width",
      });
    } else {
      this.isFirstToast = false;
    }
  }

  showNextCode() {
    this.nextCode = this.companiesService.generateCode(
      this.model.current + 1,
      this.model.date
    );
    setTimeout(() => this.nextSwal.fire());
  }

  next() {
    this.companiesService.nextTicket(this.id);
  }
}
