import { ChangeDetectorRef, Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ActiveMatchingItem } from 'src/app/main-app/dto/conversation-all/conversation-all.dto';
import { CRMTeamDTO } from 'src/app/main-app/dto/team/team.dto';
import { DraftMessageService } from 'src/app/main-app/services/conversation/draft-message.service';
import { CRMTeamService } from 'src/app/main-app/services/crm-team.service';
import { ConversationEventFacade } from 'src/app/main-app/services/facades/conversation-event.facade';
import { TDSMessageService } from 'tmt-tang-ui';

@Component({
    selector: 'current-conversation-item',
    templateUrl: './current-conversation-item.component.html',
})

export class CurrentConversationItemComponent  implements OnInit, OnChanges {

  @Input() isFastSend: boolean | undefined;
  @Input() item!: ActiveMatchingItem;
  @Input() team!: CRMTeamDTO;
  @Input() type: any;
  @Input() psid: any;
  @Input() activeMatchingItem!: ActiveMatchingItem;

  eventData: any;
  isDraftMessage: boolean = false;

  constructor(private message: TDSMessageService,
      private draftMessageService: DraftMessageService,
      private conversationEventFacade: ConversationEventFacade,
      public crmService: CRMTeamService,
      private cdr: ChangeDetectorRef,
      public activatedRoute: ActivatedRoute,
      public router: Router) {
  }

  ngOnInit(): void {
    if(this.item) {
      this.prepareModel(this.item);
    }

    this.eventData = this.conversationEventFacade.getEvent();
    let draftMessage = this.draftMessageService.getMessageByASIds(this.item.psid) as any;

    if(draftMessage.messages || draftMessage.images.length > 0) {
        this.isDraftMessage = true;
    }

    this.draftMessageService.onIsDraftMessage$.subscribe((res: any) => {
      if(this.psid == res.psid) {
          this.isDraftMessage = res.isDraftMessage;
          this.cdr.detectChanges();
      }
    });
  }

  prepareModel(item: ActiveMatchingItem) {
    item.LastActivityTimeConverted = item.LastUpdated;
    let lastActivity = item.last_activity;
    if(lastActivity) {
      item.LastActivityTimeConverted = item.LastActivityTimeConverted || lastActivity.created_time;
    }
    // //check send message
    // item["checkSendMessage"] = false;
    // //tags
    // item["keyTags"] = {};
    // if(item.tags && item.tags.length > 0) {
    //   item.tags.map((x: any) => {
    //       item["keyTags"][x.id] = true;
    //   })
    // }
    // else {
    //   item.tags = [];
    // }
  }

  ngOnChanges(changes: SimpleChanges): void {
    if(changes["activeMatchingItem"] && !changes["activeMatchingItem"].firstChange) {
        this.activeMatchingItem = changes["activeMatchingItem"].currentValue;
    }
  }

  getLastActivity() {
    if(this.type && this.type == "message" && this.item && this.item.last_message) {
        return this.item.last_message;
    }
    else if(this.type && this.type == "comment" && this.item && this.item.last_comment){
        return this.item.last_comment;
    }
    else if(this.item && this.item.last_activity) {
        return this.item.last_activity || {};
    }

    return null;
  }

}
