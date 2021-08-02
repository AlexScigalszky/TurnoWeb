import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TakeTiketComponent } from './take-tiket.component';

describe('TakeTiketComponent', () => {
  let component: TakeTiketComponent;
  let fixture: ComponentFixture<TakeTiketComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TakeTiketComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TakeTiketComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
