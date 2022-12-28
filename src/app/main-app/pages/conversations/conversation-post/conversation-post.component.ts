import { Object } from './../../../dto/conversation/make-activity.dto';
import { Child } from './../../../dto/team/all-facebook-child.dto';
import { ExtrasChildsDto } from './../../../dto/conversation-all/chatomni/chatomni-data.dto';
import { TiktokService } from './../../../services/tiktok-service/tiktok.service';
import { TDSNotificationService } from 'tds-ui/notification';
import { TDSResizeObserver } from 'tds-ui/core/resize-observers';
import { VirtualScrollerComponent } from 'ngx-virtual-scroller';
import { NgxVirtualScrollerDto } from './../../../dto/conversation-all/ngx-scroll/ngx-virtual-scroll.dto';

import { ObjectFacebookPostEvent } from './../../../handler-v2/conversation-post/object-facebook-post.event';
import { LiveCampaignService } from 'src/app/main-app/services/live-campaign.service';
import { TDSSafeAny } from 'tds-ui/shared/utility';
import { AfterViewInit, Component, ElementRef, OnInit, ViewChild, HostListener, ChangeDetectorRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { fromEvent, Observable } from 'rxjs';
import { debounceTime, distinctUntilChanged, map, takeUntil } from 'rxjs/operators';
import { CRMTeamDTO } from 'src/app/main-app/dto/team/team.dto';
import { ActivityMatchingService } from 'src/app/main-app/services/conversation/activity-matching.service';
import { CRMTeamService } from 'src/app/main-app/services/crm-team.service';
import { ConversationOrderFacade } from 'src/app/main-app/services/facades/conversation-order.facade';
import { FacebookGraphService } from 'src/app/main-app/services/facebook-graph.service';
import { FacebookPostService } from 'src/app/main-app/services/facebook-post.service';
import { TpageBaseComponent } from 'src/app/main-app/shared/tpage-base/tpage-base.component';
import { TDSMessageService } from 'tds-ui/message';
import { TDSHelperArray, TDSHelperObject, TDSHelperString } from 'tds-ui/shared/utility';
import { CRMTeamType } from 'src/app/main-app/dto/team/chatomni-channel.dto';
import { TDSDestroyService } from 'tds-ui/core/services';
import { ChatomniObjectService } from '@app/services/chatomni-service/chatomni-object.service';
import { ChatomniObjectsDto, ChatomniObjectsItemDto, MDB_Facebook_Mapping_PostDto } from '@app/dto/conversation-all/chatomni/chatomni-objects.dto';
import { ChangeTabConversationEnum } from '@app/dto/conversation-all/chatomni/change-tab.dto';
import { ChatomniConversationInfoDto } from '@app/dto/conversation-all/chatomni/chatomni-conversation-info.dto';
import { ConversationPostEvent } from '@app/handler-v2/conversation-post/conversation-post.event';
import { SocketEventSubjectDto, SocketOnEventService } from '@app/services/socket-io/socket-onevent.service';
import { ChatmoniSocketEventName } from '@app/services/socket-io/soketio-event';

@Component({
  selector: 'app-conversation-post',
  templateUrl: './conversation-post.component.html',
  providers: [ TDSDestroyService ]
})

export class ConversationPostComponent extends TpageBaseComponent implements OnInit, AfterViewInit {

  @ViewChild('innerText') innerText!: ElementRef;
  @ViewChild(VirtualScrollerComponent) virtualScroller!: VirtualScrollerComponent;
  @ViewChild('viewChildConvesationPost') viewChildConvesationPost!: ElementRef;

  isLoadingNextdata: boolean = false;

  public lstType: any[] = [
    { id: 'all', name: 'Tất cả bài viết' },
    { id: 'added_video', name: 'Video' },
    { id: 'added_photos', name: 'Hình ảnh' },
    { id: 'mobile_status_update', name: 'Trạng thái' },
    { id: 'published_story', name: 'Story đã đăng' },
    { id: 'shared_story', name: 'Story đã chia sẻ' }
  ];

  lstSort: any[] = [
    { id: 'ChannelCreatedTime desc', name: 'Ngày tạo mới nhất' },
    { id: 'ChannelCreatedTime asc', name: 'Ngày tạo cũ nhất' },
    { id: 'ChannelUpdatedTime desc', name: 'Ngày cập nhật mới nhất' },
    { id: 'ChannelUpdatedTime asc', name: 'Ngày cập nhật cũ nhất' }
  ];

  syncConversationInfo!: ChatomniConversationInfoDto | any;// TODO: chỉ dùng cho trường hợp đồng bộ dữ liệu partner + order

  currentType: any = { id: 'all', name: 'Tất cả bài viết' };
  currentSort: any = {};

  postChilds: TDSSafeAny[] = [];
  listBadge: any = {};

  keyFilter: string = '';
  currentPost?: ChatomniObjectsItemDto | any;
  isLoading: boolean = false;
  isLoadingTab: boolean = false;
  isProcessing: boolean = false;
  disableNextUrl: boolean = false;

  selectedIndex: number = 0;
  isDisableTabPartner: boolean = true;
  isDisableTabOrder: boolean = true;
  codeOrder!: string | null;

  dataSource$?: Observable<ChatomniObjectsDto> ;
  lstObjects!: ChatomniObjectsItemDto[];
  lstOfLiveCampaign: any[] = [];

  queryObj?: any = { type: "", sort: "", q: "" };
  isRefreshing: boolean = false;
  isFilter: boolean = false;
  currentObject?: ChatomniObjectsItemDto;
  partners$!: Observable<any>;

  widthConversation!: number;
  clickReload: number = 0;
  refreshTimer: TDSSafeAny;
  isLoadingUpdate: boolean = false;

  extrasChilds: { [id: string] : ExtrasChildsDto[] } = {};
  clickCurrentChild: string | any;

  constructor(private facebookPostService: FacebookPostService,
    private facebookGraphService: FacebookGraphService,
    private activityMatchingService: ActivityMatchingService,
    private liveCampaignService: LiveCampaignService,
    private message: TDSMessageService,
    public crmService: CRMTeamService,
    private postEvent: ConversationPostEvent,
    public activatedRoute: ActivatedRoute,
    private conversationOrderFacade: ConversationOrderFacade,
    public router: Router,
    private cdRef: ChangeDetectorRef,
    private chatomniObjectService: ChatomniObjectService,
    private destroy$: TDSDestroyService,
    private socketOnEventService: SocketOnEventService,
    private resizeObserver: TDSResizeObserver,
    private objectFacebookPostEvent: ObjectFacebookPostEvent,
    private notification: TDSNotificationService,
    private tiktokService: TiktokService,
    private route: ActivatedRoute) {
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
          if(team?.Id != this.currentTeam?.Id) {
              delete this.currentPost;
              this.fetchPosts(team);
              this.setCurrentTeam(team);
          }

          this.type = params?.params?.type;
          this.setParamsUrl(params.params);

          let exist = (TDSHelperString.isString(this.currentPost?.ObjectId) != TDSHelperString.isString(this.paramsUrl.post_id))
            || (!TDSHelperString.isString(this.currentPost?.ObjectId) && !TDSHelperString.isString(this.paramsUrl?.post_id));

          if(exist) {
              this.loadData();
              this.loadBadgeComments();
          }
      }
    });

    this.onChangeTabEvent();
    this.eventEmitter();
    this.loadLiveCampaign();
    this.spinLoading();
    this.onEventSocket();
  }

  eventEmitter() {
    this.objectFacebookPostEvent.changeUpdateLiveCampaignFromObject$.pipe(takeUntil(this.destroy$)).subscribe({
      next: (res: ChatomniObjectsItemDto) => {
        if(res && res.LiveCampaignId) {
            let index = this.lstObjects.findIndex(x => x.Id == res.Id);
            if(index >- 1) {
                this.lstObjects[index].LiveCampaignId = res.LiveCampaignId;
                this.lstObjects[index].LiveCampaign = {...res.LiveCampaign} as any;

                this.lstObjects[index] = {...this.lstObjects[index]};
                this.lstObjects = [...this.lstObjects]
            }

            if(this.currentPost && res.Id == this.currentPost?.Id) {
                this.currentPost.LiveCampaignId = res.LiveCampaignId;
                this.currentPost.LiveCampaign = { ...res.LiveCampaign }  as any;
            }
        }
      }
    })

    // TODO: sự kiện xóa chiến dịch live từ live-campaign-post
    this.objectFacebookPostEvent.changeDeleteLiveCampaignFromObject$.pipe(takeUntil(this.destroy$)).subscribe({
      next: (res: ChatomniObjectsItemDto) => {
          if(res && !res.LiveCampaignId) {
              let index = this.lstObjects.findIndex(x => x.Id == res.Id);
              if(index >- 1) {
                  delete this.lstObjects[index].LiveCampaignId;
                  delete this.lstObjects[index].LiveCampaign;

                  this.lstObjects[index] = {...this.lstObjects[index]};
              }

              if(this.currentPost && res.Id == this.currentPost?.Id) {
                  delete this.currentPost.LiveCampaignId;
                  delete this.currentPost.LiveCampaign;

                  this.currentPost = { ...this.currentPost};
              }
          }
      }
    })

    //TODO: Check có orderCode thì mở disable tab đơn hàng
    this.conversationOrderFacade.hasValueOrderCode$.pipe(takeUntil(this.destroy$)).subscribe({
      next: (code: any) => {
        if(TDSHelperString.hasValueString(code)){
            this.codeOrder = code;
            this.isDisableTabOrder = false;
        } else {
            this.codeOrder = '';
        }

        this.cdRef.detectChanges();
      }
    })

    // TODO: Cộng realtime bình luận bài viết
    this.postEvent.countRealtimeMessage$.pipe(takeUntil(this.destroy$)).subscribe({
      next: (res: boolean) => {

        let post_id = (this.route.snapshot.queryParams?.post_id || 0) as string;
        let index = this.lstObjects.findIndex(x => x.ObjectId == post_id);

        if(Number(index) >= 0) {
            this.lstObjects[index].CountComment += 1;
            this.lstObjects[index] = {...this.lstObjects[index]};

            this.postEvent.pushCountRealtimeToView$.emit(this.lstObjects[index]);
            this.cdRef.detectChanges();
        }
      }
    })
  }

  onEventSocket() {
    this.socketOnEventService.onEventSocket().pipe(takeUntil(this.destroy$)).subscribe({
      next: (res: SocketEventSubjectDto) => {
        switch(res && res.EventName){
            case ChatmoniSocketEventName.chatomniPostLiveEnd:
              let exist = this.currentTeam && this.currentTeam.Type == CRMTeamType._TShop && res.Data && res.Data.Data && res.Data.Data.ObjectId;

              if(exist) {
                let index = this.lstObjects.findIndex(x => x.ObjectId == res.Data.Data.ObjectId);
                if(Number(index) >- 1) {
                    this.lstObjects[index].StatusLive = 0;

                    this.lstObjects[index] = {...this.lstObjects[index]};
                    this.lstObjects = [...this.lstObjects];

                    this.notification.info('Thông báo live','Live stream đã kết thúc',  { placement: 'bottomLeft' });
                    this.cdRef.detectChanges();
                }
              }
            break;

            default: break;
        }
      }
    })
  }

  spinLoading() {
    this.postEvent.spinLoadingTab$.pipe(takeUntil(this.destroy$)).subscribe({
        next: (loading: boolean) => {
            this.isLoadingTab = loading;
        }
    })
  }

  //TODO: khi có comment mới vào bài viết
  loadBadgeComments() {
    this.activityMatchingService.onGetComment$.pipe(takeUntil(this.destroy$)).subscribe({
      next: (res: any) => {
        if(res){
            let post_id = res.object?.id;
            this.listBadge[post_id] = this.listBadge[post_id] || {};
            this.listBadge[post_id]["count"] = (this.listBadge[post_id]["count"] || 0) + 1;
        }
      }
    });
  }

  onChangeType(event: any) {
    if(event) {
      this.isFilter = true;
      this.disableNextUrl = false;

      this.currentType = this.lstType.find(x => x.id === event.id);
      if(this.currentType.id == 'all') {
        this.isFilter = false;
      }

      this.queryObj = this.onSetFilterObject();
      this.loadFilterDataSource();
    }
  }

  onChangeSort(event: any) {
    this.disableNextUrl = false;

    if(event) {
      if(this.currentSort && event.id == this.currentSort?.id) {
          delete this.currentSort;
      } else {
          this.currentSort = this.lstSort.find(x => x.id === event.id);
      }

      this.queryObj = this.onSetFilterObject();
      this.loadFilterDataSource();
    }
  }

  onSetFilterObject() {
    this.queryObj = {} as any;

    if(TDSHelperString.hasValueString(this.currentType?.id) && this.currentType?.id != 'all') {
        this.queryObj.type = this.currentType.id;
    } else {
        delete this.queryObj.type;
    }
    if(TDSHelperString.hasValueString(this.currentSort?.id)) {
        this.queryObj.sort = this.currentSort.id;
    } else {
        delete this.queryObj.sort;
    }

    if(TDSHelperString.hasValueString(this.keyFilter)) {
        this.queryObj.q = this.keyFilter;
    } else {
        delete this.queryObj.q;
    }

    return this.queryObj;
  }

  fetchPosts(team: any) {
    this.facebookPostService.fetchPosts(team?.Id).pipe(takeUntil(this.destroy$)).subscribe();
  }

  onRefresh(event: any) {
    this.clickReload += 1;
    this.destroyTimer();

    this.queryObj = {} as any;
    this.isRefreshing = true;
    this.innerText.nativeElement.value = '';
    this.disableNextUrl = false;
    this.isFilter = false;

    if(this.virtualScroller) {
      this.virtualScroller.refresh();
      this.virtualScroller.scrollToPosition(0);
    }

    let exist = (this.clickReload == 3) && this.currentTeam && this.currentTeam?.Type == CRMTeamType._UnofficialTikTok;
    if (exist) {
        let ownerId = this.currentTeam?.OwnerId as any;
        if(!TDSHelperString.hasValueString(ownerId)) {
            this.message.error('Không tìm thấy OwnerId, không thể kích hoạt cập nhật hội thoại');
            this.isRefreshing = false;
            return;
        }

        this.isLoadingUpdate = true;
        this.message.info("Đã kích hoạt cập nhật hội thoại");
        let mess = this.message.create('loading', `Đang cập nhật hội thoại`, { duration: 60000 });

        this.tiktokService.refreshListen(ownerId).pipe(takeUntil(this.destroy$)).subscribe({
          next: (res: any) => {
              this.clickReload = 0;
              this.isLoadingUpdate = false;

              this.message.remove(mess?.messageId);
              this.message.success('Yêu cầu cập nhật hội thoại thành công');
              this.loadData();
          },
          error: (error: any) => {
              this.clickReload = 0;
              this.isLoadingUpdate = false;

              this.message.remove(mess?.messageId);
              this.message.error(error?.error?.message || 'Yêu cầu cập nhật thất bại');
          }
        })
    } else {
        this.refreshTimer = setTimeout(() => {
          this.loadFilterDataSource();
        }, 350)
    }

    setTimeout(() => {
      this.clickReload = 0;
    }, 3 * 1000);
  }

  loadData(){
    if(this.isLoading) return;
    this.isLoading = true;
    this.validateData();

    this.dataSource$ = this.chatomniObjectService.makeDataSource(this.currentTeam!.Id);
    if(this.dataSource$) {
        this.loadObjects(this.dataSource$);
    }
  }

  loadObjects(dataSource$: Observable<ChatomniObjectsDto>) {
    dataSource$.pipe(takeUntil(this.destroy$)).subscribe({
      next: (res: ChatomniObjectsDto) => {
          if(res && res.Items) {
              this.lstObjects = [...res.Items];
              this.extrasChilds =  { ...res.Extras?.Childs}
              this.prepareParamsUrl();
          }

          setTimeout(() => {
              this.isRefreshing = false;
          }, 300);

          this.cdRef.detectChanges();
      },
      error: (error: any) => {
          this.isLoading = false;
          this.isRefreshing = false;
          this.message.error(`${error?.error?.message}` || 'Đã xảy ra lỗi');
      }
    })
  }

  prepareParamsUrl() {
    let currentObject: ChatomniObjectsItemDto;
    let params_postid: string;

    params_postid = this.paramsUrl?.post_id;
    if(!TDSHelperString.hasValueString(params_postid) || params_postid == "undefined") {
        params_postid = this.getSessionStoragePostId();
    }

    if(params_postid == null || params_postid == undefined) {
      currentObject = this.lstObjects[0];
      this.currentObject = currentObject;

      this.selectPost(currentObject);
      this.isLoading = false;
      return;
    }

    let index = this.lstObjects.findIndex(x => x.ObjectId == params_postid);
    if(Number(index) >= 0) {
        this.checkObject(Number(index));
        return;
    } else {
        params_postid = this.getSessionStoragePostId();
        let indexSession = this.lstObjects.findIndex(x => x.ObjectId == params_postid);
        
        if(Number(indexSession) >= 0) {
            this.checkObject(Number(indexSession));
            return;
        }
    }

    let teamId = this.currentTeam?.Id as number;
    if(!TDSHelperString.hasValueString(params_postid)) {
      this.message.error('Không tìm thấy ObjectId');
      return;
    }

    this.chatomniObjectService.getById(params_postid, teamId).pipe(takeUntil(this.destroy$)).subscribe({
      next: (res: ChatomniObjectsItemDto) => {
          currentObject = {...res};

          this.currentObject = currentObject;
          this.lstObjects = [...[currentObject], ...this.lstObjects];


          this.selectPost(currentObject);
          this.isLoading = false;
          this.cdRef.detectChanges();
      },
      error: (error: any) => {
          this.isLoading = false;

          currentObject = this.lstObjects[0];
          this.currentObject = currentObject;

          this.selectPost(currentObject);
          this.cdRef.detectChanges();
      }
    })
  }

  checkObject(index: number) {
    let currentObject = this.lstObjects[index];

      let exist = currentObject && currentObject?.ObjectId;
      if(exist) {
          this.currentObject = currentObject;
          this.selectPost(currentObject);
          this.isLoading = false;
      }
  }

  selectPost(item: ChatomniObjectsItemDto | any, type?: string): any {
    if(item && item.Data) {
        let exsit = this.currentPost && this.currentPost.ObjectId == item.ObjectId && !item.ParentId;
        if(exsit) {
            this.clickCurrentChild = TDSHelperString.hasValueString(this.clickCurrentChild) ? null: item.ObjectId;
            return;
        }

        this.currentPost = item;
        if(!item.ParentId && type == '_click') {
            this.setSessionStoragePostId(item.ObjectId);
            this.clickCurrentChild = item.ObjectId;
        }

        this.changeTab(0, true);
        this.codeOrder = null;

        let uri = this.router.url.split("?")[0];
        let uriParams = `${uri}?teamId=${this.currentTeam?.Id}&type=${this.type}&post_id=${item?.ObjectId}`;
        this.router.navigateByUrl(uriParams);
    }
  }

  nextData(event: any): any {
    if(event) {

      this.dataSource$ = this.chatomniObjectService.nextDataSource(this.currentTeam!.Id);
      this.dataSource$?.pipe(takeUntil(this.destroy$)).subscribe({

        next: (res: ChatomniObjectsDto) => {
            if(TDSHelperArray.hasListValue(res?.Items)) {
                this.lstObjects = [...(res.Items || [])];
                this.extrasChilds = {...(res.Extras?.Childs || {})}
            } else {
                this.disableNextUrl = true;
            }

            this.isLoadingNextdata = false;
            this.cdRef.detectChanges();
        },
        error: (error: any) => {
            this.isLoadingNextdata = false;
            this.cdRef.detectChanges();
        }
      })
    }
  }

  trackByIndex(_: number, data: any): number {
    return data.Id;
  }

  onClickTeam(data: CRMTeamDTO): any {
    if (this.paramsUrl?.teamId) {
      this.disableNextUrl = false;

      let uri = this.router.url.split("?")[0];
      let uriParams = `${uri}?teamId=${data.Id}&type=${this.type}`;
      this.router.navigateByUrl(uriParams);
    }

    this.crmService.onUpdateTeam(data);
  }

  getIconTypePost(type: string): any {
    if(!type){
        return "tdsi-paste-as-text-fill";
    } else if(type == "added_video") {
        return "tdsi-video-camera-fill";
    } else if(type == "added_photos") {
        return "tdsi-images-fill";
    } else {
        return "tdsi-page-line";
    }
  }

  onTabOrder(event: boolean) {
    this.selectedIndex = 2;
  }

  ngAfterViewInit() {
    fromEvent(this.innerText?.nativeElement, 'keyup').pipe(
      map((event: any) => {
        return event.target.value
      }),
      debounceTime(750),distinctUntilChanged()).subscribe({
        next: (text: string) => {
            this.isFilter = true;
            if(!TDSHelperString.hasValueString(text)) {
              this.isFilter = false;
            }

            this.disableNextUrl = false;
            let value = TDSHelperString.stripSpecialChars(text.trim());
            this.keyFilter = value;

            this.queryObj = {...this.onSetFilterObject()};
            this.loadFilterDataSource();
        }
      });

      this.resizeObserver.observe(this.viewChildConvesationPost)
      .subscribe(() => {
        if(this.viewChildConvesationPost && this.viewChildConvesationPost.nativeElement) {
          this.widthConversation = this.viewChildConvesationPost.nativeElement.clientWidth as number;
        }
      });
  }

  loadFilterDataSource() {
    this.lstObjects = [];
    this.chatomniObjectService.makeDataSource(this.currentTeam!.Id, this.queryObj).subscribe({
      next: (res: ChatomniObjectsDto) => {

          this.lstObjects  = [...res.Items];
          let currentObject = {} as any;
          let params_postid = this.getSessionStoragePostId();

          if(params_postid == null || params_postid == undefined) {
            currentObject = this.lstObjects[0];
            this.currentObject = currentObject;

            this.selectPost(currentObject);
            this.isLoading = false;
            this.isRefreshing = false;
            return;
          }

          let index = this.lstObjects.findIndex(x => x.ObjectId == params_postid);
          if(Number(index) < 0 && !this.isFilter) {
              let teamId = this.currentTeam?.Id as number;
              let objectId = params_postid;

              if(!TDSHelperString.hasValueString(objectId)) {
                  this.message.error('Không tìm thấy ObjectId');
                  return;
              }

              this.chatomniObjectService.getById(objectId, teamId).pipe(takeUntil(this.destroy$)).subscribe({
                next: (res: ChatomniObjectsItemDto) => {
                    currentObject = {...res};

                    let item = this.lstObjects.filter(x => x.ObjectId == objectId)[0];
                    if(item) return;

                    this.lstObjects = [...[currentObject], ...this.lstObjects];
                    this.isLoading = false;
                },
                error: (error: any) => {
                    this.isLoading = false;
                    this.message.error(error?.error?.message);
                }
              })
          } else {
              this.currentPost = this.lstObjects[index];
              this.setSessionStoragePostId(this.currentPost.ObjectId);
          }

          setTimeout(() => {
              this.isRefreshing = false;
          }, 300);
      },
      error: (error: any) => {
          setTimeout(() => {
             this.isRefreshing = false;
          }, 300);
          this.message.error(`${error?.error?.message}`);
      }
    })
  }

  validateData(){
    this.postChilds = [];
    this.lstObjects = [];
    this.isFilter = false;

    delete this.dataSource$;
    delete this.currentPost;
    delete this.syncConversationInfo;
    delete this.currentObject;
  }

  onChangeTabEvent() {
    this.conversationOrderFacade.onChangeTab$.pipe(takeUntil(this.destroy$)).subscribe({
      next: (res: any) => {
        if(res === ChangeTabConversationEnum.order) {
          this.changeTab(2, true);
          this.isDisableTabPartner = false;
          this.isDisableTabOrder = false;
        }

        else if(res === ChangeTabConversationEnum.partner) {
          this.changeTab(1, true);
          this.isDisableTabPartner = false;
        }
      }
    });
  }

  changeTab(tabIndex: number, isDisable: boolean) {
    this.selectedIndex = tabIndex;
    this.isDisableTabPartner = isDisable;
    this.isDisableTabOrder = isDisable;
  }

  loadLiveCampaign(text?: string) {
    this.liveCampaignService.getAvailables(text).pipe(takeUntil(this.destroy$)).subscribe({
      next: (res: any) => {
          delete res['@odata.context'];
          this.lstOfLiveCampaign = [...res.value];
      },
      error: (error: any) => {
          this.message.error(`${error?.error?.message}` || `Tải danh sách chiến dịch thật bại`);
      }
    })
  }

  setSessionStoragePostId(id: string): any {
    const _keyCache = this.chatomniObjectService._keycache_params_postid;
    sessionStorage.setItem(_keyCache, JSON.stringify(id));
  }

  getSessionStoragePostId(): any {
    const _keyCache = this.chatomniObjectService._keycache_params_postid;
    let item = sessionStorage.getItem(_keyCache) as any;

    if(item) {
        return JSON.parse(item);
    } else {
        return null;
    }
  }

  removeSessionStoragePostId() {
    const _keyCache = this.chatomniObjectService._keycache_params_postid;
    sessionStorage.removeItem(_keyCache);
  }

  vsEnd(event: NgxVirtualScrollerDto) {
    let exits = this.lstObjects && this.lstObjects.length > 0 && event && event.scrollStartPosition > 0;
    if(exits) {
      const vsEnd = Number(this.lstObjects.length - 1) == Number(event.endIndex) && !this.disableNextUrl as boolean;
      if(vsEnd) {

        if (this.isProcessing || this.isLoadingNextdata) {
            return;
        }

        this.isLoadingNextdata = true;
        setTimeout(() => {
            this.nextData(event);
        }, 350);
    }
    }
  }

  @HostListener('click', ['$event']) onClick(e: TDSSafeAny) {
    let className = JSON.stringify(e.target.className);
    if(className.includes('text-copyable')){
      if (e.target.className.indexOf('text-copyable') >= 0) {
        let selBox = document.createElement('textarea');
        selBox.style.position = 'fixed';
        selBox.style.left = '0';
        selBox.style.top = '0';
        selBox.style.opacity = '0';
        selBox.value = e.target.getAttribute('data-value') || e.target.innerHTML;

        if(selBox.value) {
          let phoneRegex = /(?:\b|[^0-9])((o|0|84|\+84)(\s?)([2-9]|1[0-9])((\d|o)(\s|\.)?){8})(?:\b|[^0-9])/g;

          let removeDots = selBox.value.toString().replace(/\./g, '');
          let removeSpace = removeDots.toString().replace(/\s/g, '');

          let exec = phoneRegex.exec(removeSpace);
          if(exec && exec[1]) {
              selBox.value = exec[1];
          }
        }

        document.body.appendChild(selBox);
        selBox.focus();
        selBox.select();
        document.execCommand('copy');
        document.body.removeChild(selBox);
        this.message.info('Đã copy số điện thoại');
      }
    }
  }

  destroyTimer() {
    if (this.refreshTimer) {
      clearTimeout(this.refreshTimer);
    }
  }
}
