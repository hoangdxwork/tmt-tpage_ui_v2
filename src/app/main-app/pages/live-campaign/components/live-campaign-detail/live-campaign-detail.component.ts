import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { LiveCampaignService } from 'src/app/main-app/services/live-campaign.service';

@Component({
  selector: 'live-campaign-detail',
  templateUrl: './live-campaign-detail.component.html'
})
export class LiveCampaignDetailComponent implements OnInit {

  lstMenu = ['Tổng quan', 'Thống kê theo sản phẩm', 'Tin nhắn', 'Đơn hàng', 'Hóa đơn chờ thanh toán', 'Danh sách hóa đơn'];
  tabCurrent: number = 0;
  tabPath: string = 'report';

  liveCampaignId!: string;
  liveCampaignName?: string;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private liveCampaignService: LiveCampaignService,
  ) { }

  ngOnInit(): void {
    this.liveCampaignId = this.route.snapshot.paramMap.get("id") || '';

    this.route.queryParams.subscribe(params => {
      this.tabPath = params?.tab || 'report';

      // TODO: load route của tab hiện tại
      switch(this.tabPath) {
        case 'report':
          this.tabCurrent = 0;
          break;
        case 'product':
          this.tabCurrent = 1;
          break;
        case 'message':
          this.tabCurrent = 2;
          break;
        case 'order':
          this.tabCurrent = 3;
          break;
        case 'bill-payment':
          this.tabCurrent = 4;
          break;
        case 'bill':
          this.tabCurrent = 5;
          break;
      }
    });

    this.loadData(this.liveCampaignId);
  }

  loadData(id: string) {
    this.liveCampaignService.getById(id).subscribe(res => {
      this.liveCampaignName = res?.Name;
    });
  }

  onEdit() {
    this.router.navigateByUrl(`live-campaign/edit/${this.liveCampaignId}`);
  }

  directPage(route: string) {
    this.router.navigateByUrl(route);
  }

  onCreate() {
    this.router.navigateByUrl(`live-campaign/create`);
  }

  onChangeTab(event: any) {
    if(this.liveCampaignId) {
      switch(event) {
        case 0:
          this.tabPath = 'report';
          this.directPage(`live-campaign/detail/${this.liveCampaignId}?tab=report`);
          break;
        case 1:
          this.tabPath = 'product';
          this.directPage(`live-campaign/detail/${this.liveCampaignId}?tab=product`);
          break;
        case 2:
          this.tabPath = 'message';
          this.directPage(`live-campaign/detail/${this.liveCampaignId}?tab=message`);
          break;
        case 3:
          this.tabPath = 'order';
          this.directPage(`live-campaign/detail/${this.liveCampaignId}?tab=order`);
          break;
        case 4:
          this.tabPath = 'paid-bill';
          this.directPage(`live-campaign/detail/${this.liveCampaignId}?tab=bill-payment`);
          break;
        case 5:
          this.tabPath = 'bill';
          this.directPage(`live-campaign/detail/${this.liveCampaignId}?tab=bill`);
          break;
       }
    }
  }
}
