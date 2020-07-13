import { Cords } from './../../../shared/models/cords.model';
import { Component, ViewChild, ElementRef, Input, AfterViewInit } from '@angular/core';

import { SharedService } from '../../../shared/services/shared.service'
@Component({
  selector: 'startup65-output-container',
  templateUrl: './output-container.component.html',
  styleUrls: ['./output-container.component.scss']
})
export class OutputContainerComponent implements AfterViewInit {

  @ViewChild('canvas') public canvas: ElementRef;

  @Input() public width = 800;
  @Input() public height = 400;

  private cx: CanvasRenderingContext2D;

  constructor(private sharedService: SharedService) { }

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
      }
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
