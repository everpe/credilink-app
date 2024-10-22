import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PaymentsCreditListComponent } from './payments-credit-list.component';

describe('PaymentsCreditListComponent', () => {
  let component: PaymentsCreditListComponent;
  let fixture: ComponentFixture<PaymentsCreditListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PaymentsCreditListComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(PaymentsCreditListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
