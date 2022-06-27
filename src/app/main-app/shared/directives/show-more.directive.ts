import { Input, Component, Output, EventEmitter } from '@angular/core';


@Component({
  selector: '[showMore]',
  template: '<div><div [innerHTML]="this.isShowmore ? text : text | slice:0:length"></div><a class="text-accent-9" *ngIf="!isShowmore && text && text.length > length " (click)="showContent($event)">Xem thêm</a><a *ngIf="isShowmore" class="text-accent-9" (click)="showContent($event)">Thu gọn</a></div>',
})
export class ShowMoreDirective {
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