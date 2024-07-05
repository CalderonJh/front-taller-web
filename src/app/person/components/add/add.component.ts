import { Component, OnInit, signal } from '@angular/core';
import { FormBuilder, FormGroup, Validators as v } from '@angular/forms';
import { Person } from '../../interfaces/person';
import { Router } from '@angular/router';
import { RestService } from '../../services/rest.service';
import { Observable, of } from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';

type saveMethod = (arg: Person) => Observable<string>;

@Component({
  selector: 'app-add',
  templateUrl: './add.component.html',
  styles: ``,
})
export class AddComponent implements OnInit {
  hide = signal(true);
  statePerson?: Person;

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
    private service: RestService,
    private _snackBar: MatSnackBar,
  ) {
    const navigation = this.router.getCurrentNavigation();
    if (navigation?.extras.state) {
      this.statePerson = navigation.extras.state['person'];
    }
  }

  ngOnInit() {
    this.defineDates();
    this.form = this.fb.group({
      id: [this.statePerson?.id || 0],
      name: [this.statePerson?.name || '', [v.required]],
      lastName: [this.statePerson?.lastName || '', [v.required]],
      email: [this.statePerson?.email || '', [v.required, v.email]],
      phone: [this.statePerson?.phone || '', [v.required]],
      dob: [
        this.statePerson ? new Date(this.statePerson.birthDate) : '',
        [v.required],
      ],
      docType: [
        this.statePerson?.document.type.toLowerCase() || 'cc',
        [v.required],
      ],
      docNumber: [this.statePerson?.document.number || '', [v.required]],
      docDescription: [this.statePerson?.document.description || ''],
      city: [this.statePerson?.city.name || '', [v.required]],
      state: [this.statePerson?.city.state || '', [v.required]],
      country: [this.statePerson?.city.country || '', [v.required]],
      username: [this.statePerson?.username || '', [v.required]],
      password: [this.statePerson?.password || '', [v.required]],
      confirmPassword: [this.statePerson?.password || '', [v.required]],
    });

    if (this.statePerson) {
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

  exit() {
    this.form.reset();
    this.router.navigate(['/persons']);
  }

  onSave() {
    let person: Person = this.form.getRawValue();
    of(this.service.put(person)).subscribe({
      next: (response) =>
        response.subscribe((msg) => {
          this.openSnackBar(msg);
        }),
    });
    // this.save(person, this.statePerson ? this.service.put : this.service.post);
  }

  save(person: Person, saveMethod: saveMethod) {
    of(saveMethod(person)).subscribe({
      next: (response) =>
        response.subscribe((msg) => {
          this.openSnackBar(msg);
        }),
    });
  }

  openSnackBar(message: string) {
    this._snackBar.open(message, 'Ok', {
      horizontalPosition: 'end',
      verticalPosition: 'top',
    });
  }
}
