import { TDSNotificationService, TDSSafeAny } from 'tmt-tang-ui';
import { AfterViewInit, Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable, pipe, Subject, Subscription } from 'rxjs';
import { finalize, takeUntil } from 'rxjs/operators';
import { ConversationMatchingItem, CRMMatchingMappingDTO } from 'src/app/main-app/dto/conversation-all/conversation-all.dto';
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
  dataSource$!: Observable<any> | undefined;
  lstMatchingItem!: ConversationMatchingItem[];
  destroy$ = new Subject();
  psid!: string;
  activeCvsItem!: ConversationMatchingItem;
  isFastSend: boolean = false;
  currentOrderCode!: string | undefined;
  visibleDrawerFillter: boolean = false;
  rangeDate = null;
  checked: boolean = false;
  isOpenCollapCheck: boolean = false;
  isSort: boolean = false;
  indeterminate: boolean = false;
  setOfCheckedId = new Set<string>();

  currentOrderTab: number = 0;

  letters = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'];

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
        return this.onRedirect();
      }
      // TODO: change Team
      if(team.Id != this.currentTeam?.Id) {
        this.fetchLiveConversations(team);
        this.setCurrentTeam(team);
      }

      this.type = params?.params?.type;
      this.setParamsUrl(params.params);

      let exist = (TDSHelperString.isString(this.activeCvsItem?.psid) != TDSHelperString.isString(this.paramsUrl?.psid))
        || (!TDSHelperString.isString(this.activeCvsItem?.psid) && !TDSHelperString.isString(this.paramsUrl?.psid));

      if(exist){
        this.onChangeConversation(team);
      }
    });
  }


  onChangeConversation(team: any) {
    this.validateData();
    this.dataSource$ = this.conversationDataFacade.makeDataSource(team.Facebook_PageId, this.type);
    this.loadConversations((this.dataSource$));
  }

  validateData(){
    (this.activeCvsItem as any) = null;
    (this.dataSource$ as any) = null;
    this.lstMatchingItem = [];
  }

  loadConversations(dataSource$: Observable<any>) {
    if (dataSource$) {
      this.isLoading = true;
      dataSource$.pipe(takeUntil(this.destroy$)).pipe(finalize(() => { this.isLoading = false }))
        .subscribe((res: CRMMatchingMappingDTO) => {
          if (res && TDSHelperArray.hasListValue(res.items)) {
              this.lstMatchingItem = [...res.items];
              let psid = this.paramsUrl?.psid || null;
              //TODO: check psid khi load lần 2,3,4...
              let exits = this.lstMatchingItem.filter(x => x.psid == psid)[0];
              if (exits) {
                this.getActiveCvsItem(exits);
              } else {
                //TODO: load lần đầu tiên
                this.getActiveCvsItem(this.lstMatchingItem[0]);
              }
          }
        }, error => {
          this.message.error('Load thông tin CRMMatching đã xảy ra lỗi');
        })
    }
  }

  //TODO: matching đang chọn active
  getActiveCvsItem(item: ConversationMatchingItem) {
    if (TDSHelperObject.hasValue(item)) {
      if (this.isFastSend == true) {
          this.conversationDataFacade.checkSendMessage(item.page_id, this.type, item.psid);
      } else {
          //TODO: lần đầu tiên sẽ lấy items[0] từ danh sách matching và gán lại psid vào params
          this.psid = item.psid;
          this.activeCvsItem = item;

          let uri = this.router.url.split("?")[0];
          let uriParams = `${uri}?teamId=${this.currentTeam?.Id}&type=${this.type}&psid=${item?.psid}`;
          this.router.navigateByUrl(uriParams);
      }
    }
  }

  changeCurrentCvsItem(item: any){
    (this.activeCvsItem as any) = null;
    this.getActiveCvsItem(item);
  }

  ngAfterViewInit(): void {
  }

  onClickTeam(data: CRMTeamDTO): any {
    if (this.paramsUrl?.teamId) {
      let uri = this.router.url.split("?")[0];
      let uriParams = `${uri}?teamId=${data.Id}&type=${this.type}`;
      this.router.navigateByUrl(uriParams);
    }
    this.crmService.onUpdateTeam(data);
  }

  onLoadMiniChat(event: any): void {
  }

  fetchLiveConversations(team: CRMTeamDTO): void {
    this.fbGraphService.api(`me/conversations?fields=id,link,participants,senders&access_token=${team.Facebook_PageToken}`)
      .subscribe((res :any) => {});
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
    // console.log('onChange: ', result);
  }

  setCheck(){
    this.isOpenCollapCheck = !this.isOpenCollapCheck;
  }

  setSort(){
    this.isSort = !this.isSort;
  }

  updateCheckedSet(id: string, checked: boolean): void {
    if (checked) {
        this.setOfCheckedId.add(id);
    } else {
        this.setOfCheckedId.delete(id);
    }
  }

  onItemChecked(id: string, checked: boolean): void {
    this.updateCheckedSet(id, checked);
    this.refreshCheckedStatus();
  }

  onAllChecked(value: TDSSafeAny): void {
    this.lstMatchingItem.forEach(item => this.updateCheckedSet(item.id, value.checked));
    this.refreshCheckedStatus();
  }

  refreshCheckedStatus(): void {
    this.checked = this.lstMatchingItem.every(item => this.setOfCheckedId.has(item.id));
    this.indeterminate = this.lstMatchingItem.some(item => this.setOfCheckedId.has(item.id)) && !this.checked;
  }

  onTabOrder(event: boolean) {
    event && (this.currentOrderTab = 1);
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
