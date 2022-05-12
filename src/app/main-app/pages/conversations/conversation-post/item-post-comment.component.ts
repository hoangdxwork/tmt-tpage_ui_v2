import { Component, ElementRef, Input, OnChanges, OnDestroy, OnInit, SimpleChanges, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { BehaviorSubject, Observable, Subject, Subscription } from 'rxjs';
import { map, mergeMap, takeUntil, tap, throttleTime } from 'rxjs/operators';
import { ActivityStatus } from 'src/app/lib/enum/message/coversation-message';
import { FacebookPostDTO, FacebookPostItem } from 'src/app/main-app/dto/facebook-post/facebook-post.dto';
import { CRMTeamDTO } from 'src/app/main-app/dto/team/team.dto';
import { ActivityMatchingService } from 'src/app/main-app/services/conversation/activity-matching.service';
import { CRMTeamService } from 'src/app/main-app/services/crm-team.service';
import { ConversationPostFacade } from 'src/app/main-app/services/facades/conversation-post.facade';
import { FacebookCommentService } from 'src/app/main-app/services/facebook-comment.service';
import { FacebookGraphService } from 'src/app/main-app/services/facebook-graph.service';
import { FacebookPostService } from 'src/app/main-app/services/facebook-post.service';
import { SignalRConnectionService } from 'src/app/main-app/services/signalR/signalR-connection.service';
import { TpageBaseComponent } from 'src/app/main-app/shared/tpage-base/tpage-base.component';
import { TDSHelperArray, TDSHelperObject, TDSHelperString, TDSMessageService } from 'tmt-tang-ui';

@Component({
  selector: 'item-post-comment',
  templateUrl: './item-post-comment.component.html',
  styleUrls: ['./conversation-post.component.scss']
})

export class ItemPostCommentComponent implements OnInit, OnChanges, OnDestroy {

  @Input() post!: FacebookPostItem;
  team!: CRMTeamDTO;

  data: any = { Items: [] };
  enumActivityStatus = ActivityStatus;
  partners$: any = {};
  facebookComment$!: Subscription;
  facebookScanData$!: Subscription;
  childs: any = {};
  commentOrders: any = [];
  destroy$ = new Subject();
  @ViewChild('contentMessage') contentMessage!: ElementRef;

  constructor(private message: TDSMessageService,
    private crmTeamService: CRMTeamService,
    private sgRConnectionService: SignalRConnectionService,
    private conversationPostFacade: ConversationPostFacade,
    private facebookCommentService: FacebookCommentService,
    private facebookPostService: FacebookPostService,
    public crmService: CRMTeamService) {
      this.loadFacades();
  }

  loadFacades(){
    // Gán và khởi tạo dictionary
    this.team = this.crmService.getCurrentTeam() as any;
    if(TDSHelperObject.hasValue(this.team)) {
        this.conversationPostFacade.setTeam(this.team);
    }
    // Gán dictionary
    this.partners$ = this.conversationPostFacade.getDicPartnerSimplest$();
    this.facebookComment$ = this.sgRConnectionService._onFacebookEvent$.subscribe((res: any) => {
      if(res?.data && res?.data?.last_activity && res?.data?.last_activity?.comment_obj &&  res?.data?.last_activity?.type == 2) {
        let comment_obj = res.data?.last_activity?.comment_obj;
        if (comment_obj.object.id == this.post.fbid) {
          if(comment_obj.parent && comment_obj.parent.id && comment_obj.parent.id != this.post.fbid ) {
            this.childs[comment_obj.parent.id].unshift(comment_obj);
          } else {
            this.data.Items.unshift(comment_obj);
          }
        }
      }
    });

    this.facebookScanData$ = this.sgRConnectionService._onFacebookScanData$.subscribe((res: any) => {
      if(res.data) {
        let data = Object.assign({}, res.data);
        if(res.type == "update_scan_feed") {
          if(data.comment.object.id == this.post.fbid) {
            this.data.Items = [...[data.comment], ...this.data.Items];
          }
        }
      }
    });
  }

  ngOnInit() {
    if(this.post) {
      this.post = {...this.post};
      this.loadData();
    }
  }

  loadData() {
    this.data = {};
    if(TDSHelperObject.hasValue(this.post) && this.post.fbid) {
      this.getCommentOrders(this.post.fbid);
      this.facebookCommentService.getCommentsByPostId(this.post.fbid).subscribe((res: any) => {
        // Xử lý nếu bình luận đó là bình luận của 1 post child
        let childIds = Object.keys(res.Extras['childs']);

        if(childIds && childIds.length > 0) {
          childIds.map((x: string) => {
            let splitParentId = x.split("_");
            let splitPostId = this.post.fbid.split("_");

            if(splitParentId && splitParentId[0] == splitPostId[0]) {
              res.Items = [...res.Items, ...res.Extras['childs'][x]];
            }
          });
        }
        res.Items = res.Items.map((x: any) => {
          x["isPrivateReply"] = false;
          x["replyMessage"] = "";
          return x;
        });

        this.data = res;
        this.childs = res.Extras['childs'] || {};
      });
    }
  }

  getCommentOrders(posId: string) {
    this.facebookCommentService.getCommentsOrderByPost(posId).subscribe((res: any) => {
      this.commentOrders = [];
      res.value.map((x: any) => {
        this.commentOrders[x.asuid] = [];
        this.commentOrders[x.uid] = [];

        if (x.orders) {
          x.orders.map((a: any) => {
            this.commentOrders[x.asuid].push(a);
          });

          if (x.uid && x.uid != x.asuid) {
            x.orders.map((a: any) => {
              this.commentOrders[x.uid].push(a);
            });
          }
        }
      });
    });
  }

  ngOnChanges(changes: SimpleChanges) {
    if(changes["post"] && !changes["post"].firstChange) {
      this.post = {...changes["post"].currentValue};
      this.loadData();
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

}
