import { EventEmitter, Injectable, OnDestroy, OnInit } from "@angular/core";
import { BehaviorSubject, Observable, Subject } from "rxjs";
import { map, shareReplay, takeUntil } from "rxjs/operators";
import { TCommonService } from "src/app/lib";
import { BaseSevice } from "../base.service";
import { ConversationService } from "../conversation/conversation.service";
import { ConversationFacebookState } from "../facebook-state/conversation-facebook.state";
import { SharedService } from "../shared.service";
import { SignalRConnectionService } from "../signalR/signalR-connection.service";
import { CRMMatchingDTO } from '../../dto/conversation-all/crm-matching.dto';
import { CRMMatchingMappingDTO } from "../../dto/conversation-all/conversation-all.dto";
import { DataUpdate } from "../../dto/conversation/conversation.dto";
import { CRMTeamService } from "../crm-team.service";
import { HrefPageService } from "../href-page.service";
import { TDSHelperArray, TDSHelperObject, TDSHelperString, TDSMessageService, TDSNotificationService } from "tmt-tang-ui";
import { StringHelperV2 } from "../../shared/helper/string.helper";
import { ActivatedRoute, Router } from "@angular/router";
import { CRMTeamDTO } from "../../dto/team/team.dto";

@Injectable({
  providedIn: 'root'
})

export class ConversationPostFacade extends BaseSevice implements OnDestroy {

  prefix: string = "";
  table: string = "";
  baseRestApi: string = "";
  destroy$ = new Subject();

  public from: any;
  public comment: any;
  public conversation: any; // Hội thoại
  public order: any; // Đơn hàng hiện tại
  public team: any = {}; // Kênh hiện tại
  public partner: any; // Khách hàng hiện tại
  public onPartnerLoaded$ = new EventEmitter<any>(); // Sự kiện khi thông tin khách hàng được load thành công

  public onCommentSelected$ = new EventEmitter<any>();
  public onPostChanged$ = new EventEmitter<any>(); // Sự kiện thay đổi bài viết
  private _dicPartnerSimplest$: BehaviorSubject<any> = new BehaviorSubject({ data: {} }); // Danh sách trạng thái khách hàng hiện tại

  constructor(private message: TDSMessageService,
      private apiService: TCommonService,
      private cvsFbState: ConversationFacebookState,
      private service: ConversationService,
      private crmTeamService: CRMTeamService,
      private hrefService: HrefPageService,
      private notification: TDSNotificationService,
      private router: Router,
      private sgRConnectionService: SignalRConnectionService,
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

  public setTeam(team: CRMTeamDTO) {
    this.team = team;

    this.initDicPartnerSimplest(team.Id);
  }

  public getDicPartnerSimplest$() {
    return this._dicPartnerSimplest$;
  }

  public initDicPartnerSimplest(teamId: number) {
    // this._dicPartnerSimplest$ = new BehaviorSubject<any>({ data: {} });

    // pouchDBFb.get(this.team.Facebook_PageId, (err, doc) => {

    //   this._dicPartnerSimplest$.next(doc || { data: {} });

    //   let timestamp = (doc || {}).last;
    //   this.onTeamReplayFbPartnersPage(teamId, timestamp).subscribe(res => {
    //     console.log(res);
    //     if (!res) {
    //       this._dicPartnerSimplest$.next({ data: res || {} });
    //     }
    //   });
    // });
  }


  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

}
