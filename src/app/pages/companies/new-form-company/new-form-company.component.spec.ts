import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewFormCompanyComponent } from './new-form-company.component';

describe('NewFormCompanyComponent', () => {
  let component: NewFormCompanyComponent;
  let fixture: ComponentFixture<NewFormCompanyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NewFormCompanyComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(NewFormCompanyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
