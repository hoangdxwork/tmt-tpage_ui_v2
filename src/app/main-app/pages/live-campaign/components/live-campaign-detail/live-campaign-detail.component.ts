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

  liveCampaignId!: string;
  liveCampaignName?: string;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private liveCampaignService: LiveCampaignService,
  ) { }

  ngOnInit(): void {
    this.liveCampaignId = this.route.snapshot.paramMap.get("id") || '';
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

}
