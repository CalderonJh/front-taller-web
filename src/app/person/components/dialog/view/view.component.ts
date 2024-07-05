import { Component, Inject } from '@angular/core';
import { Person } from '../../../interfaces/person';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'view-person',
  templateUrl: './view.component.html',
  styles: `span {
    font-weight: 550;
  }`,
})
export class ViewComponent {
  person!: Person;

  constructor(
    private _snackBar: MatSnackBar,
    @Inject(MAT_DIALOG_DATA) public data: any,
  ) {
    this.person = data.row;
  }

  openSnackBar() {
    this._snackBar.open('No autorizado.', 'OK', {
      horizontalPosition: 'end',
      verticalPosition: 'top',
    });
  }
}
