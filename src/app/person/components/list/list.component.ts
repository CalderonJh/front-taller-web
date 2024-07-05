import {
  AfterViewInit,
  Component,
  ElementRef,
  inject,
  OnInit,
  ViewChild,
} from '@angular/core';
import { RestService } from '../../services/rest.service';
import { Person } from '../../interfaces/person';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort, Sort } from '@angular/material/sort';
import { LiveAnnouncer } from '@angular/cdk/a11y';
import {
  FormControl,
  FormGroupDirective,
  NgForm,
  Validators,
} from '@angular/forms';
import { ErrorStateMatcher } from '@angular/material/core';
import { PERSON_EXAMPLE_DATA } from '../../interfaces/data';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { ViewComponent } from '../view/view.component';
import { of } from 'rxjs';

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
  editable: boolean = false;
  dataSource = new MatTableDataSource<Person>(this.data);
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  emailFormControl = new FormControl('', [
    Validators.required,
    Validators.email,
  ]);

  matcher = new MyErrorStateMatcher();

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
    this.dataSource.data = this.data;
  }

  constructor(
    private restService: RestService,
    private router: Router,
  ) {}

  error: any;

  setData(data: Person[]) {
    this.data = data;
  }

  ngOnInit(): void {
    this.restService.getAll().subscribe(
      (d) => (this.dataSource.data = d),
      (e) => {
        this.error = e;
        this.dataSource.data = PERSON_EXAMPLE_DATA;
      },
    );
  }

  editMode(row: Person) {
    let currentPath = this.router.url;
    console.log('currentPath', currentPath);
    this.router.navigate(['/persons/edit/', row.id]);
    this.editable = !this.editable;
  }

  readonly dialog = inject(MatDialog);

  viewMode(row: Person) {
    this.openDialog(row);
  }

  openDialog(person: Person): void {
    this.dialog.open(ViewComponent, {
      enterAnimationDuration: 250,
      exitAnimationDuration: 250,
      data: { person },
    });
  }

  onInput($event: Event) {}

  value() {
    return this.emailFormControl.value || '';
  }

  delete(row: Person) {}
}

/** Error when invalid control is dirty, touched, or submitted. */
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
