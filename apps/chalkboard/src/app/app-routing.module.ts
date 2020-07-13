import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

const routes: Routes = [
  {
    path: 'input',
    loadChildren: () =>
      import('./modules/input/input.module').then((m) => m.InputModule)
  },
  {
    path: 'output',
    loadChildren: () =>
      import('./modules/output/output.module').then((m) => m.OutputModule)
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { initialNavigation: 'enabled' })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
