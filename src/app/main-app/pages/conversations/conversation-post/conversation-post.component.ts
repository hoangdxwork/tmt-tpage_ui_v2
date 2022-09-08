
import { ObjectFacebookPostEvent } from './../../../handler-v2/conversation-post/object-facebook-post.event';
import { LiveCampaignService } from 'src/app/main-app/services/live-campaign.service';
import { TDSSafeAny } from 'tds-ui/shared/utility';
import { AfterViewInit, ChangeDetectorRef, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
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
import { YiAutoScrollDirective } from '@app/shared/directives/yi-auto-scroll.directive';
import { ChangeTabConversationEnum } from '@app/dto/conversation-all/chatomni/change-tab.dto';
import { ChatomniObjectFacade } from '@app/services/chatomni-facade/chatomni-object.facade';
import { ChatomniConversationFacade } from '@app/services/chatomni-facade/chatomni-conversation.facade';
import { ChatomniConversationService } from '@app/services/chatomni-service/chatomni-conversation.service';
import { de } from 'date-fns/locale';
import { ChatomniConversationInfoDto } from '@app/dto/conversation-all/chatomni/chatomni-conversation-info.dto';

@Component({
  selector: 'app-conversation-post',
  templateUrl: './conversation-post.component.html',
  providers: [ TDSDestroyService ]
})

export class ConversationPostComponent extends TpageBaseComponent implements OnInit, AfterViewInit {

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

  syncConversationInfo!: ChatomniConversationInfoDto;// TODO: chỉ dùng cho trường hợp đồng bộ dữ liệu partner + order

  currentType: any = { id: 'all', name: 'Tất cả bài viết' };
  currentSort: any = {};

  postId: any;
  postChilds: TDSSafeAny[] = [];
  listBadge: any = {};

  keyFilter: string = '';
  currentPost?: ChatomniObjectsItemDto;
  isLoading: boolean = false;
  isProcessing: boolean = false;

  selectedIndex: number = 0;
  isDisableTabPartner: boolean = true;
  isDisableTabOrder: boolean = true;
  codeOrder!: string | null;

  dataSource$?: Observable<ChatomniObjectsDto> ;
  lstObjects!: ChatomniObjectsItemDto[];
  lstOfLiveCampaign: any[] = [];

  queryObj?: any = { type!: "", sort!: "", q!: "" };
  isRefreshing: boolean = false;
  partners$!: Observable<any>;

  constructor(private facebookPostService: FacebookPostService,
    private facebookGraphService: FacebookGraphService,
    private activityMatchingService: ActivityMatchingService,
    private liveCampaignService: LiveCampaignService,
    private message: TDSMessageService,
    public crmService: CRMTeamService,
    public activatedRoute: ActivatedRoute,
    private cdRef: ChangeDetectorRef,
    private chatomniConversationFacade: ChatomniConversationFacade,
    private conversationOrderFacade: ConversationOrderFacade,
    public router: Router,
    private chatomniObjectFacade: ChatomniObjectFacade,
    private chatomniObjectService: ChatomniObjectService,
    private chatomniConversationService: ChatomniConversationService,
    private destroy$: TDSDestroyService,
    private objectFacebookPostEvent: ObjectFacebookPostEvent) {
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
    this.loadLiveCampaign();
  }

  eventEmitter() {
    // TODO: Cập nhật chiến lịch live từ object-facebook-post
    this.objectFacebookPostEvent.changeUpdateLiveCampaignFromObject$.pipe(takeUntil(this.destroy$)).subscribe({
      next: (res: ChatomniObjectsItemDto) => {
        if(res && res.LiveCampaignId) {
            let index = this.lstObjects.findIndex(x => x.Id == res.Id);
            if(index >- 1) {
                this.lstObjects[index].LiveCampaignId = res.LiveCampaignId;
                this.lstObjects[index].LiveCampaign = {...res.LiveCampaign} as any;

                this.lstObjects[index] = {...this.lstObjects[index]};
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
        }
      }
    })

    // TODO: sự kiên đồng bộ dữ liệu lưu khách hàng hoặc tạo đơn hàng hội thoại, ngOnChanges tự lấy sự kiện
    this.chatomniConversationFacade.onSyncConversationInfo$.pipe(takeUntil(this.destroy$)).subscribe({
      next: (csid: string) => {
          let teamId = this.currentTeam?.Id as any;
          this.chatomniConversationService.syncConversationInfo(teamId, csid).pipe(takeUntil(this.destroy$)).subscribe({
              next: (data: any) => {
                  this.syncConversationInfo = {...data};
                  this.cdRef.markForCheck();
              }
          })
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

        // TODO:
        this.chatomniObjectFacade.onChangeListOrderFromObjects$.emit(item);

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
    this.codeOrder = null;
  }

  loadLiveCampaign(text?: string) {
    this.liveCampaignService.getAvailables(text).pipe(takeUntil(this.destroy$)).subscribe({
      next: (res: any) => {
          delete res['@odata.context'];
          this.lstOfLiveCampaign = [...res.value];
          this.cdRef.detectChanges();
      },
      error: (error: any) => {
          this.cdRef.detectChanges();
      }
    })
  }

}
