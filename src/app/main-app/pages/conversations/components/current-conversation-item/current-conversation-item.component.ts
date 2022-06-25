import { TDSResizeObserver } from 'tds-ui/core/resize-observers';
import { Component, Input, OnChanges, OnInit, Output, SimpleChanges, EventEmitter, ChangeDetectionStrategy, AfterViewInit, ViewChildren, QueryList, ElementRef, ChangeDetectorRef, ViewChild, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ConversationMatchingItem } from 'src/app/main-app/dto/conversation-all/conversation-all.dto';
import { CRMTeamDTO } from 'src/app/main-app/dto/team/team.dto';
import { DraftMessageService } from 'src/app/main-app/services/conversation/draft-message.service';
import { CRMTeamService } from 'src/app/main-app/services/crm-team.service';
import { ConversationEventFacade } from 'src/app/main-app/services/facades/conversation-event.facade';
import { TDSMessageService } from 'tds-ui/message';
import { TDSSafeAny } from 'tds-ui/shared/utility';
import { Subject, takeUntil } from 'rxjs';

@Component({
    selector: 'current-conversation-item',
    templateUrl: './current-conversation-item.component.html',
    styleUrls: ['./current-conversation-item.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    host:{
      'class':'block w-full'
    }
})

export class CurrentConversationItemComponent  implements OnInit, OnChanges, AfterViewInit,OnDestroy {

  @Input() isFastSend: boolean | undefined;
  @Input() item!: ConversationMatchingItem;
  @Input() team!: CRMTeamDTO;
  @Input() type: any;
  @Input() psid: any;
  @Input() activeCvsItem!: ConversationMatchingItem;
  @Input() isOpenCollapCheck!: boolean;
  @Input() checked!: boolean;
  @Output() checkedChange = new EventEmitter<boolean>();

  // @ViewChild
  @ViewChild('currentWidthTag') currentWidthTag!:  ElementRef<TDSSafeAny>;
  @ViewChildren('widthTag') widthTag!: QueryList<ElementRef>;

  private destroy$ = new Subject<void>();

  eventData: any;
  isDraftMessage: boolean = false;
  isConversationOver: boolean = false;
  isChoose!: TDSSafeAny;
  totalWidthTag :number =0;
  plusWidthTag: number = 0;
  gapTag: number = 4;
  displayTag: number = 0;
  countHiddenTag = 0;
  countNgafterview = 0;

  constructor(private message: TDSMessageService,
      private draftMessageService: DraftMessageService,
      private conversationEventFacade: ConversationEventFacade,
      public crmService: CRMTeamService,
      public activatedRoute: ActivatedRoute,
      public router: Router,
      public cdr:ChangeDetectorRef,
      public element : ElementRef,
      private resizeObserver: TDSResizeObserver) {
  }

  ngOnDestroy(): void {
   this.destroy$.next();
   this.destroy$.complete();
  }

  ngOnInit(): void {
    if(this.item) {

      this.eventData = this.conversationEventFacade.getEvent();
      let draftMessage = this.draftMessageService.getMessageByASIds(this.item.psid) as any;

      if(draftMessage.messages || draftMessage.images.length > 0) {
          this.isDraftMessage = true;
      }

      this.draftMessageService.onIsDraftMessage$.subscribe((res: any) => {
        if(this.psid == res.psid) {
          this.isDraftMessage = res.isDraftMessage;
        }
      });
      this.displayTag = this.item.tags.length;
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    if(changes["activeCvsItem"] && !changes["activeCvsItem"].firstChange) {
        this.activeCvsItem = changes["activeCvsItem"].currentValue;
    }
  }

  ngAfterViewInit(): void {
    this.resizeObserver
    .observe(this.element)
    .pipe(takeUntil(this.destroy$))
    .subscribe(() => {
      this.totalWidthTag = this.currentWidthTag.nativeElement.clientWidth;
      this.onSetWidthTag();
    });
  }

  onSetWidthTag(){
    this.countNgafterview += 1;
    let widthItemPlush = 30;
    if(this.plusWidthTag >= this.totalWidthTag - widthItemPlush){
      widthItemPlush = 0
    }
    this.displayTag = 0;
    this.plusWidthTag = 0;
    this.widthTag.forEach(x=> {
      if(this.plusWidthTag >= this.totalWidthTag - widthItemPlush){
        return
      }
      this.displayTag += 1;
      this.plusWidthTag = this.plusWidthTag + x.nativeElement?.offsetWidth + this.gapTag;
    });
    this.countHiddenTag = this.item.tags.length - this.displayTag;
    if(this.countNgafterview > 1){
      this.cdr.detectChanges();
    }
  }

  // getLastActivity() {
  //   if(this.type && this.type == "message" && this.item && this.item.last_message) return this.item.last_message;
  //   else if(this.type && this.type == "comment" && this.item && this.item.last_comment) return this.item.last_comment;
  //   else if(this.item && this.item.last_activity) return this.item.last_activity || {};

  //   return null;
  // }

  changeCheck(ev: TDSSafeAny){
    this.checkedChange.emit(!this.checked);
    ev.preventDefault();
    ev.stopImmediatePropagation();
  }

  seenedMessage(){
    return (this.type == 'all' && this.item.count_unread_activities > 0) || (this.type == 'message' && this.item.count_unread_messages > 0) || (this.type == 'comment' && this.item.count_unread_comments > 0)
  }

}
