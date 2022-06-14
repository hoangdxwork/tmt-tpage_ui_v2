import { MakeActivityItemWebHook } from './../../dto/conversation/make-activity.dto';
import { CRMTeamDTO } from './../../dto/team/team.dto';
import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { TDSSafeAny } from 'tds-ui/shared/utility';

@Component({
  selector: 'show-item-image',
  templateUrl: './show-item-image.component.html',
})
export class ShowItemImageComponent implements OnInit {
  @Input() data!: MakeActivityItemWebHook;
  @Input() lstImage: TDSSafeAny[] = [];
  @Input() team!: CRMTeamDTO;
  @Input() name!: string;
  @Input() imageClick!: number;

  @Output() closeShowItemImage = new EventEmitter<boolean>();

  constructor() { }

  ngOnInit(): void {
  }

  closeShowImages(){
    this.closeShowItemImage.emit(false)
  }
  getUrl(url: string){
    return `url("${url}")`
  }
  onPrevious(){
    if(this.imageClick>0){
      this.imageClick -=1;
    }else{
      this.imageClick = this.lstImage.length-1;
    }
  }
  onNext(){
    if(this.imageClick<this.lstImage.length-1){
      this.imageClick +=1;
    }else{
      this.imageClick = 0;
    }
  }
  onChosseImage(idx: number){
    this.imageClick = idx;
  }
}
