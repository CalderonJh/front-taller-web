import { Component, OnInit, signal } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators as v,
} from '@angular/forms';
import { Person } from '../../interfaces/person';
import { Router } from '@angular/router';

@Component({
  selector: 'app-add',
  templateUrl: './add.component.html',
  styles: ``,
})
export class AddComponent implements OnInit {
  hide = signal(true);
  person?: Person;

  clickEvent(event: MouseEvent) {
    this.hide.set(!this.hide);
    event.stopPropagation();
  }

  form!: FormGroup;
  errorMessage: string = '';
  minDate = new Date();
  maxDate = new Date();

  constructor(
    private fb: FormBuilder,
    private router: Router,
  ) {
    const navigation = this.router.getCurrentNavigation();
    if (navigation?.extras.state) {
      this.person = navigation.extras.state['person'];
    }
  }

  ngOnInit() {
    this.defineDates();
    this.form = this.fb.group({
      name: [this.person?.name || '', [v.required]],
      lastName: [this.person?.lastName || '', [v.required]],
      email: [this.person?.email || '', [v.required, v.email]],
      phone: [this.person?.phone || '', [v.required]],
      dob: [this.person ? new Date(this.person.birthDate) : '', [v.required]],
      docType: [this.person?.document.type.toLowerCase() || 'cc', [v.required]],
      docNumber: [this.person?.document.number || '', [v.required]],
      docDescription: [this.person?.document.description || ''],
      city: [this.person?.city.name || '', [v.required]],
      state: [this.person?.city.state || '', [v.required]],
      country: [this.person?.city.country || '', [v.required]],
      username: [this.person?.username || '', [v.required]],
      password: ['', [v.required]],
      confirmPassword: ['', [v.required]],
    });
    if (this.person) {
      this.form.get('password')!.disable();
      this.form.get('confirmPassword')!.disable();
    }
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
