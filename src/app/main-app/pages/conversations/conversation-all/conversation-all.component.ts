import { ModalSendMessageAllComponent } from './../components/modal-send-message-all/modal-send-message-all.component';
import { PrinterService } from 'src/app/main-app/services/printer.service';
import { TDSSafeAny, TDSModalService } from 'tmt-tang-ui';
import { AfterViewChecked, AfterViewInit, ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit, ViewChild, ViewContainerRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable, Subject } from 'rxjs';
import { finalize, takeUntil, map } from 'rxjs/operators';
import { ConversationMatchingItem, CRMMatchingMappingDTO } from 'src/app/main-app/dto/conversation-all/conversation-all.dto';
import { CRMTeamDTO } from 'src/app/main-app/dto/team/team.dto';
import { CRMTeamService } from 'src/app/main-app/services/crm-team.service';
import { ConversationDataFacade } from 'src/app/main-app/services/facades/conversation-data.facade';
import { FacebookGraphService } from 'src/app/main-app/services/facebook-graph.service';
import { TpageBaseComponent } from 'src/app/main-app/shared/tpage-base/tpage-base.component';
import { TDSHelperObject, TDSMessageService, TDSHelperArray, TDSHelperString } from 'tmt-tang-ui';
import { YiAutoScrollDirective } from 'src/app/main-app/shared/directives/yi-auto-scroll.directive';

@Component({
  selector: 'app-conversation-all',
  templateUrl: './conversation-all.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})

export class ConversationAllComponent extends TpageBaseComponent implements OnInit, AfterViewInit, AfterViewChecked, OnDestroy {

  @ViewChild(YiAutoScrollDirective) yiAutoScroll!: YiAutoScrollDirective;

  isLoading: boolean = false;
  dataSource$!: Observable<any> | undefined;
  lstMatchingItem!: ConversationMatchingItem[];
  destroy$ = new Subject();
  psid!: string;
  activeCvsItem!: ConversationMatchingItem;
  isFastSend: boolean = false;
  currentOrderCode!: string | undefined;
  checked: boolean = false;
  isOpenCollapCheck: boolean = false;
  isSort: boolean = false;
  indeterminate: boolean = false;
  setOfCheckedId = new Set<string>();
  filterValue: TDSSafeAny;
  queryFilter: TDSSafeAny;
  total: number = 0;
  isSearching: boolean = false;
  isRefresh: boolean = false;
  isProcessing:boolean = false;
  isNextData: boolean = false;

  currentOrderTab: number = 0;
  letters = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'];

  constructor(private message: TDSMessageService,
    private conversationDataFacade: ConversationDataFacade,
    public crmService: CRMTeamService,
    private fbGraphService: FacebookGraphService,
    public activatedRoute: ActivatedRoute,
    public router: Router,
    private cdRef : ChangeDetectorRef,
    private printerService: PrinterService,
    private modalService: TDSModalService,
    private viewContainerRef: ViewContainerRef) {
      super(crmService, activatedRoute, router);
  }

  ngAfterViewInit() {
    this.cdRef.detectChanges();
  }

  ngAfterViewChecked() {
    this.cdRef.detectChanges();
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
      this.isProcessing = true;

      dataSource$.pipe(takeUntil(this.destroy$))
        .pipe(finalize(() => { this.isProcessing = false }))
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
          } else {
            //TODO: trường hợp lọc hội thoại data rỗng res.items = 0
            this.validateData();
          }
          this.cdRef.detectChanges();
        }, error => {
          this.message.error('Load CRMMatching đã xảy ra lỗi');
          this.cdRef.detectChanges();
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

  trackByIndex(_: number, data: any): number {
    return data.psid;
  }

  nextData(event: any) {
    if(event) {
      if (this.isProcessing) {
        return;
      }

      this.isProcessing = true;
      if (this.queryFilter) {
        this.conversationDataFacade.nextDataWithQuery(this.currentTeam?.Facebook_PageId, this.type, this.queryFilter)
          .pipe(takeUntil(this.destroy$))
          .pipe(finalize(() => { this.isProcessing = false }))
          .subscribe(data => {
            if(data == false) {
              this.isProcessing = true;
              return;
            }
            if(TDSHelperArray.hasListValue(data?.items)) {
              this.lstMatchingItem = [...data.items];
            }
            this.cdRef.detectChanges();
          }, error => {
            this.cdRef.detectChanges();
          })
      } else {
        this.conversationDataFacade.nextData(this.currentTeam?.Facebook_PageId, this.type)
          .pipe(takeUntil(this.destroy$))
          .pipe(finalize(() => this.isProcessing = false))
          .subscribe(data => {
            if(data == false) {
              this.isProcessing = true;
              return;
            }
            if(TDSHelperArray.hasListValue(data?.items)) {
              this.lstMatchingItem = [...data.items];
            }
            this.cdRef.detectChanges();
          }, error => {
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
    if(ev){
      this.isRefresh = true
      this.onSubmitFilter({});
    }
  }

  onLoadMiniChat(event: any): void {}

  fetchLiveConversations(team: CRMTeamDTO): void {
    this.fbGraphService.api(`me/conversations?fields=id,link,participants,senders&access_token=${team.Facebook_PageToken}`)
      .subscribe((res :any) => {});
  }

  changeOrderId(orderCode: string | undefined) {
    this.currentOrderCode = orderCode;
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
    let user_ids = "";
    lstCheck.forEach((x,i)=>{
      if(i == lstCheck.length - 1) {
        user_ids += x.toString();
      }
      else {
        user_ids += x.toString() + ",";
      }
    })
    if(lstCheck.length > 0) {
      this.printerService.printUrl(`/fastsaleorder/PrintCRMMatching?pageId=${this.currentTeam.Facebook_PageId}&psids=${user_ids.toString()}`)
      .pipe(takeUntil(this.destroy$), finalize(()=>this.isProcessing = false)).subscribe((res: TDSSafeAny) => {
        that.printerService.printHtml(res);
    })}
  }

  showModalSendMessage(){
    if(this.setOfCheckedId.size < 1){
      this.message.error('Vui lòng chọn tối thiểu 1 dòng!');
      return;
    }
    const modal = this.modalService.create({
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
    modal.afterClose.subscribe(result => {
      if (TDSHelperObject.hasValue(result)) {
      }
    });
  }

  onTabOrder(event: boolean) {
    event && (this.currentOrderTab = 1);
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
      this.dataSource$ = this.conversationDataFacade.makeDataSource(this.currentTeam.Facebook_PageId, this.type);
    } else {
      this.dataSource$ = this.conversationDataFacade.makeDataSourceWithQuery(this.currentTeam.Facebook_PageId, this.type, queryObj).pipe(map((res => {
        if (res && res.items) {
          this.total = res.items.length;
        }

        return res;
      })));
    }
    if(this.dataSource$){
        this.isSearching = false;
        !TDSHelperString.hasValueString(this.queryFilter) ? (this.isRefresh = true) : (this.isRefresh = false);
        this.loadConversations(this.dataSource$);
    }
    this.cdRef.detectChanges();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
