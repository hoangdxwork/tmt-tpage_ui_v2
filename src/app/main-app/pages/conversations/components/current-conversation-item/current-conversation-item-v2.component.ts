import { TDSResizeObserver } from 'tds-ui/core/resize-observers';
import { Component, Input, OnChanges, OnInit, Output, SimpleChanges, EventEmitter, ChangeDetectionStrategy, AfterViewInit, ViewChildren, QueryList, ElementRef, ChangeDetectorRef, ViewChild, OnDestroy, DoCheck } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ConversationMatchingItem, StateChatbot } from 'src/app/main-app/dto/conversation-all/conversation-all.dto';
import { CRMTeamDTO } from 'src/app/main-app/dto/team/team.dto';
import { DraftMessageService } from 'src/app/main-app/services/conversation/draft-message.service';
import { CRMTeamService } from 'src/app/main-app/services/crm-team.service';
import { ConversationEventFacade } from 'src/app/main-app/services/facades/conversation-event.facade';
import { TDSMessageService } from 'tds-ui/message';
import { TDSHelperArray, TDSSafeAny } from 'tds-ui/shared/utility';
import { Subject, takeUntil } from 'rxjs';
import { CrmMatchingV2Detail } from 'src/app/main-app/dto/conversation-all/crm-matching-v2/crm-matching-v2.dot';
import { ChatomniConversationItemDto } from 'src/app/main-app/dto/conversation-all/chatomni/chatomni-conversation';

@Component({
    selector: 'current-conversation-item-v2',
    templateUrl: './current-conversation-item-v2.component.html',
    styleUrls: ['./current-conversation-item.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    host:{
      'class':'block w-full'
    }
})

export class CurrentConversationItemV2Component  implements OnInit, OnChanges, AfterViewInit, OnDestroy {

  @Input() isFastSend: boolean | undefined;
  @Input() item!: ChatomniConversationItemDto;
  @Input() team!: CRMTeamDTO;
  @Input() type: any;
  @Input() csid: any;
  @Input() omcs_Item!: ChatomniConversationItemDto;
  @Input() isOpenCollapCheck!: boolean;
  @Input() checked!: boolean;
  @Input() state!: StateChatbot | null;

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
  displayTag: number = 0 ;
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
      let draftMessage = this.draftMessageService.getMessageByASIds(this.item.ConversationId) as any;

      if(draftMessage.messages || draftMessage.images.length > 0) {
          this.isDraftMessage = true;
      }

      // this.draftMessageService.onIsDraftMessage$.subscribe((res: any) => {
      //   if(this.csid == res.psid) {
      //     this.isDraftMessage = res.isDraftMessage;
      //   }
      // });

      if(TDSHelperArray.hasListValue(this.item?.Tags)) {
          this.displayTag = this.item?.Tags?.length || 0;
      }
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    if(changes["omcs_Item"] && !changes["omcs_Item"].firstChange) {
        this.omcs_Item = changes["omcs_Item"].currentValue;
    }

    if(changes["state"] && !changes["state"].firstChange) {
      this.state = changes["state"].currentValue;
      this.item.State = this.state;
    }
  }

  ngAfterViewInit(): void {
    this.resizeObserver.observe(this.element).pipe(takeUntil(this.destroy$)).subscribe(() => {
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

    if(TDSHelperArray.hasListValue(this.item?.Tags)) {
      this.countHiddenTag = (this.item.Tags!.length - this.displayTag) || 0;
    }

    if(this.countNgafterview > 1){
      this.cdr.detectChanges();
    }
  }

  changeCheck(ev: TDSSafeAny){
    this.checkedChange.emit(!this.checked);
    ev.preventDefault();
    ev.stopImmediatePropagation();
  }

  seenedMessage(){
    return (this.type == 'all' && this.item.CountUnread > 0) || (this.type == 'message' && this.item.CountUnread > 0) || (this.type == 'comment' && this.item.CountUnread > 0)
  }

}
