import { OnChanges, SimpleChanges } from '@angular/core';
import { Input, Component, Output, EventEmitter, ViewChild, ElementRef, OnInit } from '@angular/core';


@Component({
  selector: '[showMoreV2]',
  template: `<div [ngClass]="isMessageItem? '': 'whitespace-normal'">
              <span class="mr-1" [ngClass]="this.isShowmore ? '' : 'see-more whitespace-normal'" [innerHTML]="this.isShowmore ? (text | formatIconLike | bbcodeConvert ) : (text | formatIconLike | bbcodeConvert | slice:0:length )"></span>
              <a class="text-accent-9 cursor-pointer cs-more" *ngIf="!isShowmore && text && text.length > length" (click)="showContent($event)">Xem thêm</a>
              <a *ngIf="isShowmore" class="text-accent-9 cursor-pointer" (click)="showContent($event)">Thu gọn</a>
            </div>`,
})
export class ShowMoreDirectiveV2 implements OnInit, OnChanges {
    isInnerHTML: boolean = false;
    countChar = 74; //ký tự innerHTML;
    countCharPhoneFomat = 50; //ký tự 'format type='text-copyable' value=' phone socket trả về
    @Input()
    text!: string;

    @Input()
    length!: number;

    @Input()
    isMessageItem!: boolean;

    @Output() dathangEvent: EventEmitter<any> = new EventEmitter<any>();

    isShowmore: boolean = false;

    constructor() {
    }
    ngOnChanges(changes: SimpleChanges): void {
        if (changes["text"] && !changes["text"].firstChange) {
            this.text = changes['text'].currentValue;
            if(this.text) {
                this.isInnerHTML = this.text.includes('text-copyable' && 'format');
                this.length = this.isInnerHTML ? (this.length + this.countCharPhoneFomat) : this.length;
            }
        }
    }

    ngOnInit(): void {
      if(this.text){
        this.isInnerHTML = this.text.includes('<span ' && '</span>');
        this.length = this.isInnerHTML ? (this.length + this.countChar) : this.length;
      }
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
