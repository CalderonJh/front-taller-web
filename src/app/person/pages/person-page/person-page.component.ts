import { Component } from '@angular/core';
import { Router } from '@angular/router';
import {FormControl} from "@angular/forms";

@Component({
  selector: 'person-page',
  templateUrl: './person-page.component.html',
  styles: `.no-show {
    display: none;
  }`,
})
export class PersonPageComponent {
  panelColor: FormControl = new FormControl('name');
  constructor(private router: Router) {}

  navigateTo(route: string) {
    this.router.navigate([route]).then();
  }

  onInput($event: Event) {

  }
}
