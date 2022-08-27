import { LiveCampaign } from './../../../dto/facebook-post/facebook-post.dto';
import { ChatomniLiveCampaignDto } from './../../../dto/conversation-all/chatomni/chatomni-objects.dto';
import { FaceBookPostItemHandler } from './../../../handler-v2/conversation-post/facebook-post-item.handler';
import { ObjectFacebookPostEvent } from './../../../handler-v2/conversation-post/object-facebook-post.event';
import { LiveCampaignModel } from '@app/dto/live-campaign/odata-live-campaign-model.dto';
import { LiveCampaignService } from 'src/app/main-app/services/live-campaign.service';
import { ChatomniDataTShopPostDto } from '@app/dto/conversation-all/chatomni/chatomni-tshop-post.dto';
import { TDSSafeAny } from 'tds-ui/shared/utility';
import { AfterViewInit, ChangeDetectorRef, Component, ElementRef, NgZone, OnDestroy, OnInit, ViewChild, ViewContainerRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { BehaviorSubject, fromEvent, Observable, Subject, Subscription } from 'rxjs';
import { debounceTime, distinctUntilChanged, finalize, map, mergeMap, takeUntil, tap, throttleTime } from 'rxjs/operators';
import { CRMTeamDTO } from 'src/app/main-app/dto/team/team.dto';
import { ActivityMatchingService } from 'src/app/main-app/services/conversation/activity-matching.service';
import { CRMTeamService } from 'src/app/main-app/services/crm-team.service';
import { ConversationOrderFacade } from 'src/app/main-app/services/facades/conversation-order.facade';
import { ConversationPostFacade } from 'src/app/main-app/services/facades/conversation-post.facade';
import { FacebookGraphService } from 'src/app/main-app/services/facebook-graph.service';
import { FacebookPostService } from 'src/app/main-app/services/facebook-post.service';
import { TpageBaseComponent } from 'src/app/main-app/shared/tpage-base/tpage-base.component';
import { TDSMessageService } from 'tds-ui/message';
import { TDSHelperArray, TDSHelperObject, TDSHelperString } from 'tds-ui/shared/utility';
import { CRMTeamType } from 'src/app/main-app/dto/team/chatomni-channel.dto';
import { TDSDestroyService } from 'tds-ui/core/services';
import { ChatomniObjectService } from '@app/services/chatomni-service/chatomni-object.service';
import { ChatomniObjectsDto, ChatomniObjectsItemDto, MDB_Facebook_Mapping_PostDto } from '@app/dto/conversation-all/chatomni/chatomni-objects.dto';
import { YiAutoScrollDirective } from '@app/shared/directives/yi-auto-scroll.directive';
import { ChangeTabConversationEnum } from '@app/dto/conversation-all/chatomni/change-tab.dto';
import { ChatomniCommentFacade } from '@app/services/chatomni-facade/chatomni-comment.facade';

@Component({
  selector: 'app-conversation-post-v2',
  templateUrl: './conversation-post-v2.component.html',
  providers: [ TDSDestroyService ]
})

export class ConversationPostV2Component extends TpageBaseComponent implements OnInit, AfterViewInit {

  @ViewChild('innerText') innerText!: ElementRef;
  @ViewChild(YiAutoScrollDirective) yiAutoScroll!: YiAutoScrollDirective;

  public lstType: any[] = [
    { id: 'all', name: 'Tất cả bài viết' },
    { id: 'added_video', name: 'Video' },
    { id: 'added_photos', name: 'Hình ảnh' },
    { id: 'mobile_status_update', name: 'Status' },
    { id: 'published_story', name: 'Story đã đăng' },
    { id: 'shared_story', name: 'Story đã chia sẻ' }
  ];

  lstSort: any[] = [
    { id: 'ChannelCreatedTime desc', name: 'Ngày tạo mới nhất' },
    { id: 'ChannelCreatedTime asc', name: 'Ngày tạo cũ nhất' },
    { id: 'ChannelUpdatedTime desc', name: 'Ngày update mới nhất' },
    { id: 'ChannelUpdatedTime asc', name: 'Ngày update cũ nhất' }
  ];

  currentType: any = { id: 'all', name: 'Tất cả bài viết' };
  currentSort: any = {};

  postId: any;
  postChilds: TDSSafeAny[] = [];
  listBadge: any = {};
  lstOfLiveCampaign: LiveCampaignModel[] = [];

  keyFilter: string = '';
  currentPost?: ChatomniObjectsItemDto;
  isLoading: boolean = false;
  isProcessing: boolean = false;

  selectedIndex: number = 0;
  isDisableTabPartner: boolean = true;
  isDisableTabOrder: boolean = true;


  dataSource$?: Observable<ChatomniObjectsDto> ;
  lstObjects!: ChatomniObjectsItemDto[];

  queryObj?: any = { type!: "", sort!: "", q!: "" };
  isRefreshing: boolean = false;
  partners$!: Observable<any>;

  constructor(private facebookPostService: FacebookPostService,
    private conversationPostFacade: ConversationPostFacade,
    private facebookGraphService: FacebookGraphService,
    private activityMatchingService: ActivityMatchingService,
    private liveCampaignService: LiveCampaignService,
    private message: TDSMessageService,
    public crmService: CRMTeamService,
    public activatedRoute: ActivatedRoute,
    private ngZone: NgZone,
    private cdRef: ChangeDetectorRef,
    private conversationOrderFacade: ConversationOrderFacade,
    public router: Router,
    private chatomniCommentFacade: ChatomniCommentFacade,
    private chatomniObjectService: ChatomniObjectService,
    private destroy$: TDSDestroyService,
    private objectFacebookPostEvent: ObjectFacebookPostEvent) {
      super(crmService, activatedRoute, router);
  }

  ngOnInit(): void {
    //TODO: load danh sách chiến dịch
    this.loadAvailableCampaign();

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
              this.fetchPosts(team);
              this.setCurrentTeam(team);
          }

          this.type = params?.params?.type;
          this.setParamsUrl(params.params);

          if(TDSHelperString.isString(params?.params?.post_id)) {
              this.postId = params.params.post_id;
          }

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
  }

  eventEmitter() {
    // TODO: Cập nhật chiến lịch live từ object-facebook-post
    this.objectFacebookPostEvent.changeUpdateLiveCampaignFromObject$.pipe(takeUntil(this.destroy$)).subscribe({
      next: (res: ChatomniObjectsItemDto) => {
        if(res && res.LiveCampaignId) {
            let index = this.lstObjects.findIndex(x => x.Id == res.Id);
            if(index >- 1) {
                this.lstObjects[index].LiveCampaignId = res.LiveCampaignId;
                this.lstObjects[index].LiveCampaign = {...res.LiveCampaign};

                this.lstObjects[index] = {...this.lstObjects[index]};
            }

            if(this.currentPost && res.Id == this.currentPost?.Id) {
                this.currentPost.LiveCampaignId = res.LiveCampaignId;
                this.currentPost.LiveCampaign = { ...res.LiveCampaign };
            }
        }

        this.cdRef.markForCheck();
      }
    })

    // TODO: sự kiện xóa chiến dịch live từ live-campaign-post
    this.objectFacebookPostEvent.changeDeleteLiveCampaignFromObject$.pipe(takeUntil(this.destroy$)).subscribe({
      next: (res: ChatomniObjectsItemDto) => {
          if(res && !res.LiveCampaignId) {
              let index = this.lstObjects.findIndex(x => x.Id == res.Id);
              if(index >- 1) {
                  this.lstObjects[index].LiveCampaignId = null as any;
                  this.lstObjects[index].LiveCampaign = null as any;

                  this.lstObjects[index] = {...this.lstObjects[index]};
              }

              if(this.currentPost && res.Id == this.currentPost?.Id) {
                  this.currentPost.LiveCampaignId = null as any;
                  this.currentPost.LiveCampaign = null as any;

                  this.currentPost = { ...this.currentPost};
              }
          }

          this.cdRef.markForCheck();
      }
    })

    //TODO: Check có orderCode thì mở disable tab đơn hàng
    this.conversationOrderFacade.hasValueOrderCode$.pipe(takeUntil(this.destroy$)).subscribe({
      next: (res: any) => {
        if(TDSHelperString.hasValueString(res)){
          this.isDisableTabOrder = false;
        }
      }
    })
  }

  loadAvailableCampaign(){
    this.liveCampaignService.getAvailables().pipe(takeUntil(this.destroy$)).subscribe({
      next: (res: any) => {
          this.lstOfLiveCampaign = [...res.value];
      },
      error: (error: any) => {
          this.message.error(error?.error?.message || 'Không thể tải dữ liệu chiến dịch');
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

  onchangeType(event: any) {
    if(event) {
      this.currentType = this.lstType.find(x => x.id === event.id);

      this.queryObj = this.onSetFilterObject();
      this.loadFilterDataSource();
    }
  }

  onChangeSort(event: any) {
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
    this.queryObj = { } as any;
    this.isRefreshing = true;
    this.innerText.nativeElement.value = '';

    this.loadFilterDataSource();
  }

  loadData(){
    this.isLoading = true;
    this.validateData();

    this.dataSource$ = this.chatomniObjectService.makeDataSource(this.currentTeam!.Id);
    if(this.dataSource$) {
        this.loadObjects(this.dataSource$);
    }

    // TODO: check lại trường hợp tshop
    this.facebookGraphService.getFeed(this.currentTeam!.ChannelToken).pipe(takeUntil(this.destroy$)).subscribe((res: any) => {
        if (TDSHelperArray.hasListValue(res?.data)) {
            res.data.forEach((x: any) => {
                if (x.picture) {
                    let exist = this.lstObjects.filter(d => d.Id == x.id)[0];

                    if (exist && this.currentTeam?.Type == 'Facebook') {
                        // exist.Data?.picture = x.picture;
                        // exist.Data.message = x.message;
                    }
                }
            })
        }
    }, error => {
        this.message.error(`${error?.error?.message}` ? `${error?.error?.message}` : 'Đã xảy ra lỗi')
    });
  }

  loadObjects(dataSource$: Observable<ChatomniObjectsDto>) {
    dataSource$.pipe(takeUntil(this.destroy$)).subscribe({
      next: (res: ChatomniObjectsDto) => {
          if(res && res.Items) {

              this.lstObjects = [...res.Items];
              if(TDSHelperArray.hasListValue(res.Items)){
                  let exits = res.Items?.filter((x: ChatomniObjectsItemDto) => x.ObjectId == this.postId)[0];

                  if(TDSHelperObject.hasValue(exits)){
                      this.selectPost(exits);
                  } else {
                      this.selectPost(res.Items[0]);
                  }
              }
          }

          this.isLoading = false;
          setTimeout(() => {
              this.isRefreshing = false;
          }, 300);
      },
      error: (error: any) => {
          this.isLoading = false;
          this.isRefreshing = false;
          this.message.error(`${error?.error?.message}` || 'Đã xảy ra lỗi');
      }
    })
  }

  selectPost(item: ChatomniObjectsItemDto | any): any {
    if(TDSHelperObject.hasValue(item) && item.Data){
        this.currentPost = item;

        //TODO: Facebook load danh sách bài viết con từ bài viết chính
        switch(this.currentTeam?.Type ){
            case CRMTeamType._Facebook:

              let x = item.Data as MDB_Facebook_Mapping_PostDto;
              if(x.parent_id) {

                this.facebookPostService.getByPostParent(this.currentTeam!.Id, x.parent_id).pipe(takeUntil(this.destroy$)).subscribe({
                  next: (res: any) => {
                    if(res && TDSHelperArray.hasListValue(res.Items)) {
                        this.postChilds = [...res.Items];
                    }
                  }
                });
              }
            break;

            case CRMTeamType._TShop:
            break;

            default: break;
        }

        this.changeTab(0, true);
        this.conversationPostFacade.onPostChanged$.emit(item);

        let uri = this.router.url.split("?")[0];
        let uriParams = `${uri}?teamId=${this.currentTeam?.Id}&type=${this.type}&post_id=${item?.ObjectId}`;
        this.router.navigateByUrl(uriParams);
    }
  }

  nextData(event: any): any {
    if (this.isProcessing) {
        return;
    }

    this.isProcessing = true;

    this.dataSource$ = this.chatomniObjectService.nextDataSource(this.currentTeam!.Id);
    this.dataSource$?.pipe(takeUntil(this.destroy$)).subscribe({

      next: (res: ChatomniObjectsDto) => {
          if(TDSHelperArray.hasListValue(res?.Items)) {
              this.lstObjects = [...res.Items];
          }

          this.isProcessing = false;
          this.yiAutoScroll.scrollToElement('scrollObjects', 750);
      },
      error: (error: any) => {
          this.isProcessing = false;
      }
    })
  }

  trackByIndex(_: number, data: any): number {
    return data.Id;
  }

  onClickTeam(data: CRMTeamDTO): any {
    if (this.paramsUrl?.teamId) {
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
            let value = TDSHelperString.stripSpecialChars(text.trim());
            this.keyFilter = value;

            this.queryObj = {...this.onSetFilterObject()};
            this.loadFilterDataSource();
        }
      });
  }

  loadFilterDataSource() {
    this.chatomniObjectService.makeDataSource(this.currentTeam!.Id, this.queryObj).subscribe({
      next: (res: ChatomniObjectsDto) => {
          this.lstObjects  = [...res.Items];

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

    delete this.dataSource$;
    delete this.currentPost;
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

}
