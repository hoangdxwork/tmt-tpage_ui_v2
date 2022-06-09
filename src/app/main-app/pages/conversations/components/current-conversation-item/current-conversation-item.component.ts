import { TDSSafeAny } from 'tmt-tang-ui';
import { Component, Input, OnChanges, OnInit, Output, SimpleChanges, EventEmitter, ChangeDetectionStrategy, AfterViewChecked } from '@angular/core';
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
    changeDetection: ChangeDetectionStrategy.OnPush
})

export class CurrentConversationItemComponent  implements OnInit, OnChanges, AfterViewChecked {

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
    public activatedRoute: ActivatedRoute,
    public router: Router) {
  }

  ngAfterViewChecked() {
  }

  ngOnInit(): void {
    this.eventData = this.conversationEventFacade.getEvent();
    let draftMessage = this.draftMessageService.getMessageByASIds(this.item.psid) as any;

    if(draftMessage.messages || draftMessage.images.length > 0) {
        this.isDraftMessage = true;
    }

    this.draftMessageService.onIsDraftMessage$.subscribe((res: any) => {
      if(this.psid == res.psid) {
        this.isDraftMessage = res.isDraftMessage;
      }
    })
  }

  ngOnChanges(changes: SimpleChanges): void {
    if(changes["activeCvsItem"] && !changes["activeCvsItem"].firstChange) {
        this.activeCvsItem = changes["activeCvsItem"].currentValue;
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

  changeCheck(ev: TDSSafeAny){
    this.checkedChange.emit(!this.checked);
    ev.preventDefault();
  }

}
