import { ChangeDetectorRef, EventEmitter, Injectable, OnDestroy, OnInit } from "@angular/core";
import { BehaviorSubject, Observable, Subject } from "rxjs";
import { TCommonService, THelperCacheService } from "src/app/lib";
import { BaseSevice } from "../base.service";
import { SharedService } from "../shared.service";
import { CRMTeamDTO } from "../../dto/team/team.dto";

@Injectable({
  providedIn: 'root'
})

export class ConversationPostFacade extends BaseSevice  {

  prefix: string = "";
  table: string = "";
  baseRestApi: string = "";

  // public from: any;
  // public comment: any;
  // public conversation: any; // Hội thoại
  // public order: any; // Đơn hàng hiện tại
  // public team: any = {}; // Kênh hiện tại
  // public partner: any; // Khách hàng hiện tại

  // public onCommentSelected$ = new EventEmitter<any>();
  public onPostChanged$ = new EventEmitter<any>(); // Sự kiện thay đổi bài viết
  // public onLiveCampaignChange$ = new EventEmitter<any>(); // sự kiện khi thay đổi chiến dịch
  // private _dicPartnerSimplest$!: Observable<any>; // Danh sách trạng thái khách hàng hiện tại

  constructor(private cacheApi: THelperCacheService,
      private apiService: TCommonService,
      private sharedService: SharedService) {
        super(apiService);
  }

}
