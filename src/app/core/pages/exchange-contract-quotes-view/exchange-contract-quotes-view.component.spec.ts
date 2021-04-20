import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExchangeContractQuotesViewComponent } from './exchange-contract-quotes-view.component';

describe('ExchangeContractQuotesViewComponent', () => {
  let component: ExchangeContractQuotesViewComponent;
  let fixture: ComponentFixture<ExchangeContractQuotesViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ExchangeContractQuotesViewComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ExchangeContractQuotesViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
