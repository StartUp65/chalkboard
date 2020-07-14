import { Component, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { interval } from 'rxjs';

import { SharedService } from '../../../shared/services/shared.service';
import { Cords } from './../../../shared/models/cords.model';

enum PageState {
  INIT,
  LIVE,
  RECORDING,
}
@Component({
  selector: 'startup65-output-container',
  templateUrl: './output-container.component.html',
  styleUrls: ['./output-container.component.scss'],
})
export class OutputContainerComponent implements AfterViewInit {
  @ViewChild('canvas') public canvas: ElementRef;

  width = 800;
  height = 400;
  pageStateEnum: typeof PageState = PageState;
  pageState: PageState = this.pageStateEnum.INIT;

  savedRecording: any[] = [];
  savedRecordingIndex: number = 0;
  showRecordingComplete: boolean = false;
  cx: CanvasRenderingContext2D;
  recordingSub$: any;
  livePlaySub$: any;

  constructor(private sharedService: SharedService) {}

  ngAfterViewInit(): void {
    const canvasEl: HTMLCanvasElement = this.canvas.nativeElement;
    this.cx = canvasEl.getContext('2d');

    canvasEl.width = this.width;
    canvasEl.height = this.height;

    this.cx.lineWidth = 15;
    this.cx.lineCap = 'round';
    this.cx.strokeStyle = '#800000';
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

  public startLivePlay(): void {
    this.pageState = this.pageStateEnum.LIVE;
    this.showRecordingComplete = false;
    this.endRecordingPlay();
    this.livePlaySub$ = this.sharedService.getChalkboardCords().subscribe({
      next: (cords: Cords) => {
        this.drawOnCanvas(cords);
      },
    });
  }

  public stopLivePlay(): void {
    if (this.livePlaySub$) {
      this.livePlaySub$.unsubscribe();
    }
    if (this.pageState === this.pageStateEnum.LIVE) {
      this.pageState = this.pageStateEnum.INIT;
    }
  }

  public getRecording(): void {
    this.pageState = this.pageStateEnum.RECORDING;
    this.stopLivePlay();
    this.sharedService.getChalkboardRecording().subscribe({
      next: (recording: any): void => {
        this.savedRecordingIndex = 0;
        this.savedRecording = recording['cords'];
        this.playSavedRecording();
      },
    });
  }

  private playSavedRecording(): void {
    this.showRecordingComplete = false;
    this.recordingSub$ = interval(100).subscribe({
      next: (): void => {
        if (this.savedRecordingIndex < this.savedRecording.length) {
          this.drawOnCanvas(this.savedRecording[this.savedRecordingIndex]);
          this.savedRecordingIndex++;
        }
        if (this.savedRecordingIndex === this.savedRecording.length) {
          this.endRecordingPlay();
          this.showRecordingComplete = true;
        }
      },
    });
  }

  private endRecordingPlay(): void {
    if (this.recordingSub$) {
      this.recordingSub$.unsubscribe();
    }

    if (this.pageState === this.pageStateEnum.RECORDING) {
      this.pageState = this.pageStateEnum.INIT;
    }
    this.cx.clearRect(0, 0, this.width, this.height);
  }
}
