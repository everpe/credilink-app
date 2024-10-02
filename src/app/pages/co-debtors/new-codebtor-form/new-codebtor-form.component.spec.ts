import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewCodebtorFormComponent } from './new-codebtor-form.component';

describe('NewCodebtorFormComponent', () => {
  let component: NewCodebtorFormComponent;
  let fixture: ComponentFixture<NewCodebtorFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NewCodebtorFormComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(NewCodebtorFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
