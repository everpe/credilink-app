import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewCoDebtorFormComponent } from './new-co-debtor-form.component';

describe('NewCoDebtorFormComponent', () => {
  let component: NewCoDebtorFormComponent;
  let fixture: ComponentFixture<NewCoDebtorFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NewCoDebtorFormComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(NewCoDebtorFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
