import { FormControl, Validators } from '@angular/forms';
import { Component, EventEmitter, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-extend-pack-of-data',
  templateUrl: './extend-pack-of-data.component.html',
  styleUrls: ['./extend-pack-of-data.component.scss']
})
export class ExtendPackOfDataComponent implements OnInit {

  price = 1000000
  public contactOptions = [
    { id: 1, value: 1 },
    { id: 2, value: 2 },
    { id: 3, value: 3 },
    { id: 4, value: 4 },
    { id: 5, value: 5 },
    { id: 6, value: 6 },
    { id: 7, value: 7 },
    { id: 8, value: 8 },
    { id: 9, value: 9 },
    { id: 10, value: 10 },
    { id: 11, value: 11 },
    { id: 12, value: 12 },
]

chooseMonth!: FormControl;
  constructor() { }

  ngOnInit(): void {
    this.chooseMonth = new FormControl(1, Validators.required);
  }

  selectMonthChange(){
  }

  clickBackPageInfoData(){
  }

  clickNextInfoDataPayment(){
  }
}
