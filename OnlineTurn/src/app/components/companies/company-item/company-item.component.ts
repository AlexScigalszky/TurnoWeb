import { Component, OnInit, Input } from "@angular/core";
import { Company, BusinnessHour } from "src/app/models/company.model";
import { User } from "firebase";
import { Router } from "@angular/router";
import { CompaniesService } from "src/app/services/companies.service";

@Component({
  selector: "app-company-item",
  templateUrl: "./company-item.component.html",
  styleUrls: ["./company-item.component.scss"],
})
export class CompanyItemComponent implements OnInit {
  @Input() user: User;
  @Input()
  set company(company: Company) {
    this.model = company;
    if (this.model.businessHours) this.initialize();
  }
  model: Company;
  isOpen: boolean = false;
  turnsDelivered: number = 0;
  delay: number;

  constructor(public companies: CompaniesService) {}

  ngOnInit(): void {}

  toDate(fecha: any) {
    if (fecha instanceof Date) return fecha;
    return fecha.toDate();
  }

  initialize() {
    this.isOpen = this.companies.isOpen(this.model);

    this.model = this.companies.setDefaultBusinessHours(this.model);
    this.model = this.companies.setDefaultWeekDays(this.model);
    this.model = this.companies.resetCurrentNextValuesIfIsNecesary(this.model);
    this.model = this.companies.setDefaultTimeOfTurns(this.model);

    this.turnsDelivered = this.model.next - this.model.current;
    this.delay = this.turnsDelivered * this.model.timeOfTurns;
  }

}
