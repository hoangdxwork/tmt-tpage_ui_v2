import { AfterViewInit, Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable, pipe, Subject, Subscription } from 'rxjs';
import { finalize, takeUntil } from 'rxjs/operators';
import { ActiveMatchingItem, CRMMatchingMappingDTO } from 'src/app/main-app/dto/conversation-all/conversation-all.dto';
import { CRMTeamDTO } from 'src/app/main-app/dto/team/team.dto';
import { ConversationService } from 'src/app/main-app/services/conversation/conversation.service';
import { CRMTeamService } from 'src/app/main-app/services/crm-team.service';
import { ConversationDataFacade } from 'src/app/main-app/services/facades/conversation-data.facade';
import { FacebookGraphService } from 'src/app/main-app/services/facebook-graph.service';
import { PartnerService } from 'src/app/main-app/services/partner.service';
import { TpageBaseComponent } from 'src/app/main-app/shared/tpage-base/tpage-base.component';
import { TDSHelperObject, TDSMessageService, TDSHelperArray, TDSHelperString } from 'tmt-tang-ui';

@Component({
  selector: 'app-conversation-all',
  templateUrl: './conversation-all.component.html',
  styleUrls: ['./conversation-all.component.scss']
})

export class ConversationAllComponent extends TpageBaseComponent implements OnInit, AfterViewInit, OnDestroy {

  isLoading: boolean = false;
  isLoadingChat: boolean = false;
  dataSource$!: Observable<any>;
  lstMatchingItem!: ActiveMatchingItem[];
  destroy$ = new Subject();
  psid!: string;
  activeMatchingItem!: ActiveMatchingItem;
  isFastSend: boolean = false;
  currentOrderCode!: string | undefined;
  visibleDrawerFillter: boolean = false;
  rangeDate = null;
  isCheck: boolean = false;
  isSort: boolean = false;
  indeterminate: boolean = false;

  constructor(private message: TDSMessageService,
    private conversationDataFacade: ConversationDataFacade,
    public crmService: CRMTeamService,
    private conversationService: ConversationService,
    private partnerService: PartnerService,
    private fbGraphService: FacebookGraphService,
    public activatedRoute: ActivatedRoute,
    public router: Router) {
      super(crmService, activatedRoute, router);
  }

  ngOnInit(): void {
    this.loadQueryParamMap().pipe(takeUntil(this.destroy$)).subscribe(([team, params]: any) => {
      if (!TDSHelperObject.hasValue(team)) {
          this.onRedirect();
      } else {
          this.type = params?.params?.type;
          this.setParamsUrl(params.params);
          this.setCurrentTeam(team);

          let exist = (TDSHelperString.isString(this.activeMatchingItem?.psid) != TDSHelperString.isString(this.paramsUrl.psid))
            || (!TDSHelperString.isString(this.activeMatchingItem?.psid) && !TDSHelperString.isString(this.paramsUrl?.psid));

          if(exist){
            this.fetchLiveConversations(team);
            this.onChangeConversation(team);
          }
      }
    });
  }

  onChangeConversation(team: any) {
    this.dataSource$ = this.conversationDataFacade.makeDataSource(team.Facebook_PageId, this.type);
    this.loadConversations((this.dataSource$));
  }

  loadConversations(dataSource$: Observable<any>) {
    if (dataSource$) {
      this.isLoading = true;
      dataSource$.pipe(takeUntil(this.destroy$)).pipe(finalize(() => { this.isLoading = false }))
        .subscribe((res: CRMMatchingMappingDTO) => {
          if (res && TDSHelperArray.hasListValue(res.items)) {
            this.lstMatchingItem = [...res.items];
            let psid: string = this.paramsUrl?.psid || null;

            //TODO: check psid khi load lần 2,3,4...
            let exits = this.lstMatchingItem.filter(x => x.psid == psid)[0];
            if (exits) {
              this.activeConversations(exits);
            } else {
              //TODO: load lần đầu tiên
              this.activeConversations(this.lstMatchingItem[0]);
            }
          }
        }, error => {
          this.message.error('Load thông tin CRMMatching đã xảy ra lỗi');
        })
    }
  }

  //TODO: matching đang chọn active
  activeConversations(item: ActiveMatchingItem) {
    (this.activeMatchingItem as any) = null;

    if (TDSHelperObject.hasValue(item)) {
      if (this.isFastSend == true) {
          this.conversationDataFacade.checkSendMessage(item.page_id, this.type, item.psid);
      } else {
          //TODO: lần đầu tiên sẽ lấy items[0] từ danh sách matching và gán lại psid vào params
          this.psid = item.psid;
          this.activeMatchingItem = item;

          let uri = this.router.url.split("?")[0];
          let uriParams = `${uri}?teamId=${this.currentTeam?.Id}&type=${this.type}&psid=${item?.psid}`;
          this.router.navigateByUrl(uriParams);
      }
    }
  }

  ngAfterViewInit(): void {
  }

  onClickTeam(data: CRMTeamDTO): any {
    if (this.paramsUrl?.teamId) {
      let uri = this.router.url.split("?")[0];
      let uriParams = `${uri}?teamId=${this.currentTeam?.Id}&type=${this.type}`;
      this.router.navigateByUrl(uriParams);
    }
    this.crmService.onUpdateTeam(data);
  }

  onLoadMiniChat(event: any): void {

  }

  fetchLiveConversations(team: any): void {
    this.fbGraphService.api(`me/conversations?fields=id,link,participants,senders&access_token=${team.Facebook_PageToken}`)
      .subscribe((res :any) => {
        console.log(res);
      });
  }

  changeOrderId(orderCode: string | undefined) {
    this.currentOrderCode = orderCode;
  }

  openDrawerFillter(){
    this.visibleDrawerFillter = true;
  }

  close(): void {
      this.visibleDrawerFillter = false;
  }

  onChange(result: Date): void {
    console.log('onChange: ', result);
  }

  setCheck(){
    this.isCheck = !this.isCheck;
  }

  setSort(){
    this.isSort = !this.isSort;

  }
  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
