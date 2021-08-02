import { Component, OnInit, ElementRef, ViewChild } from "@angular/core";
import { CompaniesService } from "src/app/services/companies.service";
import { Router, ActivatedRoute } from "@angular/router";
import { Location } from "@angular/common";
import * as html2canvas from "html2canvas";
import { Company } from "src/app/models/company.model";

@Component({
  selector: "app-create",
  templateUrl: "./create.component.html",
  styleUrls: ["./create.component.scss"],
})
export class CreateComponent implements OnInit {
  @ViewChild("qrCodeCreated") qrCodeCreated: ElementRef;
  @ViewChild("canvas") canvas: ElementRef;
  @ViewChild("downloadLink") downloadLink: ElementRef;
  id: string;
  model = {
    name: null,
    address: null,
    weekdays: [],
    timeOfTurns: 0, // minutes
    enabled: true,
    notes: null,
    businessHours: [
      {
        from: null,
        to: null,
      },
    ],
  };
  urlGenerateForCompany: string = null;
  companyName: string = null;
  generatedId: string = null;
  timeOfTurns: string = null;

  constructor(
    private companiesService: CompaniesService,
    private router: Router,
    private route: ActivatedRoute,
    private location: Location
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe((val) => {
      this.id = this.route.snapshot.paramMap.get("id");
      if (this.id && this.id.length > 1) {
        this.companiesService
          .getCompany(this.id)
          .subscribe((company: Company) => {
            this.model = company;
            this.companyName = this.model.name;
          });
      }
    });
  }

  addNewBusinessHour() {
    this.model.businessHours.push({
      from: null,
      to: null,
    });
  }

  removeNewBusinessHour() {
    this.model.businessHours.splice(this.model.businessHours.length - 1, 1);
  }

  onSubmit() {
    if (this.id && this.id.length > 1) {
      const param: Company = this.model as Company;
      param.id = this.id;
      this.companiesService.updateCompany(param).then(() => {
        this.generatedId = this.id;
        this.urlGenerateForCompany = this.getTicketUrl(this.generatedId);
        this.timeOfTurns = this.companiesService.getTextForTurnTime(
          this.model as Company
        );
      });
    } else {
      this.companiesService.createCompany(this.model).then((doc) => {
        this.generatedId = doc.id;
        this.urlGenerateForCompany = this.getTicketUrl(this.generatedId);
        this.timeOfTurns = this.companiesService.getTextForTurnTime(
          this.model as Company
        );
      });
    }
  }

  getTicketUrl(companyId: string): string {
    const urlTree = this.router.createUrlTree(
      [`companies/${companyId}/tiket`],
      {}
    );
    const path = this.location.prepareExternalUrl(urlTree.toString());
    return window.location.origin + path;
  }

  screenshot() {
    html2canvas(this.qrCodeCreated.nativeElement).then((canvas) => {
      this.canvas.nativeElement.src = canvas.toDataURL();
      this.downloadLink.nativeElement.href = canvas.toDataURL("image/png");
      this.downloadLink.nativeElement.download = "qr.png";
      this.downloadLink.nativeElement.click();
    });
  }
}
