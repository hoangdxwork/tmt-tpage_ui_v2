import { ChatmoniSocketEventName } from './../../../services/socket-io/soketio-event';
import { SocketOnEventService, SocketEventSubjectDto } from './../../../services/socket-io/socket-onevent.service';
import { SocketService } from '@app/services/socket-io/socket.service';
import { ChangeTabConversationEnum } from '@app/dto/conversation-all/chatomni/change-tab.dto';
import { ChatomniTagsEventEmitterDto, ChatomniLastMessageEventEmitterDto, ChatomniConversationMessageDto, QueryFilterConversationDto } from './../../../dto/conversation-all/chatomni/chatomni-conversation';
import { ChatomniEventEmiterService } from '@app/app-constants/chatomni-event/chatomni-event-emiter.service';
import { FacebookRESTService } from '../../../services/facebook-rest.service';
import { ModalSendMessageAllComponent } from '../components/modal-send-message-all/modal-send-message-all.component';
import { PrinterService } from 'src/app/main-app/services/printer.service';
import { AfterViewInit, ChangeDetectorRef, Component, ElementRef, HostBinding, NgZone, OnDestroy, OnInit, TemplateRef, ViewChild, ViewContainerRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { fromEvent, Observable } from 'rxjs';
import { finalize, takeUntil, map, debounceTime, distinctUntilChanged } from 'rxjs/operators';
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
import { TDSModalService } from 'tds-ui/modal';
import { ConversationOrderFacade } from 'src/app/main-app/services/facades/conversation-order.facade';
import { OnChatBotSignalRModel, TypeOnChatBot } from 'src/app/main-app/dto/event-signalR/on-chatbot-signalR.dto';
import { SignalRConnectionService } from 'src/app/main-app/services/signalR/signalR-connection.service';
import { TDSNotificationRef, TDSNotificationService } from 'tds-ui/notification';
import { ChatomniConversationService } from 'src/app/main-app/services/chatomni-service/chatomni-conversation.service';
import { ChatomniConversationDto, ChatomniConversationItemDto } from 'src/app/main-app/dto/conversation-all/chatomni/chatomni-conversation';
import { TDSDestroyService } from 'tds-ui/core/services';
import { ChatomniConversationInfoDto } from '@app/dto/conversation-all/chatomni/chatomni-conversation-info.dto';
import { ChatomniConversationFacade } from '@app/services/chatomni-facade/chatomni-conversation.facade';

@Component({
  selector: 'app-conversation-all',
  templateUrl: './conversation-all.component.html',
  animations: [eventFadeStateTrigger, eventCollapTrigger],
  providers: [ TDSDestroyService ]
})

export class ConversationAllComponent extends TpageBaseComponent implements OnInit, AfterViewInit {

  @ViewChild(YiAutoScrollDirective) yiAutoScroll!: YiAutoScrollDirective;

  @HostBinding("@eventFadeState") eventAnimation = true;
  @HostBinding("@openCollapse") eventAnimationCollap = false;
  @ViewChild('conversationSearchInput') innerText!: ElementRef;
  @ViewChild('templateAdminTransferChatBot') templateAdminTransferChatBot!: TemplateRef<{}>;
  @ViewChild('templateChatbotTranserAdmin') templateChatbotTranserAdmin!: TemplateRef<{}>;
  @ViewChild('templateNotificationMessNew') templateNotificationMessNew!: TemplateRef<{}>;

  isLoading: boolean = false;
  dataSource$?: Observable<ChatomniConversationDto> ;
  lstConversation: ChatomniConversationItemDto[] = [];

  csid!: string;
  conversationInfo!: ChatomniConversationInfoDto;
  conversationItem!: ChatomniConversationItemDto | any;

  syncConversationInfo!: ChatomniConversationInfoDto;// TODO: chỉ dùng cho trường hợp đồng bộ dữ liệu partner + order

  isFastSend: boolean = false;
  checked: boolean = false;
  isOpenCollapCheck: boolean = false;
  isSort: boolean = false;
  indeterminate: boolean = false;
  setOfCheckedId = new Set<string>();

  queryObj: QueryFilterConversationDto = {} as any;

  isRefreshing: boolean = false;
  isProcessing:boolean = false;
  clickReload: number = 0;
  isCheckedAll: boolean = false;
  checkCsidRouter: string = '';
  selectedIndex: number = 0;

  private notificationRef!: TDSNotificationRef;
  totalConversations: number = 0;

  constructor(private message: TDSMessageService,
    private conversationDataFacade: ConversationDataFacade,
    public crmService: CRMTeamService,
    private fbGraphService: FacebookGraphService,
    public activatedRoute: ActivatedRoute,
    public router: Router,
    private chatomniConversationService: ChatomniConversationService,
    private ngZone: NgZone,
    private notification: TDSNotificationService,
    private conversationOrderFacade: ConversationOrderFacade,
    private cdRef : ChangeDetectorRef,
    private printerService: PrinterService,
    private modalService: TDSModalService,
    private viewContainerRef: ViewContainerRef,
    private sgRConnectionService: SignalRConnectionService,
    private facebookRESTService: FacebookRESTService,
    private destroy$: TDSDestroyService,
    private chatomniConversationFacade: ChatomniConversationFacade,
    private chatomniEventEmiterService: ChatomniEventEmiterService,
    private socketService: SocketService,
    private socketOnEventService: SocketOnEventService) {
      super(crmService, activatedRoute, router);
  }

  ngOnInit(): void {
    // TODO: change team tds header
    this.crmService.changeTeamFromLayout$.pipe(takeUntil(this.destroy$)).subscribe({
      next: (team) => {
          this.onClickTeam(team);
      }
    })

    // TODO: change team in component
    this.loadQueryParamMap().pipe(takeUntil(this.destroy$)).subscribe({
      next: ([team, params]: any) => {
          if (!TDSHelperObject.hasValue(team)) {
              return this.onRedirect();
          }

          // TODO: change Team
          if(team.Id != this.currentTeam?.Id) {
              this.lstConversation = [];
              delete this.conversationItem;

              this.fetchLiveConversations(team);
              this.setCurrentTeam(team);
          }

          this.type = params?.params?.type;
          this.setParamsUrl(params.params);

          let exist = (TDSHelperString.isString(this.conversationItem?.ConversationId) != TDSHelperString.isString(this.paramsUrl?.csid))
            || (!TDSHelperString.isString(this.conversationItem?.ConversationId) && !TDSHelperString.isString(this.paramsUrl?.csid));

          if(exist){
              this.loadData(team);
          }

          this.checkCsidRouter = localStorage.getItem(this.chatomniConversationService._keyCheckCsidRouter) || '';
      }
    })

    this.hubEvents(); // các sự kiện realtime

    this.eventEmitter();
    this.onEventSocket();
  }

  onEventSocket(){
    this.socketOnEventService.onEventSocket().pipe(takeUntil(this.destroy$)).subscribe({
      next: (res: SocketEventSubjectDto) => {

        switch(res.EventName){

          case ChatmoniSocketEventName.chatomniOnMessage:
              if(res.Data && res.Data.Conversation && this.currentTeam?.ChannelId == res.Data.Conversation?.ChannelId) {

                  // TODO: mapping dữ liệu danh sách conversation
                  let index = this.lstConversation?.findIndex(x => x.ConversationId == res.Data.Conversation?.UserId) as number;
                  if(Number(index) >- 1) {

                      this.lstConversation[index].LatestMessage = {
                          CreatedTime: res.Data.Message?.CreatedTime,
                          Message: res.Data.Message?.Message,
                          MessageType: res.Data.Message?.MessageType,
                      } as any;

                      // TODO: gán lại mess nếu gửi hình
                      if(res.Data.Message?.Data?.attachments?.data){
                          this.lstConversation[index].LatestMessage!.Message = `Đã gửi ${res.Data.Message.Data.attachments.data?.length} hình ảnh` as string;
                      }

                      this.lstConversation[index].Message = res.Data.Message?.Message;

                      if(!res.Data.Message?.IsOwner){
                        this.lstConversation[index].CountUnread = (this.lstConversation[index].CountUnread || 0) + 1;
                      }
                      this.lstConversation[index] = {...this.lstConversation[index]};

                      // TODO: Check vị trí ConversationId và add vào đàu tiên
                      let model = {...this.lstConversation[index]};
                      if(index > 0){
                          this.lstConversation = this.lstConversation.filter(x => x.ConversationId != res.Data.Conversation?.UserId);
                          this.lstConversation = [...[model], ...(this.lstConversation || [])]
                      }
                  } else {
                      // TODO: socket message ko có trong danh sách -> push lên giá trị đầu tiên
                      let itemNewMess = this.chatomniConversationFacade.prepareCreateMessageOnEventSocket(res)
                      this.lstConversation = [...[itemNewMess], ...(this.lstConversation || [])]
                  }

                  // TODO: mapping dữ liệu khung chat hiện tại
                  let exist = this.conversationItem.ConversationId == res.Data.Conversation?.UserId;
                  if(exist) {
                      let item = {...this.chatomniConversationFacade.preapreMessageOnEventSocket(res.Data, this.conversationItem)};
                      this.chatomniEventEmiterService.onSocketDataSourceEmiter$.emit(item);
                  }

                  this.cdRef.detectChanges();
              }
            break;

            case ChatmoniSocketEventName.chatomniOnUpdate:
              break;

            case ChatmoniSocketEventName.onUpdate:
              break;

            default: break;
        }
      }
    })
  }

  eventEmitter() {
    // TODO: cập nhật tags
    this.chatomniEventEmiterService.tag_ConversationEmiter$.pipe(takeUntil(this.destroy$)).subscribe({
      next: (res: ChatomniTagsEventEmitterDto) => {
        if(res) {
            let index = this.lstConversation.findIndex(x=> x.ConversationId == res.ConversationId) as number;
            if(Number(index) >- 1) {
                this.lstConversation[index].Tags = [...res.Tags];
                this.lstConversation[index] = {...this.lstConversation[index]};

                this.cdRef.detectChanges();
            }
        }
      }
    })

    // TODO: Cập nhật hội thoại cuối cùng
    this.chatomniEventEmiterService.last_Message_ConversationEmiter$.pipe(takeUntil(this.destroy$)).subscribe({
      next: (res: ChatomniLastMessageEventEmitterDto) => {
        if(res) {
            let index = this.lstConversation.findIndex(x=> x.ConversationId == res.ConversationId) as number;
            if(Number(index) >- 1) {
                this.lstConversation[index].LatestMessage = {...res.LatestMessage} as ChatomniConversationMessageDto;
                this.lstConversation[index] = {...this.lstConversation[index]};

                this.cdRef.detectChanges();
            }
        }
      }
    })

    // TODO: Cập nhật đã xem tin nhắn
    this.chatomniEventEmiterService.countUnreadEmiter$.pipe(takeUntil(this.destroy$)).subscribe({
      next: (id: string) => {
        if(id) {
            let index = this.lstConversation.findIndex(x=> x.ConversationId == id) as number;
            if(Number(index) >- 1) {
              this.lstConversation[index].CountUnread = 0;
              this.lstConversation[index] = {...this.lstConversation[index]};
              this.cdRef.detectChanges();
            }
        }
      }
    })

    // TODO: Cập nhật Khi bật chatbot thành công
    this.chatomniEventEmiterService.chatbotStateEmiter$.pipe(takeUntil(this.destroy$)).subscribe({
      next: (id: string) => {
        if(id) {
            let index = this.lstConversation.findIndex(x=> x.ConversationId == id) as number;
            if(Number(index) >- 1) {
                this.lstConversation[index].State = 0;
                this.lstConversation[index] = {...this.lstConversation[index]};
                this.cdRef.detectChanges();
            }
        }
      }
    })

    // TODO: Chọn sản phẩm, nếu đang tab khách hàng chuyển sang đơn hàng
    this.conversationOrderFacade.onChangeTab$.pipe(takeUntil(this.destroy$)).subscribe({
      next: (res: string)=>{
        if(res === ChangeTabConversationEnum.order) {
            this.selectedIndex = 2;

            this.cdRef.detectChanges();
        }
      }
    })

    // TODO: sự kiên đồng bộ dữ liệu lưu khách hàng hoặc tạo đơn hàng hội thoại, ngOnChanges tự lấy sự kiện
    this.chatomniConversationFacade.onSyncConversationInfo$.pipe(takeUntil(this.destroy$)).subscribe({
      next: (res: any) => {
          let teamId = this.currentTeam?.Id as any;
          this.chatomniConversationService.syncConversationInfo(teamId, this.csid).pipe(takeUntil(this.destroy$)).subscribe({
              next: (data: any) => {
                  this.syncConversationInfo = {...data};
                  this.cdRef.markForCheck();
              }
          })
      }
    })
  }

  loadData(team: any) {
    this.validateData();

    this.dataSource$ = this.chatomniConversationService.makeDataSource(team.Id, this.type);
    if(this.dataSource$) {
        this.loadConversations(this.dataSource$);
    }
  }

  loadConversations(dataSource$: Observable<ChatomniConversationDto>) {
    if(this.isLoading || this.isProcessing){
        return;
    }

    this.isLoading = true;
    dataSource$.pipe(takeUntil(this.destroy$)).subscribe({
        next: (res: ChatomniConversationDto) => {
            if (res && TDSHelperArray.hasListValue(res.Items)) {

                this.lstConversation = [...res.Items];
                let csid = this.paramsUrl?.csid || null;

                //TODO: check psid khi load lần 2,3,4...
                let exits = this.lstConversation.filter(x => x.ConversationId == csid)[0] ;

                //TODO: kiểm tra khi chọn menu tin nhắn và bình luận, giữ item đang chọn
                let exitsTab = this.lstConversation.filter(x => x.ConversationId == this.checkCsidRouter)[0] ;
                if (exits || exitsTab) {
                    this.setCurrentConversationItem(exits || exitsTab);
                } else {
                    //TODO: load lần đầu tiên'
                    this.setCurrentConversationItem(this.lstConversation[0]);
                }

            } else {
                //TODO: trường hợp lọc hội thoại data rỗng res.items = 0
                this.validateData();
            }

            this.isLoading = false;
        },
        error: (error: any) => {
            this.isLoading = false;
            this.message.error(`${error?.error?.message}` || 'Đã xảy ra lỗi');
        }
    })
  }

  // TODO: matching đang chọn active
  // TODO: xử lý lấy thông tin partner + đơn hàng từ GetInfo()
  setCurrentConversationItem(item: ChatomniConversationItemDto) {
    if (TDSHelperObject.hasValue(item)) {

      if (this.isFastSend == true) {
          // Check lại trường hợp này
          // this.conversationDataFacade.checkSendMessage(this.currentTeam!.ChannelId, this.type, item.ConversationId);
      }
      else {
          //TODO: lần đầu tiên sẽ lấy items[0] từ danh sách matching và gán lại psid vào params
          this.conversationItem = {...item};
          this.csid = item.ConversationId;

          let uri = this.router.url.split("?")[0];
          let uriParams = `${uri}?teamId=${this.currentTeam?.Id}&type=${this.type}&csid=${item?.ConversationId}`;
          this.router.navigateByUrl(uriParams);
      }

      // TODO: gán thông tin cho conversation-partner, conversation-order
      if(this.currentTeam?.Id && item.ConversationId) {
          this.isLoading = true;
          this.chatomniConversationService.getInfo(this.currentTeam!.Id, item.ConversationId).pipe(takeUntil(this.destroy$)).subscribe({
              next: (info: ChatomniConversationInfoDto) => {
                  this.conversationInfo = {...info};
                  this.isLoading = false;
                  this.cdRef.markForCheck();
              },
              error: (error: any) => {
                  this.notification.error('Lỗi tải thông tin khách hàng', `${error?.error?.message}`);
                  this.isLoading = false;
                  this.cdRef.markForCheck();
              }
          })
      }

      // TODO: lưu lại item đang active để hiện thị tiếp ở message, inbox nếu trùng csid
      const _keyCache = this.chatomniConversationService._keyCheckCsidRouter;
      localStorage.setItem(_keyCache, item.ConversationId);
    }
  }

  changeCurrentConversationItem(item: ChatomniConversationItemDto) {
    if(item.ConversationId != this.conversationItem.ConversationId) {
        if(this.isOpenCollapCheck){
            this.updateCheckedSet(item.Id, !this.setOfCheckedId.has(item.Id))
            this.refreshCheckedStatus();

            return;
        }

        (this.conversationItem as any) = null;
        this.setCurrentConversationItem(item);
    }
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
      this.dataSource$ = this.chatomniConversationService.nextDataSource(this.currentTeam!.Id, this.type, this.lstConversation, this.queryObj);

      this.dataSource$?.pipe(takeUntil(this.destroy$)).subscribe({
        next: (res: ChatomniConversationDto) => {

          if(TDSHelperArray.hasListValue(res?.Items)) {
            res.Items.forEach((x) => {
                let idx = this.lstConversation.find(a => a.ConversationId == x.ConversationId);
                if(idx) {
                    res.Items = res.Items.filter(y => x.ConversationId != y.ConversationId)
                }
            });

        }

        this.lstConversation = [...this.lstConversation, ...(res.Items || [])];

            this.isProcessing = false;
            this.yiAutoScroll.scrollToElement('scrollConversation', 750);
        },
        error: (error) => {
            this.isProcessing = false;
        }
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

  onRefresh(event: boolean){
    this.clickReload += 1;

    if (this.clickReload >= 5) {
        this.message.info("Đã kích hoạt cập nhật hội thoại.");
        this.clickReload = 0;

        if (this.currentTeam) {
          this.facebookRESTService.rescan(this.currentTeam.ChannelId, 2).pipe(takeUntil(this.destroy$)).subscribe({
            next: (res) => {
                this.message.success('Yêu cầu cập nhật thành công');
            },
            error: (error) => {
                this.message.success('Yêu cầu cập nhật thất bại');
            }
          });
        }
    } else {
        this.queryObj = {} as any;
        this.innerText.nativeElement.value = '';

        this.isRefreshing = true;
        this.loadFilterDataSource();
        this.cdRef.markForCheck();
    }

    setTimeout(() => {
      this.clickReload = 0;
    }, 3 * 1000);
  }

  fetchLiveConversations(team: CRMTeamDTO): void {
    this.fbGraphService.api(`me/conversations?fields=id,link,participants,senders&access_token=${team.ChannelToken}`).subscribe();
  }

  setCheck(){
    this.isOpenCollapCheck = !this.isOpenCollapCheck;
  }

  setSort(){
    this.isSort = !this.isSort;
    if(this.isSort) {
      this.lstConversation = this.lstConversation?.sort((a: ChatomniConversationItemDto, b: ChatomniConversationItemDto) => Date.parse(a.UpdatedTime) - Date.parse(b.UpdatedTime));
    } else {
      this.lstConversation = this.lstConversation?.sort((a: ChatomniConversationItemDto, b: ChatomniConversationItemDto) => Date.parse(b.UpdatedTime) - Date.parse(a.UpdatedTime));
    }
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
    this.lstConversation.forEach(x => this.updateCheckedSet(x.ConversationId, value.checked));

    this.refreshCheckedStatus();
    this.isCheckedAll = !this.isCheckedAll;
  }

  refreshCheckedStatus(): void {
    this.checked = this.lstConversation.every(x => this.setOfCheckedId.has(x.ConversationId));
    this.indeterminate = this.lstConversation.some(x => this.setOfCheckedId.has(x.ConversationId)) && !this.checked;
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
          .pipe(takeUntil(this.destroy$), finalize(() => this.isProcessing = false)).subscribe({
              next: (res: TDSSafeAny) => {
                  that.printerService.printHtml(res);
              }
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
            type: this.type,
            lstConversation: this.lstConversation
        }
    });

    modal.afterClose.subscribe({
      next: (res: any) => {
        this.onSentSucceed();
      }
    })
  }

  onSentSucceed() {
    //check lại hàm này
    this.conversationDataFacade.checkAllSendMessage(this.currentTeam!.ChannelId, this.type, this.isCheckedAll);
  }

  onSubmitFilter(queryObj: QueryFilterConversationDto) {
    this.queryObj = queryObj;
    this.loadFilterDataSource();
  }

  ngAfterViewInit() {
    if(this.innerText?.nativeElement) {
      fromEvent(this.innerText?.nativeElement, 'keyup').pipe(

        map((event: any) => {
            return event.target.value;
        }) , debounceTime(750) , distinctUntilChanged()

      ).subscribe({
        next: (text: string) => {
            let value = TDSHelperString.stripSpecialChars(text.trim());
            this.queryObj['Keyword'] = value;
            this.loadFilterDataSource();
        }
      })
    }
  }

  onTabOderOutput(ev: boolean){
    this.selectedIndex = 1;
  }

  loadFilterDataSource() {
    this.isLoading = true;
    this.chatomniConversationService.makeDataSource(this.currentTeam!.Id, this.type, this.queryObj).pipe(takeUntil(this.destroy$)).subscribe({
      next: (res: ChatomniConversationDto) => {
          this.lstConversation = [...res?.Items];

          this.totalConversations = res?.Items.length;
          this.isLoading = false;
          this.isRefreshing = false;

          this.cdRef.markForCheck();
      },
      error: (error: any) => {
          this.isLoading = false;
          this.isRefreshing = false;
          this.message.error(`${error?.error?.message}`);
          this.cdRef.markForCheck();
      }
    })
  }

  hubEvents() {
    this.sgRConnectionService._onChatbotEvent$.pipe(takeUntil(this.destroy$)).subscribe((hubs: OnChatBotSignalRModel) => {
      if(hubs && hubs.data) {
          // TODO: nếu dữ liệu ko phải là conversation hiện tại
          let item = this.lstConversation.filter(x => x.Id == hubs.data.pageId && x.ConversationId == hubs.data.psid)[0]; // x.Id  này để tạm
          // TODO: dữ liệu là conversation hiện tại truyền cho shared-tds-conversations
          let exits = this.conversationItem?.Id == hubs.data.pageId && this.conversationItem?.ConversationId == hubs.data.psid;

          let data = {
            team: {},
            psid: hubs.data.psid,
            message:  hubs.message,
          }

          switch (hubs.type) {
            case `${TypeOnChatBot.AdminTransferChatBot}`:
                if(item) {
                  item.State = StateChatbot.SystemError;
                }
                if(exits) {
                    this.conversationItem!.State = StateChatbot.SystemError;
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
                    this.conversationItem!.State = StateChatbot.Normal;
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
            this.loadData(team);
        }

        let data = this.lstConversation.find(x => x.ConversationId == csid)
        if(data){
          this.conversationItem = data;
        }

        let uriParams = `conversation/all?teamId=${team.Id}&type=all&csid=${csid}`;

        this.router.navigateByUrl(uriParams)
        this.notification.remove(this.notificationRef.messageId);
    }
  }

  validateData() {
    this.lstConversation = [];
    (this.conversationInfo as any) = null;
    delete this.conversationItem;
    delete this.dataSource$;
  }
}
