import { Cords } from './../../../shared/models/cords.model';
import {
  Component,
  ViewChild,
  ElementRef,
  Input,
  AfterViewInit,
} from '@angular/core';

import { SharedService } from '../../../shared/services/shared.service';
import { interval } from 'rxjs';
@Component({
  selector: 'startup65-output-container',
  templateUrl: './output-container.component.html',
  styleUrls: ['./output-container.component.scss'],
})
export class OutputContainerComponent implements AfterViewInit {
  @ViewChild('canvas') public canvas: ElementRef;

  width = 800;
  height = 400;
  savedRecording: any[] = [];
  savedRecordingIndex: number = 0;
  showRecordingComplete: boolean = false;
  cx: CanvasRenderingContext2D;
  recordingSub$: any;

  constructor(private sharedService: SharedService) {}

  ngAfterViewInit(): void {
    const canvasEl: HTMLCanvasElement = this.canvas.nativeElement;
    this.cx = canvasEl.getContext('2d');

    canvasEl.width = this.width;
    canvasEl.height = this.height;

    this.cx.lineWidth = 15;
    this.cx.lineCap = 'round';
    this.cx.strokeStyle = '#800000';

    this.sharedService.getChalkboardCords().subscribe({
      next: (cords: Cords) => {
        const rect = this.canvas.nativeElement.getBoundingClientRect();
        this.drawOnCanvas(cords);
      },
    });
  }

  private drawOnCanvas(currentPos: { x: number; y: number }) {
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

  public getRecording(): void {
    this.sharedService.getChalkboardRecording().subscribe({
      next: (recording: any): void => {
        this.savedRecording = recording['cords'];
        this.playSavedRecording();
      },
    });
  }

  private playSavedRecording(): void {
    this.recordingSub$ = interval(100).subscribe({
      next: (): void => {
        if (this.savedRecordingIndex < this.savedRecording.length) {
          this.drawOnCanvas(this.savedRecording[this.savedRecordingIndex]);
          this.savedRecordingIndex++;
        }
        if (this.savedRecordingIndex === this.savedRecording.length) {
          this.endRecordingPlay();
        }
      },
    });
  }

  private endRecordingPlay(): void {
    this.recordingSub$.unsubscribe();
    this.showRecordingComplete = true;
  }
}
