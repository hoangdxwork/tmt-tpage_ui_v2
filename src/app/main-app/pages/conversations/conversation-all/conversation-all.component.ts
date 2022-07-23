import { FacebookRESTService } from './../../../services/facebook-rest.service';
import { ModalSendMessageAllComponent } from './../components/modal-send-message-all/modal-send-message-all.component';
import { PrinterService } from 'src/app/main-app/services/printer.service';
import { AfterViewInit, ChangeDetectorRef, Component, ElementRef, HostBinding, NgZone, OnDestroy, OnInit, TemplateRef, ViewChild, ViewContainerRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { fromEvent, Observable, Subject } from 'rxjs';
import { finalize, takeUntil, map, debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { ConversationMatchingItem, CRMMatchingMappingDTO, CRMMatchingMappingDTO_v2, StateChatbot } from 'src/app/main-app/dto/conversation-all/conversation-all.dto';
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
import { TDSNotificationService } from 'tds-ui/notification';
import { CRMMatchingService } from 'src/app/main-app/services/crm-matching.service';
import { THelperCacheService } from 'src/app/lib';

@Component({
  selector: 'app-conversation-all',
  templateUrl: './conversation-all.component.html',
  animations: [eventFadeStateTrigger, eventCollapTrigger]
})

export class ConversationAllComponent extends TpageBaseComponent implements OnInit, AfterViewInit, OnDestroy {

  @ViewChild(YiAutoScrollDirective) yiAutoScroll!: YiAutoScrollDirective;

  @HostBinding("@eventFadeState") eventAnimation = true;
  @HostBinding("@openCollapse") eventAnimationCollap = false;
  @ViewChild('conversationSearchInput') innerText!: ElementRef;
  @ViewChild('templateAdminTransferChatBot') templateAdminTransferChatBot!: TemplateRef<{}>;
  @ViewChild('templateChatbotTranserAdmin') templateChatbotTranserAdmin!: TemplateRef<{}>;
  @ViewChild('templateNotificationMessNew') templateNotificationMessNew!: TemplateRef<{}>;

  isLoading: boolean = false;
  // dataSource$!: Observable<any>;
  dataSource_v2$!: Observable<CRMMatchingMappingDTO_v2>;
  lstMatchingItem!: ConversationMatchingItem[];
  psid!: string;
  currentConversationItem!: ConversationMatchingItem;
  isFastSend: boolean = false;
  checked: boolean = false;
  isOpenCollapCheck: boolean = false;
  isSort: boolean = false;
  indeterminate: boolean = false;
  setOfCheckedId = new Set<string>();
  filterValue: TDSSafeAny;
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

  currentOrderTab: number = 0;
  letters = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'];
  private destroy$ = new Subject<void>();

  constructor(private message: TDSMessageService,
    private conversationDataFacade: ConversationDataFacade,
    public crmService: CRMTeamService,
    private fbGraphService: FacebookGraphService,
    public activatedRoute: ActivatedRoute,
    public router: Router,
    private ngZone: NgZone,
    private notification: TDSNotificationService,
    private conversationOrderFacade: ConversationOrderFacade,
    private cdRef : ChangeDetectorRef,
    private printerService: PrinterService,
    private modalService: TDSModalService,
    private viewContainerRef: ViewContainerRef,
    private sgRConnectionService: SignalRConnectionService,
    private facebookRESTService: FacebookRESTService) {
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

      let exist = (TDSHelperString.isString(this.currentConversationItem?.psid) != TDSHelperString.isString(this.paramsUrl?.psid))
        || (!TDSHelperString.isString(this.currentConversationItem?.psid) && !TDSHelperString.isString(this.paramsUrl?.psid));

      if(exist){
          this.onChangeConversation(team);
      }
    })

    // TODO: gán mã code load từ Tab Order
    this.conversationOrderFacade.onPushLastOrderCode$.subscribe((code: any) => {
        this.orderCode = code;
    })

    this.hubEvents(); // các sự kiện realtime
    this.spinLoading();
    this.notificationMessNew(); // thông báo tin nhắn mới
  }

  spinLoading() {
    // loading moused khi change, đợi phản hồi từ loadMessages trong shared-tds-conversations
    this.conversationDataFacade.onLoadTdsConversation$.pipe(takeUntil(this.destroy$)).subscribe((obs: boolean) => {
        if(obs == false) {
            this.isChanged = obs;
        }
    })
  }

  onChangeConversation(team: any) {
    this.validateData();

    // Sử dụng ngZone chạy bất đồng bộ dữ liệu
    this.ngZone.run(() => {
        // this.dataSource$ = this.conversationDataFacade.makeDataSource(team.Facebook_PageId, this.type);
        // this.loadConversations((this.dataSource$));

        this.dataSource_v2$ = this.conversationDataFacade.makeDataSource_v2(team.Facebook_PageId, this.type);
        this.loadConversations_v2((this.dataSource_v2$));
    })
  }

  validateData(){
    (this.currentConversationItem as any) = null;
    (this.dataSource_v2$ as any) = null;
    this.lstMatchingItem = [];
  }

  // loadConversations(dataSource$: Observable<any>) {
  //   if(this.isChanged || this.isProcessing){
  //     return;
  //   }

  //   this.isProcessing = true;
  //   dataSource$.pipe(takeUntil(this.destroy$), finalize(() => { this.isProcessing = false }))
  //     .subscribe((res: CRMMatchingMappingDTO) => {

  //       if (res && TDSHelperArray.hasListValue(res.items)) {
  //           this.lstMatchingItem = [...res.items];
  //           let psid = this.paramsUrl?.psid || null;

  //           //TODO: check psid khi load lần 2,3,4...
  //           let exits = this.lstMatchingItem.filter(x => x.psid == psid)[0];
  //           if (exits) {
  //             this.setCurrentConversationItem(exits);
  //           } else {
  //             //TODO: load lần đầu tiên
  //             this.setCurrentConversationItem(this.lstMatchingItem[0]);
  //           }

  //       } else {
  //         //TODO: trường hợp lọc hội thoại data rỗng res.items = 0
  //         this.validateData();
  //       }
  //     }, error => {
  //       this.message.error(`${error?.error?.message}` ? `${error?.error?.message}` : 'Load danh sách hội thoại đã xảy ra lỗi');
  //     })
  // }

  loadConversations_v2(dataSource_v2$: Observable<CRMMatchingMappingDTO_v2>) {
    if(this.isChanged || this.isProcessing){
      return;
    }

    this.isProcessing = true;
    dataSource_v2$.pipe(takeUntil(this.destroy$), finalize(() => { this.isProcessing = false }))
      .subscribe((res: CRMMatchingMappingDTO_v2) => {

        if (res && TDSHelperArray.hasListValue(res.items)) {
            this.lstMatchingItem = [...res.items];
            let psid = this.paramsUrl?.psid || null;

            //TODO: check psid khi load lần 2,3,4...
            let exits = this.lstMatchingItem.filter(x => x.psid == psid)[0];
            if (exits) {
              this.setCurrentConversationItem(exits);
            } else {
              //TODO: load lần đầu tiên
              this.setCurrentConversationItem(this.lstMatchingItem[0]);
            }

        } else {
          //TODO: trường hợp lọc hội thoại data rỗng res.items = 0
          this.validateData();
        }
      }, error => {
        this.message.error(`${error?.error?.message}` ? `${error?.error?.message}` : 'Load danh sách hội thoại đã xảy ra lỗi');
      })
  }

  //TODO: matching đang chọn active
  setCurrentConversationItem(item: ConversationMatchingItem) {
    if (TDSHelperObject.hasValue(item)) {

      if (this.isFastSend == true) {
          this.conversationDataFacade.checkSendMessage(item.page_id, this.type, item.psid);
      }

      else {
        //TODO: lần đầu tiên sẽ lấy items[0] từ danh sách matching và gán lại psid vào params
        this.currentConversationItem = {...item};
        this.psid = item.psid;

        let uri = this.router.url.split("?")[0];
        let uriParams = `${uri}?teamId=${this.currentTeam?.Id}&type=${this.type}&psid=${item?.psid}`;
        this.router.navigateByUrl(uriParams);
      }
    }
  }

  changeCurrentCvsItem(item: any) {
    if(this.isOpenCollapCheck){
        this.updateCheckedSet(item.id,!this.setOfCheckedId.has(item.id))
        this.refreshCheckedStatus();
        return;
    }

    if(item.psid == this.currentConversationItem.psid && item.page_id == this.currentConversationItem.page_id) {
      return;
    }
    if (this.isChanged || this.isProcessing) {
      return;
    }


    this.isChanged = true;
    (this.currentConversationItem as any) = null;

    this.setCurrentConversationItem(item);
    this.cdRef.detectChanges();
  }

  trackByIndex(_: number, data: any): number {
    return data.psid;
  }

  nextData(event: any) {
    if(event) {
      if (this.isProcessing || this.isChanged) {
        return;
      }

      this.isProcessing = true;
      if (this.queryFilter) {
        this.conversationDataFacade.nextDataWithQuery(this.currentTeam?.Facebook_PageId, this.type, this.queryFilter)
          .pipe(takeUntil(this.destroy$)).subscribe(data => {

              if(TDSHelperArray.hasListValue(data?.items)) {
                this.lstMatchingItem = [...data.items];
              }

              this.isProcessing = false;
              this.cdRef.detectChanges();
          })
      }
      else {
        this.conversationDataFacade.nextData_v2(this.currentTeam?.Facebook_PageId, this.type)
          .pipe(takeUntil(this.destroy$)).subscribe((data: CRMMatchingMappingDTO_v2) => {

              if(data && TDSHelperArray.hasListValue(data?.items)) {
                this.lstMatchingItem = [...data.items];
              }

              this.isProcessing = false;
              this.cdRef.detectChanges();
          })
      }
    }
  }

  onClickTeam(data: CRMTeamDTO): any {
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
        this.facebookRESTService.rescan(this.currentTeam.Facebook_PageId, 2)
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
    this.fbGraphService.api(`me/conversations?fields=id,link,participants,senders&access_token=${team.Facebook_PageToken}`)
      .subscribe();
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
    this.isCheckedAll = !this.isCheckedAll;
  }

  refreshCheckedStatus(): void {
    this.checked = this.lstMatchingItem.every(item => this.setOfCheckedId.has(item.id));
    this.indeterminate = this.lstMatchingItem.some(item => this.setOfCheckedId.has(item.id)) && !this.checked;
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
    lstCheck.forEach((x,i)=>{
      if(i == lstCheck.length - 1) {
        userIds += x.toString();
      }
      else {
        userIds += x.toString() + ",";
      }
    })
    if(lstCheck.length > 0) {
      this.printerService.printUrl(`/fastsaleorder/PrintCRMMatching?pageId=${this.currentTeam.Facebook_PageId}&psids=${userIds.toString()}`)
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
          team: this.currentTeam,
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
    this.conversationDataFacade.checkAllSendMessage(this.currentTeam.Facebook_PageId, this.type, this.isCheckedAll);
  }

  onSubmitFilter(data: any) {
    this.filterValue = data;

    if (Object.keys(data || {}).length > 0) {
      var queryObj = this.conversationDataFacade.setExtrasQuery(this.currentTeam.Facebook_PageId, this.type, data);
      this.queryFilter = queryObj;

      this.makeDataSource(queryObj);
    } else {
      this.total = -1;
      (this.queryFilter as any) = null;
      this.makeDataSource({});
    }
  }

  makeDataSource(queryObj: any) {
    (this.dataSource_v2$ as any) = null;

    if (Object.keys(queryObj || {}).length <= 4) {
      this.isRefreshing = true;
      this.dataSource_v2$ = this.conversationDataFacade.makeDataSource_v2(this.currentTeam.Facebook_PageId, this.type).pipe(takeUntil(this.destroy$), finalize(()=>{ setTimeout(() => {
        this.isRefreshing = false;
      }, 500)}));
    } else {
      this.dataSource_v2$ = this.conversationDataFacade.makeDataSourceWithQuery(this.currentTeam.Facebook_PageId, this.type, queryObj).pipe(map((res => {
        if (res && res.items) {
          this.total = res.items.length;
        }
        return res;
      })));
    }
    if(this.dataSource_v2$){
        !TDSHelperString.hasValueString(this.queryFilter) ? (this.isRefresh = true) : (this.isRefresh = false);
        this.loadConversations_v2(this.dataSource_v2$);
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
    if(TDSHelperString.hasValueString(text)) {
        let query = this.conversationDataFacade.createQuery(this.currentTeam.Facebook_PageId, this.type) as any;
        query['keyword'] = text;
        this.queryFilter = query;

        this.makeDataSource(query);
    } else {
        (this.innerText.nativeElement.value as any) = null;
        this.makeDataSource({});
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  hubEvents() {
    this.sgRConnectionService._onChatbotEvent$.pipe(takeUntil(this.destroy$)).subscribe((hubs: OnChatBotSignalRModel) => {
        if(hubs && hubs.data) {
            // TODO: nếu dữ liệu ko phải là conversation hiện tại
            let item = this.lstMatchingItem.filter(x => x.page_id == hubs.data.pageId && x.psid == hubs.data.psid)[0];
            // TODO: dữ liệu là conversation hiện tại truyền cho shared-tds-conversations
            let exits = this.currentConversationItem.page_id == hubs.data.pageId && this.currentConversationItem.psid == hubs.data.psid;

            let data = {
              team: {},
              psid: hubs.data.psid,
              message:  hubs.message,
            }

            switch (hubs.type) {
              case `${TypeOnChatBot.AdminTransferChatBot}`:
                  if(item) {
                    item.state = StateChatbot.Warning;
                  }
                  if(exits) {
                    this.currentConversationItem.state = StateChatbot.Warning;
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
                    item.state = StateChatbot.Normal;
                  }
                  if(exits) {
                    this.currentConversationItem.state = StateChatbot.Normal;
                  }
                  this.crmService.getActiveByPageIds$([hubs.data.pageId]).pipe(takeUntil(this.destroy$)).subscribe(res=>{
                    if(res){
                      data.team = res[0];
                    }
                    this.notification.template(this.templateChatbotTranserAdmin, { data: data, placement: 'bottomLeft' });
                  }, err =>{
                    this.notification.template(this.templateChatbotTranserAdmin, { data: data, placement: 'bottomLeft' });
                  })
                break;

              default:
                break;
            }
       }
    })
  }
  getLink(team: TDSSafeAny, psid: string){
    if(TDSHelperObject.hasValue(team)){
      if(team.Id != this.currentTeam.Id){
        this.crmService.changeTeamFromLayout$.emit(team);
        this.onChangeConversation(team);
      }
      let data = this.lstMatchingItem.find(x=> x.psid == psid)
      if(data){
        this.currentConversationItem = data;
      }

      let uri = 'conversation/all';
      let uriParams = `${uri}?teamId=${team.Id}&type=all&psid=${psid}`;
      this.router.navigateByUrl(uriParams)
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
