import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { OutputRoutingModule } from './output-routing.module';
import { OutputContainerComponent } from './components/output-container/output-container.component';


@NgModule({
  declarations: [OutputContainerComponent],
  imports: [
    CommonModule,
    OutputRoutingModule
  ]
})
export class OutputModule { }
