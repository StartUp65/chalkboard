import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { OutputContainerComponent } from './components/output-container/output-container.component';

const routes: Routes = [
  {
    path: '',
    component: OutputContainerComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class OutputRoutingModule { }
