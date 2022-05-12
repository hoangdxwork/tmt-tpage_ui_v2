import { Component, Input, OnChanges, OnDestroy, OnInit, SimpleChanges } from '@angular/core';
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
import { TDSHelperArray, TDSHelperObject, TDSHelperString, TDSMessageService } from 'tmt-tang-ui';

@Component({
  selector: 'conversation-post-item',
  templateUrl: './conversation-post-item.component.html',
  styleUrls: ['./conversation-post.component.scss']
})

export class ConversationPostItemComponent implements OnInit, OnChanges, OnDestroy {

  @Input() data!: FacebookPostItem;
  destroy$ = new Subject();

  constructor(private facebookPostService: FacebookPostService,
    private message: TDSMessageService){
  }

  ngOnInit() {
    if(this.data){
      this.data = {...this.data};
    }
  }

  ngOnChanges(changes: SimpleChanges) {
    if(changes["data"] && !changes["data"].firstChange) {
      this.data = {...changes["data"].currentValue};
    }
  }

  translateType(type: string, status: string) {
    if(type == "photo")
      return "Hình ảnh";
    else if(type == "video_inline" && status == "added_video")
      return "Video";
    else if(type == "video_inline" && status == "mobile_status_update")
      return "Chia sẻ";
    else if(type == "share" || type == "native_templates")
      return "Post";
    else if(type == "cover_photo" && status == "added_photos")
      return "Cập nhật ảnh";
    else if(type == "knowledge_note")
      return "Ghi chú";
    else if(type == "profile_media" && status == "added_photos")
      return "Cập nhật ảnh";
    else
      return type;
  }

  refetch() {
    this.facebookPostService.refetch(this.data.fbid).pipe(takeUntil(this.destroy$))
      .subscribe((res: any) => {
        if (res.id === this.data.fbid) {
          this.data.count_comments = res.count_comments;
        }
      }, error => {
        this.message.error('Refetch bài viết đã xảy ra lỗi');
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

}
