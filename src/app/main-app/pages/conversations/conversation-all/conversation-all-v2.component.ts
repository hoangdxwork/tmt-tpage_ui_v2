import { ChatomniTagsEventEmitterDto } from './../../../dto/conversation-all/chatomni/chatomni-conversation';
import { ChatomniEventEmiterService } from '@app/app-constants/chatomni-event/chatomni-event-emiter.service';
import { FacebookRESTService } from '../../../services/facebook-rest.service';
import { ModalSendMessageAllComponent } from '../components/modal-send-message-all/modal-send-message-all.component';
import { PrinterService } from 'src/app/main-app/services/printer.service';
import { AfterViewInit, ChangeDetectorRef, Component, ElementRef, HostBinding, NgZone, OnDestroy, OnInit, TemplateRef, ViewChild, ViewContainerRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { fromEvent, Observable, Subject } from 'rxjs';
import { finalize, takeUntil, map, debounceTime, distinctUntilChanged, shareReplay } from 'rxjs/operators';
import { StateChatbot } from 'src/app/main-app/dto/conversation-all/conversation-all.dto';
import { CRMTeamDTO } from 'src/app/main-app/dto/team/team.dto';
import { CRMTeamService } from 'src/app/main-app/services/crm-team.service';
import { ConversationDataFacade } from 'src/app/main-app/services/facades/conversation-data.facade';
import { FacebookGraphService } from 'src/app/main-app/services/facebook-graph.service';
import { TpageBaseComponent } from 'src/app/main-app/shared/tpage-base/tpage-base.component';
import { YiAutoScrollDirective } from 'src/app/main-app/shared/directives/yi-auto-scroll.directive';
import { eventFadeStateTrigger, eventCollapTrigger } from 'src/app/main-app/shared/helper/event-animations.helper';
import { TDSHelperArray, TDSHelperObject, TDSHelperString, TDSSafeAny } from 'tds-ui/shared/utility';
import { TDSMessageService } from 'tds-ui/message';
import { TDSModalService, TDSModalRef } from 'tds-ui/modal';
import { ConversationOrderFacade } from 'src/app/main-app/services/facades/conversation-order.facade';
import { OnChatBotSignalRModel, TypeOnChatBot } from 'src/app/main-app/dto/event-signalR/on-chatbot-signalR.dto';
import { SignalRConnectionService } from 'src/app/main-app/services/signalR/signalR-connection.service';
import { TDSNotificationRef, TDSNotificationService } from 'tds-ui/notification';
import { ChatomniMessageFacade } from 'src/app/main-app/services/chatomni-facade/chatomni-message.facade';
import { CrmMatchingV2Service } from 'src/app/main-app/services/matching-v2-service/crm-matching-v2.service';
import { ChatomniMessageService } from 'src/app/main-app/services/chatomni-service/chatomni-message.service';
import { ChatomniConversationService } from 'src/app/main-app/services/chatomni-service/chatomni-conversation.service';
import { ChatomniConversationDto, ChatomniConversationItemDto, ChatomniConversationTagDto } from 'src/app/main-app/dto/conversation-all/chatomni/chatomni-conversation';
import { TDSDestroyService } from 'tds-ui/core/services';

@Component({
  selector: 'app-conversation-all-v2',
  templateUrl: './conversation-all-v2.component.html',
  animations: [eventFadeStateTrigger, eventCollapTrigger],
  providers: [ TDSDestroyService ]
})

export class ConversationAllV2Component extends TpageBaseComponent implements OnInit, AfterViewInit {

  @ViewChild(YiAutoScrollDirective) yiAutoScroll!: YiAutoScrollDirective;

  @HostBinding("@eventFadeState") eventAnimation = true;
  @HostBinding("@openCollapse") eventAnimationCollap = false;
  @ViewChild('conversationSearchInput') innerText!: ElementRef;
  @ViewChild('templateAdminTransferChatBot') templateAdminTransferChatBot!: TemplateRef<{}>;
  @ViewChild('templateChatbotTranserAdmin') templateChatbotTranserAdmin!: TemplateRef<{}>;
  @ViewChild('templateNotificationMessNew') templateNotificationMessNew!: TemplateRef<{}>;

  isLoading: boolean = false;
  dataSource$?: Observable<ChatomniConversationDto> ;
  lstOmcs: ChatomniConversationItemDto[] = [];

  csid!: string;
  omcs_Item!: ChatomniConversationItemDto | undefined;

  isFastSend: boolean = false;
  checked: boolean = false;
  isOpenCollapCheck: boolean = false;
  isSort: boolean = false;
  indeterminate: boolean = false;
  setOfCheckedId = new Set<string>();
  queryFilter: TDSSafeAny;
  total: number = 0;
  isRefresh: boolean = false;
  isRefreshing: boolean = false;
  isProcessing:boolean = false;
  isChanged: boolean = false;
  clickReload: number = 0;
  isCheckedAll: boolean = false;
  cacheChatbot: OnChatBotSignalRModel[] = [];
  orderCode: any;

  tagsChange!: ChatomniConversationTagDto[];
  currentOrderTab: number = 0;
  letters = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'];

  private notificationRef!: TDSNotificationRef;

  constructor(private message: TDSMessageService,
    private conversationDataFacade: ConversationDataFacade,
    public crmService: CRMTeamService,
    private fbGraphService: FacebookGraphService,
    public activatedRoute: ActivatedRoute,
    public router: Router,
    private chatomniMessageService: ChatomniMessageService,
    private chatomniConversationService: ChatomniConversationService,
    private ngZone: NgZone,
    private notification: TDSNotificationService,
    private conversationOrderFacade: ConversationOrderFacade,
    private cdRef : ChangeDetectorRef,
    private printerService: PrinterService,
    private chatomniMessageFacade: ChatomniMessageFacade,
    private modalService: TDSModalService,
    private crmMatchingV2Service: CrmMatchingV2Service,
    private viewContainerRef: ViewContainerRef,
    private sgRConnectionService: SignalRConnectionService,
    private facebookRESTService: FacebookRESTService,
    private destroy$: TDSDestroyService,
    private chatomniEventEmiterService: ChatomniEventEmiterService) {
      super(crmService, activatedRoute, router);
  }

  ngOnInit(): void {
    // TODO: change team tds header
    this.crmService.changeTeamFromLayout$.pipe(takeUntil(this.destroy$)).subscribe((team) => {
        this.onClickTeam(team);
    })

    // TODO: change team in component
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

      let exist = (TDSHelperString.isString(this.omcs_Item?.ConversationId) != TDSHelperString.isString(this.paramsUrl?.csid))
        || (!TDSHelperString.isString(this.omcs_Item?.ConversationId) && !TDSHelperString.isString(this.paramsUrl?.csid));

      if(exist){
          this.onChangeConversation(team);
      }
  
    })

    // TODO: gán mã code load từ Tab Order
    this.conversationOrderFacade.onPushLastOrderCode$.subscribe((code: any) => {
        this.orderCode = code;
    })

    this.hubEvents(); // các sự kiện realtime
    this.notificationMessNew(); // thông báo tin nhắn mới
    this.spinLoading();

    this.eventEmitter();
  }

  eventEmitter() {
    this.chatomniEventEmiterService.tag_ConversationEmiter$.subscribe((res: ChatomniTagsEventEmitterDto)=>{
      if(res){
        let index = this.lstOmcs.findIndex(x=> x.ConversationId == res.ConversationId)
        this.lstOmcs[index].Tags = [...res.Tags];
        this.lstOmcs[index] = {...this.lstOmcs[index]}
      }
    })
  }

  spinLoading() {
    // loading moused khi change, đợi phản hồi từ loadMessages trong shared-tds-conversations
    // this.chatomniMessageService.spinningLoadMessage$.pipe(takeUntil(this.destroy$)).subscribe((obs: boolean) => {
    //   if(obs) {
    //       this.isChanged = obs;
    //       this.cdRef.markForCheck();
    //   }
    // })
  }

  onChangeConversation(team: any, queryObj?: any) {
    this.validateData();
    // Sử dụng ngZone chạy bất đồng bộ dữ liệu
    this.ngZone.run(() => {
        this.dataSource$ = this.chatomniConversationService.makeDataSource(team.Id, this.type, queryObj);
    })

    if(this.dataSource$) {
        this.loadConversations(this.dataSource$);
    }
  }

  validateData() {
    this.lstOmcs = [];
    delete this.omcs_Item;
    delete this.dataSource$;
  }

  loadConversations(dataSource$: Observable<ChatomniConversationDto>) {
    if(this.isChanged || this.isProcessing){
        return;
    }

    this.isProcessing = true;
    dataSource$.pipe(takeUntil(this.destroy$)).subscribe((res: ChatomniConversationDto) => {

        if (res && TDSHelperArray.hasListValue(res.Items)) {
            this.lstOmcs = [...res.Items];
            let csid = this.paramsUrl?.csid || null;

            //TODO: check psid khi load lần 2,3,4...
            let exits = this.lstOmcs.filter(x => x.ConversationId == csid)[0] ;
            if (exits) {
                this.setCurrentConversationItem(exits);
            } else {
                //TODO: load lần đầu tiên
                this.setCurrentConversationItem(this.lstOmcs[0]);
            }

        } else {
            //TODO: trường hợp lọc hội thoại data rỗng res.items = 0
            this.validateData();
        }

        this.isProcessing = false;
      })
  }

  //TODO: matching đang chọn active
  setCurrentConversationItem(item: ChatomniConversationItemDto) {
    if (TDSHelperObject.hasValue(item)) {

      if (this.isFastSend == true) {
          this.conversationDataFacade.checkSendMessage(this.currentTeam!.ChannelId, this.type, item.ConversationId);
      }
      else {
          //TODO: lần đầu tiên sẽ lấy items[0] từ danh sách matching và gán lại psid vào params
          this.omcs_Item = {...item};
          this.csid = item.ConversationId;

          let uri = this.router.url.split("?")[0];
          let uriParams = `${uri}?teamId=${this.currentTeam?.Id}&type=${this.type}&csid=${item?.ConversationId}`;
          this.router.navigateByUrl(uriParams);
      }
    }
  }

  changeCurrentCvsItem(item: ChatomniConversationItemDto) {
    if(this.isOpenCollapCheck){
        this.updateCheckedSet(item.Id, !this.setOfCheckedId.has(item.Id))
        this.refreshCheckedStatus();
        return;
    }

    // if (this.isChanged || this.isProcessing) {
    //   return;
    // }

    // this.isChanged = true;
    delete this.omcs_Item;

    this.setCurrentConversationItem(item);
    this.cdRef.detectChanges();
  }

  trackByIndex(_: number, data: any): number {
    return data.Id;
  }

  nextData(event: any): any {
    if(event) {
      if (this.isProcessing) {
          return false;
      }

      this.isProcessing = true;
      this.ngZone.run(() => {
          this.dataSource$ = this.chatomniConversationService.nextDataSource(this.currentTeam!.Id, this.type, this.queryFilter);
      })

      this.dataSource$?.pipe(takeUntil(this.destroy$)).subscribe((res: ChatomniConversationDto) => {

          if(TDSHelperArray.hasListValue(res?.Items)) {
              this.lstOmcs = [...res.Items];
          }

          this.isProcessing = false;
      }, error => {
          this.isProcessing = false;
      })
    }
  }

  onClickTeam(data: any): any {
    if (this.paramsUrl?.teamId) {
        let uri = this.router.url.split("?")[0];
        let uriParams = `${uri}?teamId=${data.Id}&type=${this.type}`;
        this.router.navigateByUrl(uriParams);
    }

    this.crmService.onUpdateTeam(data);
  }

  onRefresh(ev: boolean){
    this.clickReload += 1;

    if (this.clickReload >= 5) {
        this.message.info("Đã kích hoạt cập nhật hội thoại.");
        this.clickReload = 0;

        if (this.currentTeam) {
          this.facebookRESTService.rescan(this.currentTeam.ChannelId, 2)
            .pipe(takeUntil(this.destroy$)).subscribe(res => {
              console.log("Yêu cầu cập nhật thành công.");
          }, error => {
              console.log("Yêu cầu cập nhật thất bại.");
          });
        }
    } else {
        this.onSubmitFilter({});
    }

    setTimeout(() => {
      this.clickReload = 0;
    }, 3 * 1000);
  }

  fetchLiveConversations(team: CRMTeamDTO): void {
    this.fbGraphService.api(`me/conversations?fields=id,link,participants,senders&access_token=${team.Facebook_PageToken}`).subscribe();
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
    this.lstOmcs.forEach(x => this.updateCheckedSet(x.ConversationId, value.checked));

    this.refreshCheckedStatus();
    this.isCheckedAll = !this.isCheckedAll;
  }

  refreshCheckedStatus(): void {
    this.checked = this.lstOmcs.every(x => this.setOfCheckedId.has(x.ConversationId));
    this.indeterminate = this.lstOmcs.some(x => this.setOfCheckedId.has(x.ConversationId)) && !this.checked;
  }

  printData(){
    let lstCheck = [...this.setOfCheckedId]
    let that = this;

    if (this.isProcessing) {
      return
    }

    if(lstCheck.length < 1){
      this.message.error('Vui lòng chọn tối thiểu 1 dòng!');
      return;
    }

    this.isProcessing = true
    let userIds = "";

    lstCheck.forEach((x,i) => {
        if(i == lstCheck.length - 1) {
            userIds += x.toString();
        } else {
            userIds += x.toString() + ",";
        }
    })
    if(lstCheck.length > 0) {
        this.printerService.printUrl(`/fastsaleorder/PrintCRMMatching?pageId=${this.currentTeam!.ChannelId}&psids=${userIds.toString()}`)
        .pipe(takeUntil(this.destroy$), finalize(() => this.isProcessing = false)).subscribe((res: TDSSafeAny) => {
            that.printerService.printHtml(res);
    })}
  }

  showModalSendMessage(){
    if(this.setOfCheckedId.size < 1){
        this.message.error('Vui lòng chọn tối thiểu 1 dòng!');
        return;
    }

    let modal =  this.modalService.create({
        title: 'Gửi tin nhắn nhanh',
        content: ModalSendMessageAllComponent,
        size: "md",
        viewContainerRef: this.viewContainerRef,
        componentParams: {
            setOfCheckedId: this.setOfCheckedId,
            team: this.currentTeam as any,
            type: this.type
        }
    });

    modal.afterClose.subscribe((res: any) => {
        if(res) {
            this.onSentSucceed();
        }
    })
  }

  onSentSucceed() {
    this.conversationDataFacade.checkAllSendMessage(this.currentTeam!.ChannelId, this.type, this.isCheckedAll);
  }

  onSubmitFilter(data: any) {

    if (Object.keys(data || {}).length > 0) {
      let queryObj = this.conversationDataFacade.setExtrasQuery(this.currentTeam!.ChannelId, this.type, data);
      this.queryFilter = queryObj;

      this.makeDataSource(queryObj);
    } else {
      this.total = -1;
      this.queryFilter = null;
      this.makeDataSource({});
    }
  }

  makeDataSource(queryObj: any) {
    if (Object.keys(queryObj || {}).length <= 4) {
      this.isRefreshing = true;

      this.dataSource$ = this.chatomniConversationService.makeDataSource(this.currentTeam!.Id, this.type)
          .pipe(takeUntil(this.destroy$), finalize(() => {
              setTimeout(() => {
                this.isRefreshing = false;
              }, 500 )}
          ));

    } else {

      this.dataSource$ = this.chatomniConversationService.makeDataSource(this.currentTeam!.Id,  queryObj).pipe(map((res => {
        if (res && res.Items) {
            this.total = res.Items.length;
        }
        return res;
      })))
    }

    if(this.dataSource$){
        !TDSHelperString.hasValueString(this.queryFilter) ? (this.isRefresh = true) : (this.isRefresh = false);
        this.loadConversations(this.dataSource$);
    }
  }

  ngAfterViewInit() {
    if(this.innerText?.nativeElement) {
      fromEvent(this.innerText?.nativeElement, 'keyup').pipe(
        // get value
        map((event: any) => {
          return event.target.value;
        })
        , debounceTime(750) , distinctUntilChanged()
      ).subscribe((text: string) => {
        this.loadFilterText(text);
      })
    }
  }

  onSearch(event: any) {
      if(event) {
        let text = event.target.value;
        this.loadFilterText(text);
      }
      event.preventDefault();
      event.stopImmediatePropagation();
  }

  loadFilterText(text: string) {

      // let query = this.conversationDataFacade.createQuery(this.currentTeam.Facebook_PageId, this.type) as any;
      // query['keyword'] = text;
      // this.queryFilter = query;

      // this.makeDataSource(this.queryFilter);
  }

  hubEvents() {
    this.sgRConnectionService._onChatbotEvent$.pipe(takeUntil(this.destroy$)).subscribe((hubs: OnChatBotSignalRModel) => {
        if(hubs && hubs.data) {
            // TODO: nếu dữ liệu ko phải là conversation hiện tại
            let item = this.lstOmcs.filter(x => x.Id == hubs.data.pageId && x.ConversationId == hubs.data.psid)[0]; // x.Id  này để tạm
            // TODO: dữ liệu là conversation hiện tại truyền cho shared-tds-conversations
            let exits = this.omcs_Item?.Id == hubs.data.pageId && this.omcs_Item?.ConversationId == hubs.data.psid;

            let data = {
              team: {},
              psid: hubs.data.psid,
              message:  hubs.message,
            }

            switch (hubs.type) {
              case `${TypeOnChatBot.AdminTransferChatBot}`:
                  if(item) {
                    item.State = StateChatbot.Warning;
                  }
                  if(exits) {
                      this.omcs_Item!.State = StateChatbot.Warning;
                  }
                  // TODO: Lấy teamId của page
                  this.crmService.getActiveByPageIds$([hubs.data.pageId]).pipe(takeUntil(this.destroy$)).subscribe(res=>{
                    if(res){
                       data.team = res[0];
                    }
                    this.notification.template(this.templateAdminTransferChatBot, { data: data, placement: 'bottomLeft' });
                  }, err =>{
                    this.notification.template(this.templateAdminTransferChatBot, { data: data, placement: 'bottomLeft' });
                  })
                  // this.notification.warning('Chatbot gặp vấn đề' , `${hubs.message}`, { placement: 'bottomLeft' });
                break;

              case `${TypeOnChatBot.ChatbotTranserAdmin}`:
                  if(item) {
                    item.State = StateChatbot.Normal;
                  }

                  if(exits) {
                      this.omcs_Item!.State = StateChatbot.Normal;
                  }

                  this.crmService.getActiveByPageIds$([hubs.data.pageId]).pipe(takeUntil(this.destroy$)).subscribe(res=>{
                    if(res){
                      data.team = res[0];
                    }
                    this.notificationRef = this.notification.template(this.templateChatbotTranserAdmin, { data: data, placement: 'bottomLeft' });
                  }, err =>{
                    this.notificationRef = this.notification.template(this.templateChatbotTranserAdmin, { data: data, placement: 'bottomLeft' });
                  })
                break;

              default:
                break;
            }
       }
    })
  }

  getLink(team: TDSSafeAny, csid: string){
    if(TDSHelperObject.hasValue(team)){
      if(team.Id != this.currentTeam!.Id){
        this.crmService.changeTeamFromLayout$.emit(team);
        this.onChangeConversation(team);
      }
      let data = this.lstOmcs.find(x => x.ConversationId == csid)
      if(data){
        this.omcs_Item = data;
      }

      let uri = 'conversation/all';
      let uriParams = `${uri}?teamId=${team.Id}&type=all&psid=${csid}`;
      this.router.navigateByUrl(uriParams)
      this.notification.remove(this.notificationRef.messageId);
    }
  }

  notificationMessNew(){
    this.conversationDataFacade.notificationMessNew$.pipe(takeUntil(this.destroy$)).subscribe(res=>{
      if(res){
        this.notification.template(this.templateNotificationMessNew, { data: res, placement: 'bottomLeft' });
      }
    })
  }
}
