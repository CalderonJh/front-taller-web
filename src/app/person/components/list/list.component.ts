import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  Inject,
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
import {
  MAT_DIALOG_DATA,
  MatDialog,
  MatDialogActions,
  MatDialogClose,
  MatDialogContent,
  MatDialogRef,
  MatDialogTitle,
} from '@angular/material/dialog';
import { ViewComponent } from '../view/view.component';
import { MatButtonModule } from '@angular/material/button';
import { catchError } from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';

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
    this.service.getAll().subscribe((data: Person[]) => {
      this.dataSource.data = data;
      // this.table.renderRows(); // Actualiza la tabla
    });
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
    this.dataSource.data = this.data;
  }

  editMode(row: Person) {
    const navigationExtras: NavigationExtras = {
      state: {
        person: row,
      },
    };
    this.router.navigate(['/persons/edit/', row.username], navigationExtras);
    this.editable = !this.editable;
  }

  viewMode(row: Person) {
    this.dialog.open(ViewComponent, {
      enterAnimationDuration: 250,
      exitAnimationDuration: 250,
      data: { row },
    });
  }

  deleteMode(row: Person) {
    const dialogRef = this.dialog.open(DialogConfirmDelete, {
      width: '250px',
      enterAnimationDuration: 250,
      exitAnimationDuration: 250,
      data: { row },
    });
    dialogRef.afterClosed().subscribe((result) => {
      console.log({ result });
      if (result) {
        this.service.delete(row.id).subscribe(
          (message: string) => {
            console.log(message);
            this.loadData();
            // Aquí puedes manejar la lógica adicional después de la eliminación
          },
          (error: string) => {
            console.error(error);
            // Aquí puedes manejar cualquier lógica adicional en caso de error
          },
        );
      }
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

@Component({
  selector: 'dialog-animations-example-dialog',
  template: `<h2 mat-dialog-title>Eliminar a {{ this.data.row.name }}</h2>
    <mat-dialog-content>
      ¿Está seguro de que desea eliminar este registro?
    </mat-dialog-content>
    <mat-dialog-actions>
      <button mat-button mat-dialog-close cdkFocusInitial (click)="no()">No</button>
      <button mat-button mat-dialog-close (click)="yes()">Ok</button>
    </mat-dialog-actions>`,
  standalone: true,
  imports: [
    MatButtonModule,
    MatDialogActions,
    MatDialogClose,
    MatDialogTitle,
    MatDialogContent,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DialogConfirmDelete {
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<DialogConfirmDelete>,
  ) {}
  no(): void {
    this.dialogRef.close(false);
  }
  yes(): void {
    this.dialogRef.close(true);
  }
}
