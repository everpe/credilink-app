import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewFormSedeComponent } from './new-form-sede.component';

describe('NewFormSedeComponent', () => {
  let component: NewFormSedeComponent;
  let fixture: ComponentFixture<NewFormSedeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NewFormSedeComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(NewFormSedeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
