import { Injectable } from '@angular/core';
import { Observable} from 'rxjs';
import { TAPIDTO, TApiMethodType, TCommonService, THelperCacheService } from 'src/app/lib';
import { TDSSafeAny } from 'tmt-tang-ui';
import { ODataPartnerCategoryDTO } from '../dto/partner/partner-category.dto';
import { PartnerStatusReport } from '../dto/partner/partner-status-report.dto';
import { StatusDTO } from '../dto/partner/partner.dto';
import { BaseSevice } from './base.service';
// import * as urlLib from 'url';
import { ActivatedRoute, Router } from '@angular/router';

const defaultRoute = [
    {key: "dashboard", name: "Tổng quan", child: []},
    {key: "conversation", name: "Hội thoại", child: ["all", "message", "comment", "post"]},
    {key: "order", name: "Đơn hàng", child: []},
    {key: "bill", name: "Phiếu bán hàng", child: []},
    {key: "partner", name: "Khách hàng", child: []},
    {key: "facebook", name: "Kênh kết nối", child: []},
    {key: "report", name: "Thống kế", child: []},
    {key: "configs", name: "Cấu hình", child: []},
];

@Injectable({
  providedIn: 'root'
})

export class HrefPageService extends BaseSevice {

  prefix: string = "";
  table: string = "";
  baseRestApi: string = "";
  public href!: string;

  constructor(private apiService: TCommonService,
    private activatedRoute: ActivatedRoute,
    private router: Router) {
      super(apiService);
      // this.changeHref();
  }

  // changeHref() {
  //   this.activatedRoute.queryParams.subscribe(params => {
  //       this.getCurrentHref();
  //   });
  // }

  // getCurrentHref() {
  //   this.href = this.router.url;
  // }

  // getCurrentPage() {
  //     var url = urlLib.parse(this.href);
  //     var pathname = url.pathname;
  //     var name = pathname ? pathname.split("/") : null;
  //     var page = name && name[2] ? name[2] : null;
  //     if(page) {
  //         return defaultRoute.find(x => x.key == page);
  //     }
  //     return null;
  // }

  // getParams() {
  //   var url = urlLib.parse(this.href);
  //   var query = url.query;
  //   var params = query ? query.split("&") : [];
  //   var reuslt = {} as any;

  //   params.forEach((e: any) => {
  //       let param = e.split("=");
  //       reuslt[param[0]] = param[1];
  //   });
  //   return reuslt;
  // }


}
