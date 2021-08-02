import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CompanyItemRegisterComponent } from './company-item-register.component';

describe('CompanyItemRegisterComponent', () => {
  let component: CompanyItemRegisterComponent;
  let fixture: ComponentFixture<CompanyItemRegisterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CompanyItemRegisterComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CompanyItemRegisterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
