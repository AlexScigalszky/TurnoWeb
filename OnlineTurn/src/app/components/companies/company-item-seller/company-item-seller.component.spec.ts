import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CompanyItemSellerComponent } from './company-item-seller.component';

describe('CompanyItemSellerComponent', () => {
  let component: CompanyItemSellerComponent;
  let fixture: ComponentFixture<CompanyItemSellerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CompanyItemSellerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CompanyItemSellerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
