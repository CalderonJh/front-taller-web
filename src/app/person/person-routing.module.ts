import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PersonPageComponent } from './pages/person-page/person-page.component';
import { ListComponent } from './components/list/list.component';
import { ViewComponent } from './components/view/view.component';
import { AddComponent } from './components/add/add.component';

const routes: Routes = [
  {
    path: '',
    component: PersonPageComponent,
    children: [
      {
        path: 'view/:id',
        component: ViewComponent,
      },
      {
        path: 'edit/:id',
        component: AddComponent,
      },
      {
        path: 'add',
        component: AddComponent,
      },
      {
        path: '',
        component: ListComponent,
        pathMatch: 'full',
      },
      {
        path: '**',
        redirectTo: '',
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PersonRoutingModule {}
