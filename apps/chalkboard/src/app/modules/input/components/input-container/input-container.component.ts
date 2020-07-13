import {
  Component,
  ViewChild,
  ElementRef,
  Input,
  AfterViewInit,
} from '@angular/core';
import { fromEvent } from 'rxjs';
import { throttleTime } from 'rxjs/operators';

import { SharedService } from '../../../shared/services/shared.service';

@Component({
  selector: 'startup65-input-container',
  templateUrl: './input-container.component.html',
  styleUrls: ['./input-container.component.scss'],
})
export class InputContainerComponent implements AfterViewInit {
  @ViewChild('canvas') public canvas: ElementRef;

  @Input() public width = 800;
  @Input() public height = 400;

  private cx: CanvasRenderingContext2D;

  constructor(private sharedService: SharedService) {}

  ngAfterViewInit(): void {
    const canvasEl: HTMLCanvasElement = this.canvas.nativeElement;
    this.cx = canvasEl.getContext('2d');

    canvasEl.width = this.width;
    canvasEl.height = this.height;

    this.cx.lineWidth = 15;
    this.cx.lineCap = 'round';
    this.cx.strokeStyle = '#800000';

    this.captureEvents(canvasEl);
  }

  private captureEvents(canvasEl: HTMLCanvasElement) {
    // this will capture all mousedown events from the canvas element
    fromEvent(canvasEl, 'mousemove')
      .pipe(throttleTime(100))
      .subscribe((res: MouseEvent) => {
        const rect = canvasEl.getBoundingClientRect();
        const currentPos = {
          x: res.clientX - rect.left,
          y: res.clientY - rect.top,
        };
        this.sharedService.setChalkboardCords(currentPos);
        this.drawOnCanvas(currentPos);
      });
  }

  private drawOnCanvas(currentPos: { x: number, y: number }) {
    if (!this.cx) { return; }

    this.cx.beginPath();

    if (currentPos) {
      this.cx.clearRect(0, 0, this.width, this.height);
      this.cx.lineTo(currentPos.x, currentPos.y);
      this.cx.stroke();
    }
  }
}
