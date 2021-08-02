import { Component, OnInit } from "@angular/core";
import { Company } from "src/app/models/company.model";
import { CompaniesService } from "src/app/services/companies.service";
import { map } from "rxjs/operators";
import { Observable } from "rxjs";
import { User } from "firebase";
import { AngularFireAuth } from "@angular/fire/auth";

@Component({
  selector: "app-list",
  templateUrl: "./list.component.html",
  styleUrls: ["./list.component.scss"],
})
export class ListComponent implements OnInit {
  $companies: Observable<Company[]>;
  myCompanies: Company[] = [];
  otherCompanies: Company[] = [];
  otherCompaniesFiltered: Company[] = [];
  user: User;
  searchText: string = "";

  constructor(
    private afAuth: AngularFireAuth,
    private companiesService: CompaniesService
  ) {}

  ngOnInit() {
    this.afAuth.onAuthStateChanged((user) => {
      if (user) {
        this.user = user;
      } else {
        this.user = null;
      }
      this.reloadCompanies();
    });

    this.$companies = this.companiesService.getCompanies().pipe(
      map((actions) =>
        actions.map((a) => {
          const data = a.payload.doc.data() as Company;
          const id = a.payload.doc.id;
          return { id, ...data };
        })
      )
    );
    this.reloadCompanies();
  }

  reloadCompanies() {
    this.$companies.subscribe((list: Company[]) => {
      this.myCompanies = list.filter(
        (x) => this.user && x.userId == this.user.uid
      );
      this.otherCompanies = list.filter(
        (x) => !this.user || x.userId !== this.user.uid
      );
      if (this.searchText.length == 0) {
        this.setOtherCompaniesFiltered(this.otherCompanies);
      }
    });
  }

  setOtherCompaniesFiltered(list: Company[]) { 
    this.otherCompaniesFiltered = list;
    this.otherCompaniesFiltered.sort((a, b) => this.compare(a, b));
  }

  compare(a: Company, b: Company): number {
    const aIsOpen = this.companiesService.isOpen(a);
    const bIsOpen = this.companiesService.isOpen(b);
    if (aIsOpen == bIsOpen) return 0;
    else if (aIsOpen) return -1;
    else return 1;
  }

  onSearch() {
    if (this.searchText.length == 0) {
      this.setOtherCompaniesFiltered(this.otherCompanies);
    } else {
      this.setOtherCompaniesFiltered(
        this.otherCompanies.filter(
          (x) =>
            x.name
              .toLocaleLowerCase()
              .indexOf(this.searchText.toLocaleLowerCase()) >= 0
        )
      );
    }
  }

  delete(companyId: string) {
    console.debug("delete", companyId);
    this.companiesService.deleteCompany(companyId);
  }
}
