import { Component, OnInit, ElementRef, ViewChild } from "@angular/core";
import { CompaniesService } from "src/app/services/companies.service";
import { ActivatedRoute, Router } from "@angular/router";
import { Company } from "src/app/models/company.model";
import * as html2canvas from "html2canvas";

@Component({
  selector: "app-take-tiket",
  templateUrl: "./take-tiket.component.html",
  styleUrls: ["./take-tiket.component.scss"],
})
export class TakeTiketComponent implements OnInit {
  @ViewChild("ticketCreated") ticketCreated: ElementRef;
  @ViewChild("canvas") canvas: ElementRef;
  @ViewChild("downloadLink") downloadLink: ElementRef;
  id: string = null;
  model: Company = null;
  currentTicket: number;
  date: Date = new Date();
  ticketCode: string = null;
  showSaveButton = true;
  timeOfTurns: string = null;
  isOpen: boolean = false;
  turnsDelivered: number = 0;
  delay: number;

  constructor(
    private companies: CompaniesService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe((val) => {
      this.id = this.route.snapshot.paramMap.get("id");
      if (this.id) {
        this.companies
          .getCompany(this.id)
          .subscribe((company: Company) => {
            this.model = company;
            this.model.id = this.id;
            this.initializeModel();
          });
      }
    });
  }

  initializeModel() {
    this.timeOfTurns = this.companies.getTextForTurnTime(this.model);
    this.isOpen = this.companies.isOpen(this.model);
    this.model = this.companies.setDefaultBusinessHours(this.model);
    this.model = this.companies.setDefaultWeekDays(this.model);
    this.model = this.companies.resetCurrentNextValuesIfIsNecesary(this.model);
    this.model = this.companies.setDefaultTimeOfTurns(this.model);

    this.turnsDelivered = this.model.next - this.model.current;
    this.delay = this.turnsDelivered * this.model.timeOfTurns;
  }

  takeTicket() {
    console.debug("currentTicket", this.currentTicket);
    this.companies.takeTicket(this.id).then((ticket: number) => {
      this.currentTicket = ticket;
      this.ticketCode = this.companies.generateCode(
        this.currentTicket,
        this.model.date
      );
    });
  }

  hideButtonAndScreenshot() {
    this.showSaveButton = false;
    setTimeout(() => this.screenshot());
  }

  screenshot() {
    html2canvas(this.ticketCreated.nativeElement).then((canvas) => {
      this.canvas.nativeElement.src = canvas.toDataURL();
      this.downloadLink.nativeElement.href = canvas.toDataURL("image/png");
      this.downloadLink.nativeElement.download =
        this.model.name + " turno" + this.currentTicket + ".png";
      this.downloadLink.nativeElement.click();
      this.showSaveButton = true;
      // this.router.navigate(["/"]);
    });
  }

  toDate(fecha: any) {
    if (!fecha) return null;
    if (fecha instanceof Date) return fecha;
    return fecha.toDate();
  }
}
