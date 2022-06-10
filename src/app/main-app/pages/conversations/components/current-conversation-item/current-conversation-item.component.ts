import { TDSSafeAny } from 'tmt-tang-ui';
import { Component, Input, OnChanges, OnInit, Output, SimpleChanges, EventEmitter, ChangeDetectionStrategy, AfterViewChecked, ChangeDetectorRef } from '@angular/core';
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
    private cdRef: ChangeDetectorRef,
    public crmService: CRMTeamService,
    public activatedRoute: ActivatedRoute,
    public router: Router) {
  }

  ngAfterViewChecked() {
    this.cdRef.detectChanges();
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

  changeCheck(ev: TDSSafeAny){
    this.checkedChange.emit(!this.checked);
    ev.preventDefault();
  }

}
