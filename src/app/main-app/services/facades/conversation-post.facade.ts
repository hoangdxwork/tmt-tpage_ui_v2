import { ChangeDetectorRef, EventEmitter, Injectable, OnDestroy, OnInit } from "@angular/core";
import { BehaviorSubject, Observable, Subject } from "rxjs";
import { TCommonService, THelperCacheService } from "src/app/lib";
import { BaseSevice } from "../base.service";
import { SharedService } from "../shared.service";
import { CRMTeamDTO } from "../../dto/team/team.dto";

@Injectable({
  providedIn: 'root'
})

export class ConversationPostFacade extends BaseSevice implements OnDestroy {

  prefix: string = "";
  table: string = "";
  baseRestApi: string = "";
  destroy$ = new Subject<void>();

  public from: any;
  public comment: any;
  public conversation: any; // Hội thoại
  public order: any; // Đơn hàng hiện tại
  public team: any = {}; // Kênh hiện tại
  public partner: any; // Khách hàng hiện tại
  public onPartnerLoaded$ = new EventEmitter<any>(); // Sự kiện khi thông tin khách hàng được load thành công

  public onCommentSelected$ = new EventEmitter<any>();
  public onPostChanged$ = new EventEmitter<any>(); // Sự kiện thay đổi bài viết
  private _dicPartnerSimplest$!: Observable<any>; // Danh sách trạng thái khách hàng hiện tại
  private _keyCachePartnerSimplest = "_dict_partner_simplest";
  fbPartnerSimplest: any = {};

  constructor(private cacheApi: THelperCacheService,
      private apiService: TCommonService,
      private sharedService: SharedService) {
        super(apiService);

        this.initialize();
  }

  initialize() {
    this.onCommentSelected$.subscribe(res => {
      this.comment = res; // Cập nhật giá trị hiện tại của comment
      if (!this.from || res.from.id != this.from.id) { // Nếu bình luận khác
        this.from = Object.assign({}, res.from);
        this.partner = null;
        // TODO: Tải khách hàng theo id người dùng bình luận

      } else {
        // Thông tin cũ, không làm gì cả
      }
    });
  }

  public setPartnerSimplest(team: CRMTeamDTO) {
    this.team = team;
   // this.initDicPartnerSimplest(team.Id);
  }

  public getDicPartnerSimplest$(): Observable<any> {
    return this._dicPartnerSimplest$;
  }

  // public initDicPartnerSimplest(teamId: number): any {
  //   let keyCache = `${this._keyCachePartnerSimplest}[${teamId}]`;

  //   this.cacheApi.getItem(keyCache).pipe(takeUntil(this.destroy$))
  //     .subscribe((res: any) => {
  //       if(TDSHelperString.hasValueString(res)) {
  //         let obs = JSON.parse(res.value);
  //       } else {
  //         this.getPartnersByTimestamp(teamId, undefined);
  //       }
  //   })
  // }

  // getPartnersByTimestamp(teamId: any, timestamp: number | undefined) {debugger
  //    this.partnerService.getPartnersByTimestamp(teamId, timestamp)
  //     .subscribe((res: any) => {debugger
  //       this.fbPartnerSimplest = Object.assign(this.fbPartnerSimplest, res.Data);
  //       timestamp = res.Next || res.Last
  //       if(timestamp) {
  //         return  this.getPartnersByTimestamp(teamId, timestamp);
  //       }
  //       // let obj = {
  //       //   id: teamId,
  //       //   last: res.Next || res.Last,
  //       //   data: res.Data
  //       // } as any;

  //       // let keyCache = `${this._keyCachePartnerSimplest}[${teamId}]`;
  //       // this.cacheApi.setItem(key, JSON.stringify(obj));
  //   })
  // }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

}
