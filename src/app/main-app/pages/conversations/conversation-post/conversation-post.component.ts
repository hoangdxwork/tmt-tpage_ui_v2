import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-conversation-post',
  templateUrl: './conversation-post.component.html',
  styleUrls: ['./conversation-post.component.scss']
})
export class ConversationPostComponent implements OnInit {

  public contactName:number = 1;
  public contactOptionsName = [
      { id: 1, name: 'Page QAXK Nhiên Trung' },
      { id: 2, name: 'Elvis Presley' },
      { id: 3, name: 'Paul McCartney' },
      { id: 4, name: 'Elton John' },
      { id: 5, name: 'Elvis Presley' },
      { id: 6, name: 'Paul McCartney' }
  ]
  listOfDataOrder=[
    {name: 'DCX (Cái)', price: '200000', quantity: '3', totalPrice: '600000', status: 1},
    {name: 'DCX (Cái)', price: '200000', quantity: '3', totalPrice: '600000', status: 0},
    {name: 'DCX (Cái)', price: '200000', quantity: '3', totalPrice: '600000', status: 0},

  ]
  constructor() { }

  ngOnInit(): void {
  }

  counter(i: number) {
    return new Array(i);
}

}
