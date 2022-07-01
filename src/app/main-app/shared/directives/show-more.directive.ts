import { Input, Component, Output, EventEmitter, ViewChild, ElementRef, OnInit } from '@angular/core';


@Component({
  selector: '[showMore]',
  template: `<div class="whitespace-normal">
                <span class="mr-1" [innerHTML]="this.isShowmore ? text : text | slice:0:length"></span>
                <a class="text-accent-9" *ngIf="!isShowmore && text && text.length > length" (click)="showContent($event)">Xem thêm</a>
                <a *ngIf="isShowmore" class="text-accent-9" (click)="showContent($event)">Thu gọn</a>
            </div>`,
})
export class ShowMoreDirective implements OnInit {
    isInnerHTML: boolean = false;
    countChar = 74; //ký tự innerHTML
    @Input()
    text!: string;

    @Input()
    length!: number;

    @Input()
    arr!: any[];

    @Output() dathangEvent: EventEmitter<any> = new EventEmitter<any>();

    isShowmore: boolean = false;

    constructor() {
    }

    ngOnInit(): void {
        this.isInnerHTML = this.text.includes('<span ' && '</span>');
        this.length = this.isInnerHTML ? (this.length + this.countChar) : this.length;
    }

    showContent(e: any){
        e.stopPropagation();
        if (!this.isShowmore) {
        this.isShowmore = true;
        } else {
            this.isShowmore = false;
        }
        this.dathangEvent.emit();
    }
}
