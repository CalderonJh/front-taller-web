import {
  AfterViewInit,
  Component,
  inject,
  OnInit,
  ViewChild,
} from '@angular/core';
import { RestService } from '../../services/rest.service';
import { Person } from '../../interfaces/person';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import {
  FormControl,
  FormGroupDirective,
  NgForm,
  Validators,
} from '@angular/forms';
import { ErrorStateMatcher } from '@angular/material/core';
import { PERSON_EXAMPLE_DATA } from '../../interfaces/data';
import { NavigationExtras, Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { ViewComponent } from '../dialog/view/view.component';
import { of } from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ConfirmDeleteComponent } from '../dialog/confirm-delete/confirm-delete.component';

@Component({
  templateUrl: './list.component.html',
  styles: `
    th, mat-paginator {
      color: #00dddd;
    }
  `,
})
export class ListComponent implements OnInit, AfterViewInit {
  displayedColumns: string[] = [
    'name',
    'lastname',
    'email',
    'phone',
    'username',
    'actions',
  ];
  data: Person[] = [];
  dataSource = new MatTableDataSource<Person>(this.data);
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  error: any;
  readonly dialog = inject(MatDialog);

  emailFormControl = new FormControl('', [
    Validators.required,
    Validators.email,
  ]);

  constructor(
    private service: RestService,
    private router: Router,
    private _snackBar: MatSnackBar,
  ) {}

  ngOnInit(): void {
    this.loadData();
  }

  loadData(): void {
    this.service.getAll().subscribe(
      (d) => (this.dataSource.data = d),
      (e) => {
        this.error = e;
        this.dataSource.data = PERSON_EXAMPLE_DATA;
      },
    );
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
    this.dataSource.data = this.data;
  }

  editMode(person: Person) {
    const navigationExtras: NavigationExtras = {
      state: { person },
    };
    this.router.navigate(['/persons/edit/', person.username], navigationExtras);
  }

  viewMode(row: Person) {
    this.dialog.open(ViewComponent, {
      enterAnimationDuration: 250,
      exitAnimationDuration: 250,
      data: { row },
    });
  }

  deleteMode(row: Person) {
    const dialogRef = this.dialog.open(ConfirmDeleteComponent, {
      width: '250px',
      enterAnimationDuration: 250,
      exitAnimationDuration: 250,
      data: { row },
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        of(this.service.delete(row)).subscribe({
          next: (response) =>
            response.subscribe((msg) => {
              this.openSnackBar(msg);
              this.loadData();
            }),
        });
      }
    });
  }

  openSnackBar(message: string) {
    this._snackBar.open(message, 'Ok', {
      horizontalPosition: 'end',
      verticalPosition: 'top',
    });
  }
}

export class MyErrorStateMatcher implements ErrorStateMatcher {
  isErrorState(
    control: FormControl | null,
    form: FormGroupDirective | NgForm | null,
  ): boolean {
    const isSubmitted = form && form.submitted;
    return !!(
      control &&
      control.invalid &&
      (control.dirty || control.touched || isSubmitted)
    );
  }
}
