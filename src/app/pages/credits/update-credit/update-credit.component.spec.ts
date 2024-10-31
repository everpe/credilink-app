import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdateCreditComponent } from './update-credit.component';

describe('UpdateCreditComponent', () => {
  let component: UpdateCreditComponent;
  let fixture: ComponentFixture<UpdateCreditComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UpdateCreditComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(UpdateCreditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
