import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { InputRoutingModule } from './input-routing.module';
import { InputContainerComponent } from './components/input-container/input-container.component';


@NgModule({
  declarations: [InputContainerComponent],
  imports: [
    CommonModule,
    InputRoutingModule
  ]
})
export class InputModule { }
