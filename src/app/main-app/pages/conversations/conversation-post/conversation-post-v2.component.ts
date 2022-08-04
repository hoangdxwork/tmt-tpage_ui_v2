import { TDSSafeAny } from 'tds-ui/shared/utility';
import { AfterViewInit, ChangeDetectorRef, Component, ElementRef, NgZone, OnDestroy, OnInit, ViewChild, ViewContainerRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { BehaviorSubject, fromEvent, Observable, Subject, Subscription } from 'rxjs';
import { debounceTime, distinctUntilChanged, finalize, map, mergeMap, takeUntil, tap, throttleTime } from 'rxjs/operators';
import { ChangeTabConversationEnum } from 'src/app/main-app/dto/conversation/conversation.dto';
import { FacebookPostDTO, FacebookPostItem } from 'src/app/main-app/dto/facebook-post/facebook-post.dto';
import { CRMTeamDTO } from 'src/app/main-app/dto/team/team.dto';
import { ActivityMatchingService } from 'src/app/main-app/services/conversation/activity-matching.service';
import { CRMTeamService } from 'src/app/main-app/services/crm-team.service';
import { ConversationOrderFacade } from 'src/app/main-app/services/facades/conversation-order.facade';
import { ConversationPostFacade } from 'src/app/main-app/services/facades/conversation-post.facade';
import { FacebookGraphService } from 'src/app/main-app/services/facebook-graph.service';
import { FacebookPostService } from 'src/app/main-app/services/facebook-post.service';
import { TpageBaseComponent } from 'src/app/main-app/shared/tpage-base/tpage-base.component';
import { ListLiveCampaignComponent } from 'src/app/main-app/shared/list-live-campaign/list-live-campaign.component';
import { TDSMessageService } from 'tds-ui/message';
import { TDSModalService } from 'tds-ui/modal';
import { TDSHelperArray, TDSHelperObject, TDSHelperString } from 'tds-ui/shared/utility';
import { CdkVirtualScrollViewport } from '@angular/cdk/scrolling';
import { CRMTeamType } from 'src/app/main-app/dto/team/chatomni-channel.dto';
import { TDSDestroyService } from 'tds-ui/core/services';
import { ChatomniObjectsService } from '@app/services/chatomni-service/chatomni-objects.service';
import { ChatomniObjectsDto, ChatomniObjectsItemDto } from '@app/dto/conversation-all/chatomni/chatomni-objects.dto';
import { Facebook_Graph_Post } from '@app/dto/conversation-all/chatomni/chatomni-facebook-post.dto';

@Component({
  selector: 'app-conversation-post-v2',
  templateUrl: './conversation-post-v2.component.html',
  styleUrls: ['./conversation-post.component.scss'],
  providers: [ TDSDestroyService ]
})

export class ConversationPostV2Component extends TpageBaseComponent implements OnInit, AfterViewInit {

  @ViewChild('innerText') innerText!: ElementRef;

  @ViewChild(CdkVirtualScrollViewport)
  viewport!: CdkVirtualScrollViewport;

  public lstType: any[] = [
    { type: '', text: 'Tất cả bài viết' },
    { type: 'added_video', text: 'Video' },
    { type: 'added_photos', text: 'Hình ảnh' },
    { type: 'mobile_status_update', text: 'Status' },
    { type: 'published_story', text: 'Story đã đăng' },
    { type: 'shared_story', text: 'Story đã chia sẻ' }
  ];

  lstTime: any[] = [
    { type: 'created_time desc', text: 'Ngày tạo mới nhất' },
    { type: 'created_time asc', text: 'Ngày tạo cũ nhất' },
    { type: 'updated_time desc', text: 'Ngày update mới nhất' },
    { type: 'updated_time asc', text: 'Ngày update cũ nhất' }
  ];

  type = 'All';
  eventType: string = 'TYPE';
  isLoadFrist = false;
  currentType: any = this.lstType[0];
  postId: any;
  postChilds: TDSSafeAny[] = [];
  listBadge: any = {};

  keyFilter: string = '';
  currentPost?: ChatomniObjectsItemDto;
  isLoading: boolean = false;
  isProcessing: boolean = false;

  currentOrderTab: number = 0;
  isDisableTab: boolean = true;

  dataSource$?: Observable<ChatomniObjectsDto> ;
  lstObjects: ChatomniObjectsItemDto[] = [];

  constructor(private facebookPostService: FacebookPostService,
    private conversationPostFacade: ConversationPostFacade,
    private facebookGraphService: FacebookGraphService,
    private activityMatchingService: ActivityMatchingService,
    private message: TDSMessageService,
    public crmService: CRMTeamService,
    public activatedRoute: ActivatedRoute,
    private modal: TDSModalService,
    private ngZone: NgZone,
    private viewContainerRef: ViewContainerRef,
    private conversationOrderFacade: ConversationOrderFacade,
    public router: Router,
    private chatomniObjectsService: ChatomniObjectsService,
    private destroy$: TDSDestroyService) {
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
    });

    this.onChangeTabEvent();
  }

  //TODO: khi có comment mới vào bài viết
  loadBadgeComments() {
    this.activityMatchingService.onGetComment$.pipe(takeUntil(this.destroy$)).subscribe((res: any) => {
        if(res){
            let post_id = res.object?.id;
            this.listBadge[post_id] = this.listBadge[post_id] || {};
            this.listBadge[post_id]["count"] = (this.listBadge[post_id]["count"] || 0) + 1;
        }
    });
  }

  onChangeTabEvent() {
    this.conversationOrderFacade.onChangeTab$.pipe(takeUntil(this.destroy$)).subscribe(res => {

          if(res === ChangeTabConversationEnum.order) {
            this.changeTab(2, false);
          }

          else if(res === ChangeTabConversationEnum.partner) {
            this.changeTab(1, false);
          }
      });
  }

  changeTab(tabIndex: number, isDisable: boolean = true) {
    this.currentOrderTab = tabIndex;
    this.isDisableTab = isDisable;
  }

  setType(item: any, eventType: string) {
    this.isLoadFrist = true;
    this.eventType = eventType;

    if (this.currentType.type != item.type) {
        this.currentType = item;
        this.loadData();
    }
  }

  fetchPosts(team: any) {
    this.facebookPostService.fetchPosts(team?.Id).pipe(takeUntil(this.destroy$)).subscribe();
  }

  loadData(){
    this.isLoading = true;
    this.validateData();

    this.ngZone.run(() => {
        this.dataSource$ = this.chatomniObjectsService.makeDataSource(this.currentTeam!.Id);
    })

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
                        exist.Data.picture = x.picture;
                        exist.Data.message = x.message;
                    }
                }
            })
        }
    }, error => {
        this.message.error(`${error?.error?.message}` ? `${error?.error?.message}` : 'Đã xảy ra lỗi')
    });
  }

  loadObjects(dataSource$: Observable<ChatomniObjectsDto>) {
    dataSource$.pipe(takeUntil(this.destroy$)).subscribe((res: ChatomniObjectsDto) => {

        if(res && res.Items) {
            this.lstObjects = [...res.Items];

            if(TDSHelperArray.hasListValue(res.Items)){
                let exits = res.Items.filter((x: ChatomniObjectsItemDto) => x.ObjectId == this.postId)[0];

                if(TDSHelperObject.hasValue(exits)){
                    this.selectPost(exits);
                } else {
                    this.selectPost(res.Items[0]);
                }
            }
        }

        this.isLoading = false;
    }, error => {
        this.isLoading = false;
        this.message.error(`${error?.error?.message}` || 'Đã xảy ra lỗi');
    })
  }

  selectPost(item: ChatomniObjectsItemDto): any {
    if(TDSHelperObject.hasValue(item) && item.Data){

        this.currentPost = item;

        //TODO: Facebook load danh sách bài viết con từ bài viết chính
        switch(this.currentTeam?.Type ){
            case CRMTeamType._Facebook:

              let x = item.Data as Facebook_Graph_Post;
              if(x.parent_id) {debugger

                this.facebookPostService.getByPostParent(this.currentTeam!.Id, x.parent_id).pipe(takeUntil(this.destroy$)).subscribe((res: any) => {debugger
                    if(res && TDSHelperArray.hasListValue(res.Items)) {
                        this.postChilds = [...res.Items];
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

  nextData(event: any): any {debugger
    if(event) {

      if (this.isProcessing) {
          return false;
      }

      this.isProcessing = true;
      this.ngZone.run(() => {
          this.dataSource$ = this.chatomniObjectsService.nextDataSource(this.currentTeam!.Id);
      })

      this.dataSource$?.pipe(takeUntil(this.destroy$)).subscribe((res: ChatomniObjectsDto) => {

          if(TDSHelperArray.hasListValue(res?.Items)) {
              this.lstObjects = [...res.Items];
          }

          this.isProcessing = false;
      }, error => {
          this.isProcessing = false;
      })
    }
  }

  trackByIndex(i: any) {
    return i;
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
    this.currentOrderTab = 2;
  }

  showModalLiveCampaign(item: FacebookPostItem) {
    const modal = this.modal.create({
      title: 'Chiến dịch',
      content: ListLiveCampaignComponent,
      size: "lg",
      viewContainerRef: this.viewContainerRef,
      componentParams:{
        post: item
      }
    });
  }

  ngAfterViewInit() {
    fromEvent(this.innerText?.nativeElement, 'keyup').pipe(
      map((event: any) => { return event.target.value }),
      debounceTime(750),
      distinctUntilChanged())
        .subscribe((text: string) => {
          this.keyFilter = text;
          this.loadData();
      });
  }

  validateData(){
    this.postChilds = [];
    this.lstObjects = [];

    delete this.dataSource$;
    delete this.currentPost;
  }
}
