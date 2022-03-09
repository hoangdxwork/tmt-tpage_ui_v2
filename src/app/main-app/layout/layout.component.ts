import { Component, OnInit } from '@angular/core';
import { UserInitDTO } from 'src/app/lib';
import { TDSSafeAny } from 'tmt-tang-ui';

@Component({
  selector: 'app-layout',
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.scss']
})
export class LayoutComponent implements OnInit {
  userInit!: UserInitDTO;
  lstMenu = [
    {
      name: "Tổng quan",
      icon: "tdsi-home-fill",
      link: '/dashboard',
    },
    {
      name: "Tất cả",
      icon: "tdsi-drawer-fill",
      link: '/conversation/all',
    },
    {
      name: "Tin nhắn",
      icon: "tdsi-email-fill",
      link: '/conversation/inbox',
    },

    {
      name: "Bình luận",
      icon: "tdsi-comment-fill",
      link: '/conversation/comment',
    },

    {
      name: "Bài viết",
      icon: "tdsi-edit-paper-fill",
      link: '/conversation/post',
    },

    {
      name: "Đơn hàng",
      icon: "tdsi-bag-fill",
      link: '/order',
    },
    {
      name: "Phiếu bán hàng",
      icon: "tdsi-dataset-fill",
      link: '/bill',
    },
    {
      name: "Khách hàng",
      icon: "tdsi-user-fill",
      link: '/partner',
    },
    {
      name: "Kênh kết nối",
      icon: "tdsi-facebook-2-fill",
      link: '/facebook',
    },
     {
      name: "Thống kê",
      icon: "tdsi-chart-pie-fill",
      link: '/report',
    },
    {
      name: "Cấu hình",
      icon: "tdsi-gear-line",
      link: '/configs',
    },
  ];
  inlineCollapsed = false;
  shopId!: TDSSafeAny;
  lstShop!: Array<TDSSafeAny>;
  constructor() { }

  ngOnInit(): void {
  }
  onSelectShopChange(event: TDSSafeAny) {
  
  }
  onLogout(){
   
  }
  onOpenChange(e: boolean) {
    this.inlineCollapsed = e;
  }
}
