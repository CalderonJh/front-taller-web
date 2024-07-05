import { Component, OnInit, signal } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  ValidatorFn,
  Validators as v,
} from '@angular/forms';
import { Person } from '../../interfaces/person';
import { Router } from '@angular/router';
import { RestService } from '../../services/rest.service';
import { of } from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-add',
  templateUrl: './add.component.html',
  styles: ``,
})
export class AddComponent implements OnInit {
  hide = signal(true);
  statePerson?: Person;

  form!: FormGroup;
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
    let namesValid = [
      v.required,
      v.minLength(3),
      v.pattern('^[a-zA-ZÀ-ÿ\\s]+$'),
    ];
    this.defineDates();
    this.form = this.fb.group(
      {
        id: [this.statePerson?.id || 0],
        name: [this.statePerson?.name || '', namesValid],
        lastName: [this.statePerson?.lastName || '', namesValid],
        email: [
          this.statePerson?.email || '',
          [v.required, v.pattern('^[\\w.-]+@[\\w.-]+\\.[a-zA-Z]{1,}$')],
        ],
        phone: [
          this.statePerson?.phone || '',
          [v.required, v.pattern('^\\+?[0-9]{7,15}$')],
        ],
        dob: [
          this.statePerson ? new Date(this.statePerson.birthDate) : '',
          [v.required],
        ],
        docId: [this.statePerson?.document.id || null],
        docType: [
          this.statePerson?.document.type.toLowerCase() || 'cc',
          [v.required],
        ],
        docNumber: [
          this.statePerson?.document.number || '',
          [v.required, v.minLength(7)],
        ],
        docDescription: [this.statePerson?.document.description || ''],
        cityId: [this.statePerson?.city.id || null],
        city: [this.statePerson?.city.name || '', namesValid],
        state: [this.statePerson?.city.state || '', namesValid],
        country: [this.statePerson?.city.country || '', namesValid],
        username: [
          this.statePerson?.username || '',
          v.pattern('^[a-zA-Z0-9._-]{5,20}$'),
        ],
        password: [
          this.statePerson?.password || '',
          [
            v.required,
            v.pattern('^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[\\W_]).{8,}$'),
          ],
        ],
        confirmPassword: [this.statePerson?.password || '', [v.required]],
      },
      { validators: matchPasswordValidator('password', 'confirmPassword') },
    );

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

  preventDefault(event: Event) {
    event.preventDefault();
  }

  exit() {
    this.form.reset();
    this.router.navigate(['/persons']);
  }

  onSave() {
    let person: Person = this.mapPerson();
    console.log(person);
    if (this.statePerson) this.updatePerson(person);
    else this.createPerson(person);
    setTimeout(() => {
      this.router.navigate(['/persons']);
    }, 500);
  }

  updatePerson(person: Person) {
    of(this.service.patch(person)).subscribe({
      next: (response) =>
        response.subscribe((msg) => {
          this.openSnackBar(msg);
        }),
    });
  }

  createPerson(person: Person) {
    of(this.service.post(person)).subscribe({
      next: (response) =>
        response.subscribe((msg) => {
          this.openSnackBar(msg);
        }),
    });
  }

  mapPerson(): Person {
    return {
      id: this.form.get('id')?.value,
      name: this.form.get('name')?.value,
      lastName: this.form.get('lastName')?.value,
      email: this.form.get('email')?.value,
      phone: this.form.get('phone')?.value,
      birthDate: this.form.get('dob')?.value,
      document: {
        id: this.form.get('docId')?.value,
        type: this.form.get('docType')?.value,
        number: this.form.get('docNumber')?.value,
        description: this.form.get('docDescription')?.value,
      },
      city: {
        id: this.form.get('cityId')?.value,
        name: this.form.get('city')?.value,
        state: this.form.get('state')?.value,
        country: this.form.get('country')?.value,
      },
      username: this.form.get('username')?.value,
      password: this.form.get('password')?.value,
    };
  }

  openSnackBar(message: string) {
    this._snackBar.open(message, 'Ok', {
      horizontalPosition: 'end',
      verticalPosition: 'top',
    });
  }

  showHint(key: string) {
    let control = this.form.get(key);
    return control?.dirty && control?.invalid && control.value;
  }
}

export function matchPasswordValidator(
  password: string,
  confirmPassword: string,
): ValidatorFn {
  return (control: AbstractControl): { [key: string]: boolean } | null => {
    const passwordControl = control.get(password);
    const confirmPasswordControl = control.get(confirmPassword);

    if (!passwordControl || !confirmPasswordControl) {
      return null;
    }

    if (
      confirmPasswordControl.errors &&
      !confirmPasswordControl.errors['passwordMismatch']
    ) {
      return null;
    }

    if (passwordControl.value !== confirmPasswordControl.value) {
      confirmPasswordControl.setErrors({ passwordMismatch: true });
    } else {
      confirmPasswordControl.setErrors(null);
    }

    return null;
  };
}
