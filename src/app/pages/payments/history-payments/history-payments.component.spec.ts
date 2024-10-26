import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HistoryPaymentsComponent } from './history-payments.component';

describe('HistoryPaymentsComponent', () => {
  let component: HistoryPaymentsComponent;
  let fixture: ComponentFixture<HistoryPaymentsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HistoryPaymentsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(HistoryPaymentsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
