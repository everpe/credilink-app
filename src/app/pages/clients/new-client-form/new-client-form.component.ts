import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogRef } from '@angular/material/dialog';
import { MatError, MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { Gender, TypeDocument } from 'src/app/interfaces/client.interface';

@Component({
  selector: 'app-new-client-form',
  standalone: true,
  imports: [ 
      FormsModule,
      ReactiveFormsModule,
      CommonModule,
      MatButtonModule,
      ReactiveFormsModule,
      MatFormFieldModule,
      MatInputModule,
      MatSelectModule,
      MatError
    ],
  templateUrl: './new-client-form.component.html',
  styleUrl: './new-client-form.component.scss'
})
export class NewClientFormComponent {
  clientForm: FormGroup;
  documentTypes = Object.values(TypeDocument);
  genders = Object.values(Gender);

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<NewClientFormComponent>
  ) {
    this.clientForm = this.fb.group({
      first_name: ['', Validators.required],
      last_name: ['', Validators.required],
      document_type: ['', Validators.required],
      document_number: ['', Validators.required],
      place_of_issue: ['', Validators.required],
      gender: ['', Validators.required],
      phone: ['', Validators.required],
      mobile: ['', Validators.required],
      address: ['', Validators.required],
      neighborhood: ['', Validators.required],
      city: ['', Validators.required],
      office_phone: ['', Validators.required],
      type_of_linkage: ['', Validators.required],
      sede: ['', Validators.required],
      job_relationship: ['', Validators.required],
      observations: ['', Validators.required],
    });
  }
  onSubmit(): void {
    if (this.clientForm.valid) {
      this.dialogRef.close(this.clientForm.value);  // Devuelve los datos al componente padre
    }
  }

  onCancel(): void {
    this.dialogRef.close();
  }
}
