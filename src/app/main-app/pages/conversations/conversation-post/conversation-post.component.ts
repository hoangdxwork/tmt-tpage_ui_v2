import { Component, OnInit } from '@angular/core';
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
import { TpageBaseComponent } from 'src/app/main-app/shared/tpage-base/tpage-base.component';
import { TDSHelperArray, TDSHelperObject, TDSHelperString } from 'tmt-tang-ui';

@Component({
  selector: 'app-conversation-post',
  templateUrl: './conversation-post.component.html',
  styleUrls: ['./conversation-post.component.scss']
})
export class ConversationPostComponent extends TpageBaseComponent implements OnInit {

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

  dataX: any = { Items: [] };
  data: any[] = [];
  nextPage: any;
  offset = new BehaviorSubject(null);
  keyFilter: string = '';
  hasNextPage: boolean = true;
  data$!: Observable<any>;
  currentPost!: FacebookPostItem | undefined;
  destroy$ = new Subject();

  constructor(private facebookPostService: FacebookPostService,
    private conversationPostFacade: ConversationPostFacade,
    private facebookGraphService: FacebookGraphService,
    private activityMatchingService: ActivityMatchingService,
    public crmService: CRMTeamService,
    public activatedRoute: ActivatedRoute,
    public router: Router) {
      super(crmService, activatedRoute, router);
  }

  onInit(): void {
    this.loadQueryParamMap().pipe(takeUntil(this.destroy$)).subscribe(([team, params]: any) => {
      if (!TDSHelperObject.hasValue(team)) {
          this.onRedirect();
      } else {
        this.type = params?.params?.type;
        this.setParamsUrl(params.params);
        this.setCurrentTeam(team);
        this.fetchPosts();
        this.loadData();

        this.postId = params?.params?.post_id || null;
        //TODO: khi có comment mới vào bài viết
        this.loadBadgeComments();
      }
    })
  }

  loadBadgeComments(){
    // khi có comment mới vào bài viết
    this.activityMatchingService.onGetComment$.subscribe((res: any) => {
      let post_id = res.object.id;

      this.listBadge[post_id] = this.listBadge[post_id] || {};
      this.listBadge[post_id]["count"] = (this.listBadge[post_id]["count"] || 0) + 1;
    });

    // this.liveCampaignService.getData().subscribe((res: any) => {
    //   this.lstLiveCampaign = res;
    // })
  }

  public setType(item: any, eventType: string): void {
    this.eventType = eventType;
    if (this.currentType.type !== item.type) {
      this.currentType = item;
      this.data = [];
      delete this.nextPage;
      if (this.offset) {
        this.offset = new BehaviorSubject(null);
      }
      this.loadData();
    }
  }

  fetchPosts() {
    this.facebookPostService.fetchPosts(this.currentTeam.Id).pipe(takeUntil(this.destroy$)).subscribe((x: any) => {});
  }

  loadData(){
    let that = this;
    if(TDSHelperString.hasValueString(that.keyFilter)){
      this.data = [];
      if (that.offset) {
        that.offset = new BehaviorSubject(null);
      }
    }

    if(that.currentTeam?.Id){
      let batchMap = that.offset.pipe(
        throttleTime(500),
        mergeMap((n: any) => that.getData(n, that.currentType.type, that.keyFilter))
      );

      that.data$ = batchMap
        .pipe(takeUntil(that.destroy$))
        .pipe(map((x: any) => {
          let items = Object.values(x);
          items.map((x: any) => {
            if (this.data.filter((f) => f.fbid === x.fbid).length === 0) {
              this.data = [...this.data, ...[x]];
            }
          });

          let itemSelected = this.data.find((x: any) => x.fbid == this.postId);
          if (!itemSelected) {
            if(this.postId) {
              this.facebookPostService.getPostByPageId(this.currentTeam.Facebook_PageId, this.postId)
                .pipe(takeUntil(this.destroy$))
                .subscribe((res: FacebookPostItem) => {
                    itemSelected = res;
                    this.selectPost(itemSelected);
                })
            } else {
              // Phần tử đầu tiên đã được sắp xếp
              this.selectPost(this.data[0]);
            }
          }  else {
            if (this.data.length > 0 && !this.currentPost) {
              this.selectPost(itemSelected);
            }
          }
          return this.data;
      }));

      this.facebookGraphService.getFeed(this.currentTeam.Facebook_PageToken).subscribe((res: any) => {
        if (res && TDSHelperArray.isArray(res.data)) {
          res.data.forEach((x: any) => {
            if (x.picture) {
              let exist = this.data.filter(d => d.id == x.id)[0];
              if (exist) {
                exist.picture = x.picture;
                exist.message = x.message;
              }
            }
          });
        }
      });
    }
  }

  selectPost(item: FacebookPostItem): void {
    if (item && item.fbid && (!this.currentPost || (this.currentPost && item.fbid != this.currentPost.fbid))) {
      if (!this.currentPost || this.currentPost.fbid != item.fbid) {
        //TODO: mapping lại post_id vào url
        this.currentPost = item;
        this.facebookPostService.loadPost(this.currentPost);
        // this.data.map((x) => { delete x.selected });

        // item.selected = true;
        this.conversationPostFacade.onPostChanged$.emit(item);

        // this.router.navigateByUrl(`/conversation/post?teamId=${this.paramsUrl.teamId}&type=post&post_id=${item.fbid}`);
        // get posts child
        if (!this.postChilds || this.postChilds.length < 1 || (!item.parent_id && this.postChilds.length > 0 && (this.postChilds[0] as any).parent_id != item.fbid)) {
          this.postChilds = [];

          this.facebookPostService.getByPostParent(this.paramsUrl.teamId, item.parent_id || item.fbid).subscribe((res: any) => {
              this.postChilds = res.Items;
              // item.count_post_child = res.Items && res.Items.length;
          });
        }
      }
    } else
    if (this.currentPost && this.currentPost.fbid != item.fbid) {
      delete this.currentPost;
    }
    this.addQueryParams({ post_id: item.fbid });
  }

  getData(nextUrl?: string, type?: string, textSearch?: string) {
    return this.facebookPostService.getPostsByTeamId(this.currentTeam.Id, nextUrl, type, this.eventType, textSearch)
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
      let url = this.router.url.split("?")[0];
      const params = { ...this.paramsUrl };
      params.teamId = data.Id;
      this.router.navigate([url], { queryParams: params });
    }
    this.crmService.onUpdateTeam(data);
  }

  getIconTypePost(type: string): any {
    if (!type) return "tdsi-paste-as-text-fill";
    if (type == "added_video") return "tdsi-video-camera-fill";
    if (type == "added_photos") return "tdsi-images-fill";
    return "tdsi-page-line";
  }

  compareToday(date: any) {
    var d = new Date(date);
    var today = new Date();

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
