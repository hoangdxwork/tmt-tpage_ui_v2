import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { map, mergeMap, takeUntil, tap, throttleTime } from 'rxjs/operators';
import { FacebookPostDTO, FacebookPostItem } from 'src/app/main-app/dto/facebook-post/facebook-post.dto';
import { CRMTeamDTO } from 'src/app/main-app/dto/team/team.dto';
import { ActivityMatchingService } from 'src/app/main-app/services/conversation/activity-matching.service';
import { CRMTeamService } from 'src/app/main-app/services/crm-team.service';
import { ConversationPostFacade } from 'src/app/main-app/services/facades/conversation-post.facade';
import { FacebookGraphService } from 'src/app/main-app/services/facebook-graph.service';
import { FacebookPostService } from 'src/app/main-app/services/facebook-post.service';
import { PartnerService } from 'src/app/main-app/services/partner.service';
import { TpageBaseComponent } from 'src/app/main-app/shared/tpage-base/tpage-base.component';
import { TDSHelperArray, TDSHelperObject, TDSHelperString, TDSMessageService } from 'tmt-tang-ui';

@Component({
  selector: 'app-conversation-post',
  templateUrl: './conversation-post.component.html',
  styleUrls: ['./conversation-post.component.scss']
})

export class ConversationPostComponent extends TpageBaseComponent implements OnInit, OnDestroy {

  public items: any[] = [
    { type: '', text: 'Tất cả bài viêt' },
    { type: 'added_video', text: 'Video' },
    { type: 'added_photos', text: 'Hình ảnh' },
    { type: 'mobile_status_update', text: 'Status' },
    { type: 'published_story', text: 'Story đã đăng' },
    { type: 'shared_story', text: 'Story đã chia sẻ' }
  ];

  lstTimes: any[] = [
    { type: 'created_time desc', text: 'Ngày tạo mới nhất' },
    { type: 'created_time asc', text: 'Ngày tạo cũ nhất' },
    { type: 'updated_time desc', text: 'Ngày update mới nhất' },
    { type: 'updated_time asc', text: 'Ngày update cũ nhất' }
  ];

  type = 'All';
  eventType: string = 'TYPE';
  currentType: any = this.items[0];
  postId: any;
  postChilds = [];
  listBadge: any = {};

  data!: FacebookPostItem[];
  nextPage: any;
  offset = new BehaviorSubject(null);
  keyFilter: string = '';
  hasNextPage: boolean = true;
  data$!: Observable<FacebookPostItem[]>;
  currentPost!: FacebookPostItem | undefined;
  destroy$ = new Subject();

  currentOrderTab: number = 0;
  isDisableTab: boolean = true;

  constructor(private facebookPostService: FacebookPostService,
    private conversationPostFacade: ConversationPostFacade,
    private facebookGraphService: FacebookGraphService,
    private activityMatchingService: ActivityMatchingService,
    private message: TDSMessageService,
    public crmService: CRMTeamService,
    public activatedRoute: ActivatedRoute,
    private partnerService: PartnerService,
    public router: Router
  ) {
      super(crmService, activatedRoute, router);
  }

  ngOnInit(): void {
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
        this.postId = params?.params?.post_id;
      }

      let exist = (TDSHelperString.isString(this.currentPost?.fbid) != TDSHelperString.isString(this.paramsUrl.post_id))
        || (!TDSHelperString.isString(this.currentPost?.fbid) && !TDSHelperString.isString(this.paramsUrl?.post_id));

      if(exist) {
        this.loadData();
        this.loadBadgeComments();
      }
    });

    this.loadPartnerByPostComment();
  }

  //TODO: khi có comment mới vào bài viết
  loadBadgeComments() {
    this.activityMatchingService.onGetComment$
      .pipe(takeUntil(this.destroy$)).subscribe((res: any) => {
        if(res){
          let post_id = res.object?.id;
          this.listBadge[post_id] = this.listBadge[post_id] || {};
          this.listBadge[post_id]["count"] = (this.listBadge[post_id]["count"] || 0) + 1;
        }
    });
  }

  loadPartnerByPostComment() {
    this.partnerService.onLoadPartnerFormPostComment
      .pipe(takeUntil(this.destroy$))
      .subscribe(res => {
        this.currentOrderTab = 1;
        this.isDisableTab = false;
      });
  }

  public setType(item: any, eventType: string): void {
    this.eventType = eventType;
    if (this.currentType.type !== item.type) {
      this.currentType = item;
      this.loadData();
    }
  }

  fetchPosts(team: any) {
    this.facebookPostService.fetchPosts(team?.Id).pipe(takeUntil(this.destroy$)).subscribe((x: any) => {});
  }

  loadData(){
    this.validateData();
    if(this.currentTeam?.Id) {
      const batchMap = this.offset.pipe(throttleTime(500),
        mergeMap((x: any) => this.getData(x, this.currentType.type, this.keyFilter)));

      if(batchMap){
        this.data$ = batchMap.pipe(takeUntil(this.destroy$)).pipe(map((dict: any) => {
          let items = Object.values(dict);
          items.map((x: any) => {
            if (this.data.filter((f: any) => f.fbid === x.fbid).length === 0) {
              this.data = [...this.data, ...[x]];
            } else {
              console.log([x]);
            }
          });
          if(TDSHelperArray.hasListValue(this.data)){
            let exits = this.data.filter((x: any) => x.fbid == this.postId)[0];
            if(TDSHelperObject.hasValue(exits)){
                this.selectPost(exits);
            } else {
                this.selectPost(this.data[0]);
            }
          }
          return this.data;
        }));
      }

      this.facebookGraphService.getFeed(this.currentTeam.Facebook_PageToken)
        .pipe(takeUntil(this.destroy$)).subscribe((res: any) => {
          if (TDSHelperArray.hasListValue(res?.data)) {
            res.data.forEach((x: any) => {
              if (x.picture) {
                let exist = this.data.filter(d => d.fbid == x.id)[0];
                if (exist) {
                  exist.picture = x.picture;
                  exist.message = x.message;
                }
            }});
          }
      });
    }
  }

  validateData(){
    delete this.nextPage;
    (this.data$ as any) = null;
    (this.currentPost as any) = null;
    this.postChilds = [];
    this.data = [];
    this.offset = new BehaviorSubject(null);
  }

  selectPost(item: FacebookPostItem): any {
    if(TDSHelperObject.hasValue(item)){
      this.currentPost = {...item};
      this.facebookPostService.loadPost(item);

      //load danh sách bài viết con từ bài viết chính
      if(TDSHelperString.hasValueString(item.parent_id)) {
        this.facebookPostService.getByPostParent(this.currentTeam.Id, item.parent_id)
          .pipe(takeUntil(this.destroy$))
          .subscribe((res: any) => {

            if(res && TDSHelperArray.hasListValue(res.Items)) {
              this.postChilds = res.Items;
            }
        });
      }
      this.conversationPostFacade.onPostChanged$.emit(item);

      let uri = this.router.url.split("?")[0];
      let uriParams = `${uri}?teamId=${this.currentTeam?.Id}&type=${this.type}&post_id=${item?.fbid}`;
      this.router.navigateByUrl(uriParams);
    }
  }

  getData(nextUrl?: string, type?: string, keyFilter?: string): Observable<any> {
    return this.facebookPostService.getPostsByTeamId(this.currentTeam.Id, nextUrl, type, this.eventType, keyFilter)
      .pipe(tap((arr: FacebookPostDTO) => { (arr.HasNextPage ? null : (this.hasNextPage = true)) }),
          map((arr: FacebookPostDTO) => {

          this.nextPage = arr.NextPage;
          this.hasNextPage = arr.HasNextPage;

          return arr.Items.reduce((acc: any, current: any) => {
              let id = current.fbid;
              let data = current;
              return { ...acc, [id]: data };
          }, {});
        })
      );
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

  compareToday(date: any) {
    let d = new Date(date);
    let today = new Date();
    if (d.getFullYear() == today.getFullYear() && d.getMonth() - 1 == today.getMonth() && d.getDate() == d.getDate()) {
      return true;
    }
    return false;
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

}
