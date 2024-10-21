import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DetailCreditComponent } from './detail-credit.component';

describe('DetailCreditComponent', () => {
  let component: DetailCreditComponent;
  let fixture: ComponentFixture<DetailCreditComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DetailCreditComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(DetailCreditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
