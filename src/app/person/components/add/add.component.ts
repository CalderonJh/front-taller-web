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
        docType: [
          this.statePerson?.document.type.toLowerCase() || 'cc',
          [v.required],
        ],
        docNumber: [
          this.statePerson?.document.number || '',
          [v.required, v.minLength(7)],
        ],
        docDescription: [this.statePerson?.document.description || ''],
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
    let person: Person = this.form.getRawValue();
    if (!this.form.valid) return;
    of(this.service.put(person)).subscribe({
      next: (response) =>
        response.subscribe((msg) => {
          this.openSnackBar(msg);
        }),
    });

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

  showHint(key: string) {
    let control = this.form.get(key);
    return control?.dirty && control?.invalid && control.value;
    // return this.form.get(key)?.dirty && this.form.get(key)?.invalid;
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
