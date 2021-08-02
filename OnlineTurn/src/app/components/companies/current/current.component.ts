import { Component, OnInit } from "@angular/core";
import { CompaniesService } from "src/app/services/companies.service";
import { Company } from "src/app/models/company.model";
import { Router, ActivatedRoute } from "@angular/router";

@Component({
  selector: "app-current",
  templateUrl: "./current.component.html",
  styleUrls: ["./current.component.scss"],
})
export class CurrentComponent implements OnInit {
  id: string = null;
  model: Company = null;

  constructor(
    private companiesService: CompaniesService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe((val) => {
      this.id = this.route.snapshot.paramMap.get("id");
      if (this.id) {
        this.companiesService
          .getCompany(this.id)
          .subscribe((company: Company) => {
            this.model = company;
          });
      }
    });
  }
}
