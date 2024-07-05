import { NgModule } from '@angular/core';
import { CommonModule, NgOptimizedImage } from '@angular/common';

import { PersonRoutingModule } from './person-routing.module';
import { PersonPageComponent } from './pages/person-page/person-page.component';
import { ListComponent } from './components/list/list.component';
import { RestService } from './services/rest.service';
import { HttpClient } from '@angular/common/http';
import { ViewComponent } from './components/dialog/view/view.component';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { MatTooltip } from '@angular/material/tooltip';
import { MatCardModule } from '@angular/material/card';
import { MatInputModule } from '@angular/material/input';
import { ReactiveFormsModule } from '@angular/forms';
import { MatOption, MatSelect } from '@angular/material/select';
import { MatButton, MatIconButton } from '@angular/material/button';
import { MatTab, MatTabGroup } from '@angular/material/tabs';
import { MatToolbar } from '@angular/material/toolbar';
import { AddComponent } from './components/add/add.component';
import {
  MatDatepicker,
  MatDatepickerInput,
  MatDatepickerToggle,
} from '@angular/material/datepicker';
import { MatStep, MatStepper } from '@angular/material/stepper';
import { MatIcon } from '@angular/material/icon';

@NgModule({
  declarations: [
    PersonPageComponent,
    ListComponent,
    ViewComponent,
    AddComponent,
  ],
  imports: [
    CommonModule,
    PersonRoutingModule,
    NgOptimizedImage,
    MatPaginatorModule,
    MatTableModule,
    MatSortModule,
    MatTooltip,
    MatCardModule,
    MatInputModule,
    ReactiveFormsModule,
    MatSelect,
    MatOption,
    MatButton,
    MatTabGroup,
    MatTab,
    MatToolbar,
    MatDatepickerToggle,
    MatDatepicker,
    MatDatepickerInput,
    MatStepper,
    MatStep,
    MatIconButton,
    MatIcon,
  ],
  providers: [RestService, HttpClient],
  exports: [],
})
export class PersonModule {}
