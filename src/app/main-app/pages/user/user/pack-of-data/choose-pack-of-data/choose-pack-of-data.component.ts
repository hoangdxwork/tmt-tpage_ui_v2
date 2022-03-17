import { Component, OnInit, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-choose-pack-of-data',
  templateUrl: './choose-pack-of-data.component.html',
  styleUrls: ['./choose-pack-of-data.component.scss']
})
export class ChoosePackOfDataComponent implements OnInit {

  @Output() outputBackInfoData = new EventEmitter<boolean>();
  array = [0,1,2,3]
  isIndex = -1
  constructor() { }

  ngOnInit(): void {
  }
  focusData(idx: number){
    this.isIndex = idx
  }
  clickBackPageInfoData(){
    this.outputBackInfoData.emit(true)
  }
}
