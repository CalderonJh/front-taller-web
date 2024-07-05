import { Component, Input, OnInit, inject, signal } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators as v,
} from '@angular/forms';
import { Person } from '../../interfaces/person';

@Component({
  selector: 'app-add',
  templateUrl: './add.component.html',
  styles: ``,
})
export class AddComponent implements OnInit {
  hide = signal(true);
  @Input('person') person?: Person;

  clickEvent(event: MouseEvent) {
    this.hide.set(!this.hide);
    event.stopPropagation();
  }

  form!: FormGroup;
  errorMessage: string = '';
  minDate = new Date();
  maxDate = new Date();

  constructor(private fb: FormBuilder) {}

  ngOnInit() {
    this.defineDates();
    this.form = this.fb.group({
      name: ['HOla', [v.required]],
      lastName: ['', [v.required]],
      email: ['', [v.required, v.email]],
      phone: ['', [v.required]],
      dob: ['', [v.required]],
      docType: ['cc', [v.required]],
      docNumber: ['', [v.required]],
      docDescription: [''],
      city: ['', [v.required]],
      state: ['', [v.required]],
      country: ['', [v.required]],
      username: ['', [v.required]],
      password: ['', [v.required]],
      confirmPassword: ['', [v.required]],
    });
  }

  defineDates() {
    let current = new Date();
    this.maxDate.setFullYear(current.getFullYear() - 18);
    this.minDate.setFullYear(current.getFullYear() - 100);
  }

  updateErrorMessage() {
    const emailControl = this.form.get('email');
    if (emailControl!.invalid) {
      if (emailControl!.hasError('required')) {
        this.errorMessage = 'Email is required';
      } else if (emailControl!.hasError('email')) {
        this.errorMessage = 'Invalid email format';
      }
    } else {
      this.errorMessage = '';
    }
  }

  preventDefault(event: Event) {
    event.preventDefault();
  }
}
