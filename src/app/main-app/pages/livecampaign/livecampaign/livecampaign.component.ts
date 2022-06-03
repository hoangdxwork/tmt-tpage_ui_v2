import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-livecampaign',
  templateUrl: './livecampaign.component.html',
  styleUrls: ['./livecampaign.component.scss']
})
export class LiveCampaignComponent implements OnInit {

  constructor(
    private router: Router,
  ) { }

  ngOnInit(): void {
  }

  onCreate() {
    this.router.navigateByUrl(`live-campaign/create`);
  }

}
