import { Component, OnInit, Input } from '@angular/core';
import { User } from 'firebase';
import { Company, BusinnessHour } from 'src/app/models/company.model';
import { Router } from '@angular/router';
import { CompaniesService } from 'src/app/services/companies.service';

@Component({
  selector: 'app-company-item-seller',
  templateUrl: './company-item-seller.component.html',
  styleUrls: ['./company-item-seller.component.scss']
})
export class CompanyItemSellerComponent implements OnInit {
  @Input() user: User;
  @Input()
  set company(company: Company) {
    this.model = company;
    this.isOpen = this.companies.isOpen(this.model);
  }
  model: Company;
  isOpen: boolean = false;

  constructor(private router: Router, private companies: CompaniesService) {}

  ngOnInit(): void {}


  toDate(fecha: any) {
    if (fecha instanceof Date) return fecha;
    return fecha.toDate();
  }

  toMinutes(hourMinutes: string) {
    const array = hourMinutes.split(":");
    return parseInt(array[0], 10) * 60 + parseInt(array[1], 10);
  }
}
