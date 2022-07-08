import { FacebookRESTService } from './../../../services/facebook-rest.service';
import { ModalSendMessageAllComponent } from './../components/modal-send-message-all/modal-send-message-all.component';
import { PrinterService } from 'src/app/main-app/services/printer.service';
import { AfterViewInit, ChangeDetectorRef, Component, ElementRef, HostBinding, NgZone, OnDestroy, OnInit, ViewChild, ViewContainerRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { fromEvent, Observable, Subject } from 'rxjs';
import { finalize, takeUntil, map, debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { ConversationMatchingItem, CRMMatchingMappingDTO } from 'src/app/main-app/dto/conversation-all/conversation-all.dto';
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

  isLoading: boolean = false;
  dataSource$!: Observable<any>;
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
    private cdRef : ChangeDetectorRef,
    private printerService: PrinterService,
    private modalService: TDSModalService,
    private viewContainerRef: ViewContainerRef,
    private facebookRESTService: FacebookRESTService) {
      super(crmService, activatedRoute, router);
  }

  ngOnInit(): void {
    // TODO: change team tds header
    this.crmService.changeTeamFromLayout.pipe(takeUntil(this.destroy$)).subscribe((team) => {
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
    });

    this.spinLoading();
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
        this.dataSource$ = this.conversationDataFacade.makeDataSource(team.Facebook_PageId, this.type);
        this.loadConversations((this.dataSource$));
    })
  }

  validateData(){
    (this.currentConversationItem as any) = null;
    (this.dataSource$ as any) = null;
    this.lstMatchingItem = [];
  }

  loadConversations(dataSource$: Observable<any>) {
    if(this.isChanged || this.isProcessing){
      return;
    }

    this.isProcessing = true;
    dataSource$.pipe(takeUntil(this.destroy$), finalize(() => { this.isProcessing = false }))
      .subscribe((res: CRMMatchingMappingDTO) => {

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
          .pipe(takeUntil(this.destroy$)).pipe(finalize(() => { this.isProcessing = false; this.cdRef.detectChanges() }))
          .subscribe(data => {
              if(data == false) {
                this.isProcessing = true;
                return;
              }
              if(TDSHelperArray.hasListValue(data?.items)) {
                this.lstMatchingItem = [...data.items];
              }
          })
      } else {
        this.conversationDataFacade.nextData(this.currentTeam?.Facebook_PageId, this.type)
          .pipe(takeUntil(this.destroy$)).pipe(finalize(() => { this.isProcessing = false; this.cdRef.detectChanges() }))
          .subscribe(data => {
              if(data == false) {
                this.isProcessing = true;
                return;
              }
              if(TDSHelperArray.hasListValue(data?.items)) {
                this.lstMatchingItem = [...data.items];
              }
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
    (this.dataSource$ as any) = null;

    if (Object.keys(queryObj || {}).length <= 4) {
      this.isRefreshing = true;
      this.dataSource$ = this.conversationDataFacade.makeDataSource(this.currentTeam.Facebook_PageId, this.type).pipe(takeUntil(this.destroy$), finalize(()=>{ setTimeout(() => {
        this.isRefreshing = false;
      }, 500)}));
    } else {
      this.dataSource$ = this.conversationDataFacade.makeDataSourceWithQuery(this.currentTeam.Facebook_PageId, this.type, queryObj).pipe(map((res => {
        if (res && res.items) {
          this.total = res.items.length;
        }
        return res;
      })));
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
}
