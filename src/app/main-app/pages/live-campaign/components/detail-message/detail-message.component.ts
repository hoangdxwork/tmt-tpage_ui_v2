import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'detail-message',
  templateUrl: './detail-message.component.html'
})
export class DetailMessageComponent implements OnInit {

  @Input() liveCampaignId!: string;

  constructor( ) { }

  ngOnInit(): void {
  }

}
