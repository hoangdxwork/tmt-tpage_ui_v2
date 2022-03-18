import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'tds-conversations',
  templateUrl: './tds-conversations.component.html',
  styleUrls: ['./tds-conversations.component.scss'],
  host:{
    class:"w-full h-full overflow-hidden flex flex-col"
  }
})
export class TDSConversationsComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

}
