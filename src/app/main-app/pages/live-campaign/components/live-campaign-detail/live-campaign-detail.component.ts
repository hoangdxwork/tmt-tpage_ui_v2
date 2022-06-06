import { TDSSafeAny } from 'tmt-tang-ui';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'live-campaign-detail',
  templateUrl: './live-campaign-detail.component.html'
})
export class LiveCampaignDetailComponent implements OnInit {

  lstMenu = ['Tổng quan', 'Thống kê theo sản phẩm', 'Tin nhắn', 'Đơn hàng', 'Hóa đơn chờ thanh toán', 'Danh sách hóa đơn'];
  tabCurrent: number = 0;

  liveCampaignId!: string;

  constructor(
    private route: ActivatedRoute,
  ) { }

  ngOnInit(): void {
    this.liveCampaignId = this.route.snapshot.paramMap.get("id") || '';
  }

  onChangeMenu(event: TDSSafeAny) {
  }

}
