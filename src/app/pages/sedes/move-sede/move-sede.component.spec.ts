import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MoveSedeComponent } from './move-sede.component';

describe('MoveSedeComponent', () => {
  let component: MoveSedeComponent;
  let fixture: ComponentFixture<MoveSedeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MoveSedeComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(MoveSedeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
