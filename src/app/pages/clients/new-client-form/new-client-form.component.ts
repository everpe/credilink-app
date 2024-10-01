import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogRef } from '@angular/material/dialog';
import { MatError, MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { Gender, JobRelationship, TypeDocument } from 'src/app/interfaces/client.interface';
import { AuthService } from 'src/app/services/auth/auth.service';
import { ClientService } from 'src/app/services/clients/client.service';

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
export class NewClientFormComponent implements OnInit{
  clientForm: FormGroup;
  documentTypes = Object.values(TypeDocument);
  genders = Object.values(Gender);

  lisJobRelationShips: JobRelationship[] = [];

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<NewClientFormComponent>,
    private clientService: ClientService,
    private authService: AuthService
  ) {
    this.clientForm = this.fb.group({
      first_name: ['', Validators.required],
      last_name: ['', Validators.required],
      type_document: ['', Validators.required],
      document_number: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
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
      observations: [''],
    });
  }

  
  ngOnInit(): void {
    this.clientForm.controls['sede'].setValue(this.authService.getSedeUser());
    this.clientService.getJobRelationships(1).subscribe(
      (data: JobRelationship[]) => {
        this.lisJobRelationShips = data;
      },
      (error) => {
        console.error('Error fetching job relationships:', error);
      }
    );
    
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
