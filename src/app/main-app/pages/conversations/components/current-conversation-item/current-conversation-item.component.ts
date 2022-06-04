import { TDSHelperObject, TDSSafeAny } from 'tmt-tang-ui';
import { ChangeDetectorRef, Component, Input, OnChanges, OnInit, Output, SimpleChanges, EventEmitter, ViewChild, ElementRef, AfterViewInit, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ConversationMatchingItem } from 'src/app/main-app/dto/conversation-all/conversation-all.dto';
import { CRMTeamDTO } from 'src/app/main-app/dto/team/team.dto';
import { DraftMessageService } from 'src/app/main-app/services/conversation/draft-message.service';
import { CRMTeamService } from 'src/app/main-app/services/crm-team.service';
import { ConversationEventFacade } from 'src/app/main-app/services/facades/conversation-event.facade';
import { TDSMessageService } from 'tmt-tang-ui';

@Component({
    selector: 'current-conversation-item',
    templateUrl: './current-conversation-item.component.html',
    styleUrls: ['./current-conversation-item.component.scss'],
    encapsulation: ViewEncapsulation.None
})

export class CurrentConversationItemComponent  implements OnInit, OnChanges {

  @Input() isFastSend: boolean | undefined;
  @Input() item!: ConversationMatchingItem;
  @Input() team!: CRMTeamDTO;
  @Input() type: any;
  @Input() psid: any;
  @Input() activeCvsItem!: ConversationMatchingItem;
  @Input() isOpenCollapCheck!: boolean;
  @Input() checked!: boolean;

  @Output() checkedChange = new EventEmitter<boolean>();

  eventData: any;
  isDraftMessage: boolean = false;
  isConversationOver: boolean = false;
  isChoose!: TDSSafeAny;

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

  // TODO: refactor
  prepareModel(item: ConversationMatchingItem) {
    item.LastActivityTimeConverted = item.LastUpdated;
    let lastActivity = item.last_activity;
    if(lastActivity) {
      item.LastActivityTimeConverted = item.LastActivityTimeConverted || lastActivity.created_time;
    }
    //check send message
    item['checkSendMessage'] = false;
    //tags
    item['keyTags'] = {};
    if(TDSHelperObject.hasValue(item.tags)) {
      item.tags.map((x: any) => {
          (item['keyTags'] as any)[x.id] = true;
      })
    }  else {
      item.tags = [];
    }
    return item;
  }

  ngOnChanges(changes: SimpleChanges): void {
    if(changes["activeCvsItem"] && !changes["activeCvsItem"].firstChange) {
        this.activeCvsItem = changes["activeCvsItem"].currentValue;
        this.cdr.detectChanges();
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

  changeEllipsis(ev: TDSSafeAny){
    // ev.stopPropagation();
  }

  changeCheck(ev: TDSSafeAny){
    if(ev)
      this.checkedChange.emit(ev.checked)
  }

  clickCheckbox(ev: TDSSafeAny){
    ev.preventDefault()
  }
}
