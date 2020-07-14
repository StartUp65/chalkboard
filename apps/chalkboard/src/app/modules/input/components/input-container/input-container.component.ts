import { Component, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { fromEvent, interval } from 'rxjs';
import { throttleTime } from 'rxjs/operators';

import { SharedService } from '../../../shared/services/shared.service';

enum PageState {
  RECORDING,
  LIVE,
  INIT,
}

@Component({
  selector: 'startup65-input-container',
  templateUrl: './input-container.component.html',
  styleUrls: ['./input-container.component.scss'],
})
export class InputContainerComponent implements AfterViewInit {
  @ViewChild('canvas') public canvas: ElementRef;

  pageStateEnum: typeof PageState = PageState;
  pageState: PageState = this.pageStateEnum.INIT;

  width = 800;
  height = 400;
  currentPos: any;
  recording: any[] = [];

  private cx: CanvasRenderingContext2D;
  liveSubcription$: any;
  recordSub$: any;

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

  private captureEvents(canvasEl: HTMLCanvasElement): void {
    fromEvent(canvasEl, 'mousemove')
      .pipe(throttleTime(100))
      .subscribe((res: MouseEvent) => {
        const rect = canvasEl.getBoundingClientRect();
        const currentPos = {
          x: res.clientX - rect.left,
          y: res.clientY - rect.top,
        };
        this.currentPos = currentPos;
      });
  }

  private drawOnCanvas(currentPos: { x: number; y: number }): void {
    if (!this.cx) {
      return;
    }
    this.cx.beginPath();
    if (currentPos) {
      this.cx.clearRect(0, 0, this.width, this.height);
      this.cx.lineTo(currentPos.x, currentPos.y);
      this.cx.stroke();
    }
  }

  public startLiveRecording(): void {
    this.pageState = this.pageStateEnum.LIVE;
    this.liveSubcription$ = interval(100).subscribe({
      next: (): void => {
        if (this.currentPos) {
          this.sharedService.setChalkboardCords(this.currentPos);
          this.drawOnCanvas(this.currentPos);
        }
      },
    });
  }

  public stopLiveRecording(): void {
    this.pageState = this.pageStateEnum.INIT;
    this.liveSubcription$.unsubscribe();
  }

  public startRecording(): void {
    this.pageState = this.pageStateEnum.RECORDING;
    this.recordSub$ = interval(100).subscribe({
      next: (): void => {
        if (this.currentPos) {
          this.recording.push(this.currentPos);
          this.drawOnCanvas(this.currentPos);
        }
      },
    });
  }

  public stopRecording(): void {
    this.recordSub$.unsubscribe();
    this.pageState = this.pageStateEnum.INIT;
    this.sharedService.setChalkboardRecording(this.recording);
  }
}
