import { CRMActivityCampaignService } from './../../../services/crm-activity-campaign.service';
import { Component, ElementRef, EventEmitter, Input, OnChanges, OnDestroy, OnInit, Output, SimpleChanges, ViewChild } from '@angular/core';
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
import { SaleOnline_OrderService } from 'src/app/main-app/services/sale-online-order.service';
import { SignalRConnectionService } from 'src/app/main-app/services/signalR/signalR-connection.service';
import { TpageBaseComponent } from 'src/app/main-app/shared/tpage-base/tpage-base.component';
import { TDSHelperArray, TDSHelperObject, TDSHelperString, TDSMessageService } from 'tmt-tang-ui';
import { SendMessageModelDTO } from 'src/app/main-app/dto/conversation/send-message.dto';
import { CRMMatchingService } from 'src/app/main-app/services/crm-matching.service';
import { ActivityDataFacade } from 'src/app/main-app/services/facades/activity-data.facade';
import { ConversationDataFacade } from 'src/app/main-app/services/facades/conversation-data.facade';
import { CommentByPost, RequestCommentByPost } from 'src/app/main-app/dto/conversation/post/comment-post.dto';
import { CommentOrder, CommentOrderPost, OdataCommentOrderPostDTO } from 'src/app/main-app/dto/conversation/post/comment-order-post.dto';
import { RequestCommentByGroup } from 'src/app/main-app/dto/conversation/post/comment-group.dto';

@Component({
  selector: 'item-post-comment',
  templateUrl: './item-post-comment.component.html',
  styleUrls: ['./conversation-post.component.scss']
})

export class ItemPostCommentComponent implements OnInit, OnChanges, OnDestroy {

  @Input() post!: FacebookPostItem;
  @Input() sort: any;
  @Input() filter: any;

  team!: CRMTeamDTO;
  data: any = { Items: []};
  enumActivityStatus = ActivityStatus;
  partners$: any = {};
  facebookComment$!: Subscription;
  facebookScanData$!: Subscription;
  childs: any = {};
  commentOrders: any = [];
  subSetCommentOrders$!: Subscription;

  destroy$ = new Subject();
  messageModel!: string;

  currentSort = { value: "DateCreated desc", text: "Mới nhất" };
  currentFilter = { value: "all", text: "Tất cả bình luận" };

  constructor(private message: TDSMessageService,
    private crmTeamService: CRMTeamService,
    private crmMatchingService: CRMMatchingService,
    private activityMatchingService: ActivityMatchingService,
    private activityDataFacade: ActivityDataFacade,
    private conversationDataFacade: ConversationDataFacade,
    private saleOnline_OrderService: SaleOnline_OrderService,
    private sgRConnectionService: SignalRConnectionService,
    private conversationPostFacade: ConversationPostFacade,
    private facebookCommentService: FacebookCommentService,
    private facebookPostService: FacebookPostService,
    public crmService: CRMTeamService) {
      this.initialize();
  }

  ngOnInit() {
    //TODO xử lý lấy thông tin order tại đây
    if(this.post) {
      this.post = {...this.post};
      this.onSetCommentOrders();
      this.loadData();
    }
  }

  initialize(){
    // Gán và khởi tạo dictionary
    this.team = this.crmService.getCurrentTeam() as any;
    if(TDSHelperObject.hasValue(this.team)) {
        this.conversationPostFacade.setTeam(this.team);
    }
    // Gán dictionary
    this.partners$ = this.conversationPostFacade.getDicPartnerSimplest$();

    this.facebookComment$ = this.sgRConnectionService._onFacebookEvent$.subscribe((res: any) => {
      if(res?.data?.last_activity?.comment_obj &&  res?.data?.last_activity?.type == 2) {
        let comment_obj = res.data?.last_activity?.comment_obj;

        if (comment_obj?.object?.id == this.post?.fbid) {
          if(comment_obj.parent.id != this.post.fbid) {
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
          if(data.comment?.object?.id == this.post?.fbid) {
            this.data.Items = [...[data.comment], ...this.data.Items];
          }
        }
      }
    });
  }

  onSetCommentOrders(){
    this.subSetCommentOrders$ = this.saleOnline_OrderService.onSetCommentOrders
      .pipe(takeUntil(this.destroy$)).subscribe((res: any) => {
        if(res) {
          let data = res.data;
          if (!this.commentOrders[res.fbid]) {
            this.commentOrders[res.fbid] = [];
          }
          if (this.commentOrders[res.fbid].filter((x: any) => x.id === data.Id).length === 0) {
            this.commentOrders[res.fbid].push({
              session: data.Session,
              index: data.SessionIndex,
              code: data.SessionIndex > 0 ? `#${data.SessionIndex}. ${data.Code}` : data.Code,
              id: data.Id
            });
          }
        }
    });

    this.facebookPostService.onRemoveOrderComment
      .pipe(takeUntil(this.destroy$)).subscribe((res: any) => {
          let keys = Object.keys(this.commentOrders);
          keys.forEach(key => {
            this.commentOrders[key] = this.commentOrders[key].filter((x: any) => x.id && !res.includes(x.id));
          })
    })

    this.sgRConnectionService._onSaleOnlineOrder$
      .pipe(takeUntil(this.destroy$)).subscribe((res: any) => {
        if(res.data) {
          let data = res.data;
          let userId = data.facebook_ASUserId;

          if(data.facebook_PostId == this.post.fbid) {
            let dataAdd = {} as any;
            if(this.commentOrders[userId]) {
              this.commentOrders[userId] = this.commentOrders[userId].filter((x: any) => x.id && !data.id);
              dataAdd = {
                code: data.code,
                id: data.id,
                index: data.index,
                session: data.session
              };
            } else {
              this.commentOrders[userId] = [];
              dataAdd = {
                code: data.code,
                id: data.id,
                index: data.index,
                session: data.session
              };
            }
            this.commentOrders[userId].push(dataAdd);
          }
        }
    })
  }

  validateData(){
    (this.data as any) = null;
    this.childs = null;
    this.commentOrders = [];
  }

  loadData() {
    this.validateData();
    this.getCommentOrders(this.post.fbid);

    switch(this.currentFilter.value){
      // case 'group':
      //   // TODO: Lọc theo người dùng
      //   this.loadGroupCommentsByPost();
      //   break;
      // case 'filter':
      //   // TODO: Lọc theo bình luận
      //   this.loadFilterCommentsByPost();
      //   break;
      default:
        // TODO: Tất cả bình luận
        this.loadAllCommentsByPost();
        break;
    }
  }

  loadGroupCommentsByPost() {
    this.facebookCommentService.getGroupCommentsByPostId(this.post?.fbid)
      .pipe(takeUntil(this.destroy$))
      .subscribe((res: RequestCommentByGroup) => {
        if(TDSHelperArray.hasListValue(res.Items)) {
          res.Items.map((x: any) => {
              let first = x.activities[0];
              x.created_time = first.created_time;
          });
        }
        this.data = res;
    }, error => {
      this.message.error(`${error?.error?.message}` || 'Lọc theo người dùng đã xảy ra lỗi')
    });
  }

  loadFilterCommentsByPost(){
    this.facebookCommentService.getFilterCommentsByPostId(this.post?.fbid)
      .pipe(takeUntil(this.destroy$))
      .subscribe((res: RequestCommentByGroup) => {
        if(TDSHelperArray.hasListValue(res.Items)) {
          res.Items.map((x: any) => {
              let first = x.activities[0];
              x.message = first.message;
              x.created_time = first.created_time;
          });
        }
        this.data = res;
    }, error => {
      this.message.error(`${error?.error?.message}` || 'Lọc theo bình luận đã xảy ra lỗi')
    });
  }

  loadAllCommentsByPost() {
    this.facebookCommentService.getCommentsByPostId(this.post?.fbid)
      .pipe(takeUntil(this.destroy$))
      .subscribe((res: RequestCommentByPost) => {
        // Xử lý nếu bình luận đó là bình luận của 1 post child
        const childIds = Object.keys(res.Extras['childs']);
        if(TDSHelperObject.hasValue(childIds)) {
            childIds.map((x: any) => {
            let splitParentId = x.split("_");
            let splitPostId = this.post.fbid.split("_");

            if(splitParentId && splitParentId[0] == splitPostId[0]) {
              res.Items = [...res.Items, ...(res.Extras['childs'] as any)[x]];
            }
          })
        }
        this.data = res;
        this.childs = res.Extras['childs'] || null;
    }, error => {
      this.message.error(`${error?.error?.message}` || 'Load comment bài viết đã xảy ra lỗi')
    });
  }

  getCommentOrders(posId: string) {
    this.facebookCommentService.getCommentsOrderByPost(posId)
      .pipe(takeUntil(this.destroy$))
      .subscribe((res: OdataCommentOrderPostDTO) => {
        if(TDSHelperArray.hasListValue(res.value)) {
          res.value.map((x: CommentOrderPost) => {

            this.commentOrders[x.asuid] = [];
            this.commentOrders[x.uid] = [];

            if (TDSHelperArray.hasListValue(x.orders)) {
              x.orders.map((a: CommentOrder) => {
                  this.commentOrders[x.asuid].push(a);
              });
              if (x.uid && x.uid != x.asuid) {
                x.orders.map((a: any) => {
                  this.commentOrders[x.uid].push(a);
                });
              }
            }
          });
        }
    });
  }

  isReply(item: any) {
    item.is_reply = !item.is_reply;
  }

  isPrivateReply(item: CommentByPost){
    item.isPrivateReply = !item.isPrivateReply;
  }

  editOrder(id: any, item: CommentByPost){
    this.conversationPostFacade.onCommentSelected$.emit(item);
  }

  addComment(item: CommentByPost) {
  }

  onEnter(item: CommentByPost, event: any) {
    let message = this.messageModel;
    if(TDSHelperString.hasValueString(message)) {
      const model = this.prepareModel(item, message);

      if(item.isPrivateReply){
        model.comment_id = item.id;
        this.crmMatchingService.addQuickReplyComment(model)
          .pipe(takeUntil(this.destroy$))
          .subscribe((res: any) => {
              this.message.success('Gửi tin thành công');
              if(TDSHelperArray.hasListValue(res)){
                res.forEach((x: any) => {
                    x["status"] = ActivityStatus.sending;
                    this.activityDataFacade.messageServer({...x});
                });
              }
              let items = res.pop();
              this.conversationDataFacade.messageServer(items);
          }, error => {
            this.message.error('Gửi tin nhắn thất bại');
            console.log(error);
         })
      } else {
        // TODO: Trả lời bình luận
        model.parent_id = item.id;
        model.fbid = item.from?.id;

        this.activityMatchingService.replyComment(this.team.Id, model)
          .pipe(takeUntil(this.destroy$))
          .subscribe((res: any) => {
            this.message.success("Trả lời bình luận thành công.");
            this.addReplyComment(item, model);
        }, error => {
          this.message.error(`${error?.error?.message}` || "Trả lời bình luận thất bại.");
          console.log(error);
        })
      }
    }

    (this.messageModel as any) = null;
    event.preventDefault();
  }

  addReplyComment(item: CommentByPost, model: SendMessageModelDTO) {
    let comment = {
      created_time: model.created_time,
      from: model.from,
      message: model.message,
      parent_id: item.id,
      post_id: item.object?.id
    }

    let replyComment = {
      created_time: model.created_time,
      message_format: model.message,
      message: model.message,
      from_id: item.from?.id,
      comment: comment,
      from: comment.from
    }

    if (this.childs[item.id]) {
      this.childs[item.id].push(replyComment);
    } else {
      this.childs[item.id] = [];
      this.childs[item.id].push(replyComment);
    }

    const addActive = {...item, ...model};
    addActive["status"] = this.enumActivityStatus.sending;
    this.activityDataFacade.messageReplyCommentServer(addActive);
  }

  prepareModel(item: CommentByPost, message: string): any {
    const model = {} as SendMessageModelDTO;
    model.from = {
      id: this.team?.Facebook_PageId,
      name: this.team?.Facebook_PageName
    }
    model.to = {
      id: item.from?.id,
      name: item.from?.name
    }
    model.to_id = item.from?.id;
    model.to_name = item.from?.name;
    model.post_id = item.object?.id;
    model.message = message;
    model.created_time = (new Date()).toISOString();

    return model;
  }

  ngOnChanges(changes: SimpleChanges) {
    if(changes["post"] && !changes["post"].firstChange) {
      this.post = {...changes["post"].currentValue};
      this.loadData();
    }

    if(changes["sort"] && !changes["sort"].firstChange) {
      this.currentSort = changes["sort"].currentValue as any;
      this.facebookCommentService.setSort(this.currentSort.value);
      this.loadData();
    }

    if(changes["filter"] && !changes["filter"].firstChange) {
      this.currentFilter = changes["filter"].currentValue as any;
      this.loadData();
    }

    if(changes["sort"] && !changes["sort"].firstChange && changes["filter"] && !changes["filter"].firstChange) {
      this.facebookCommentService.fetchComments(this.team.Id, this.post.fbid)
        .pipe(takeUntil(this.destroy$)).subscribe((res: any) => {
          this.message.success('Tải lại dữ liệu thành công!');

          let sort = changes["sort"].currentValue as any;
          this.facebookCommentService.setSort(sort.value);
          this.loadData();
      }, error => {
        this.message.error(`${error?.error?.message}` || 'Thao tác thất bại');
      })
    }
  }

  ngOnDestroy(): void {
    this.subSetCommentOrders$.unsubscribe();
    this.facebookComment$.unsubscribe();
    this.facebookScanData$.unsubscribe();

    this.destroy$.next();
    this.destroy$.complete();
  }

}
