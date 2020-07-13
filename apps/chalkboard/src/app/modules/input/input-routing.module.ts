import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { InputContainerComponent } from './components/input-container/input-container.component';

const routes: Routes = [
  {
    path: '',
    component: InputContainerComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class InputRoutingModule { }
