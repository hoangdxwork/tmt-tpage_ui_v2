import { TDSDestroyService } from 'tds-ui/core/services';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-facebook',
  templateUrl: './facebook.component.html',
  providers: [ TDSDestroyService]
})
export class FacebookComponent implements OnInit {

  currentTab: number = 0;
  currentPage!: string | null;

  constructor(public router: Router,
    public activatedRoute: ActivatedRoute) {
  }

  ngOnInit(): void {
    this.activatedRoute.queryParams.subscribe(params => {
      this.currentPage = params?.page || 'fb';

      // TODO: load route của tab hiện tại
      switch(this.currentPage) {
        case 'fb':
          this.currentTab = 0;
          break;
        case 'tshop':
          this.currentTab = 1;
          break;
      }
    });
  }

  onChangeTab(event: any) {
    if(event) {
      this.currentTab = event.index;

      switch(this.currentTab) {
        case 0:
          this.currentPage = 'fb';
          break;
        case 1:
          this.currentPage = 'tshop';
          break;
      }
      
      this.directPage(`connect-channel?page=${this.currentPage}`);
    }
  }

  directPage(route: string) {
    this.router.navigateByUrl(route);
  }
}
