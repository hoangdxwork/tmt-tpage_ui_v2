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
  selector: 'post-comment-all',
  templateUrl: './post-comment-all.component.html',
})

export class PostCommentAllComponent implements OnInit, OnChanges, OnDestroy {

  @Input() data!: any;

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
  }

  ngOnInit() {
    //TODO xử lý lấy thông tin order tại đây
    if(this.data) {
    }
  }



  ngOnChanges(changes: SimpleChanges) {

  }

  ngOnDestroy(): void {
  }

}
