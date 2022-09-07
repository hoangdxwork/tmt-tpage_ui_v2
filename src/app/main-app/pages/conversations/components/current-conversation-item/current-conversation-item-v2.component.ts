import { TDSResizeObserver } from 'tds-ui/core/resize-observers';
import { Component, Input, OnChanges, OnInit, Output, SimpleChanges, EventEmitter, ChangeDetectionStrategy, AfterViewInit, ViewChildren, QueryList, ElementRef, ChangeDetectorRef, ViewChild, OnDestroy, DoCheck } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CRMTeamDTO } from 'src/app/main-app/dto/team/team.dto';
import { CRMTeamService } from 'src/app/main-app/services/crm-team.service';
import { ConversationEventFacade } from 'src/app/main-app/services/facades/conversation-event.facade';
import { TDSMessageService } from 'tds-ui/message';
import { TDSHelperArray, TDSSafeAny } from 'tds-ui/shared/utility';
import { Subject, takeUntil } from 'rxjs';
import { ChatomniConversationItemDto } from 'src/app/main-app/dto/conversation-all/chatomni/chatomni-conversation';
import { TDSDestroyService } from 'tds-ui/core/services';
import { ChatomniEventEmiterService } from '@app/app-constants/chatomni-event/chatomni-event-emiter.service';

@Component({
    selector: 'current-conversation-item-v2',
    templateUrl: './current-conversation-item-v2.component.html',
    styleUrls: ['./current-conversation-item.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    host:{
      'class':'block w-full'
    },
    providers: [ TDSDestroyService ]
})

export class CurrentConversationItemV2Component  implements OnInit, OnChanges, AfterViewInit {

  @Input() isFastSend: boolean | undefined;
  @Input() item!: ChatomniConversationItemDto;
  @Input() team!: CRMTeamDTO;
  @Input() type: any;
  @Input() csid: any;
  @Input() conversationItem!: ChatomniConversationItemDto;
  @Input() isOpenCollapCheck!: boolean;
  @Input() checked!: boolean;
  @Input() state!: any;

  @Output() checkedChange = new EventEmitter<boolean>();

  // @ViewChild
  @ViewChild('currentWidthTag') currentWidthTag!:  ElementRef<TDSSafeAny>;
  @ViewChildren('widthTag') widthTag!: QueryList<ElementRef>;

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
    private conversationEventFacade: ConversationEventFacade,
    public crmService: CRMTeamService,
    public activatedRoute: ActivatedRoute,
    public router: Router,
    public cdRef:ChangeDetectorRef,
    public element : ElementRef,
    private resizeObserver: TDSResizeObserver,
    private chatomniEventEmiterService: ChatomniEventEmiterService,
    private destroy$: TDSDestroyService) {
  }

  ngOnInit(): void {
    if(this.item) {
      this.eventData = this.conversationEventFacade.getEvent();
      console.log(this.eventData)
      if(TDSHelperArray.hasListValue(this.item?.Tags)) {
          this.displayTag = this.item?.Tags?.length || 0;
      }
    }

    this.eventEmitter();
  }

  eventEmitter(): void {
    // TODO: Cập nhật tin tin nhắn chưa đọc
    this.chatomniEventEmiterService.updateMarkSeenBadge$.pipe(takeUntil(this.destroy$)).subscribe(res => {
      if(res){

          let exits = this.item.ConversationId == res.csid && this.team?.ChannelId == res.pageId && this.type == res.type;
          if(exits) {
            this.item.CountUnread = 0;
          }

          this.cdRef.detectChanges();
          this.destroy$.complete();
      }
    })
  }

  ngOnChanges(changes: SimpleChanges): void {
    if(changes["conversationItem"] && !changes["conversationItem"].firstChange) {
        this.conversationItem = changes["conversationItem"].currentValue;
    }

    if(changes["state"] && !changes["state"].firstChange) {
      this.state = changes["state"].currentValue;
      this.item.State = this.state;
    }

    if(changes["item"] && !changes["item"].firstChange) {
      this.item = changes["item"].currentValue;
      this.totalWidthTag = this.currentWidthTag.nativeElement.clientWidth;
      this.plusWidthTag = 0;
      setTimeout(() => {
        this.onSetWidthTag();
      }, 150);
    }
  }

  ngAfterViewInit(): void {
    this.resizeObserver.observe(this.element).pipe(takeUntil(this.destroy$)).subscribe(() => {
        this.totalWidthTag = this.currentWidthTag.nativeElement.clientWidth;
        this.onSetWidthTag();
    });
  }

  setWithTag(widthItemPlush: number){
    this.widthTag.forEach(x=> {
      if(this.plusWidthTag >= this.totalWidthTag - widthItemPlush){
        return
      }
      this.displayTag += 1;
      this.plusWidthTag = this.plusWidthTag + x.nativeElement?.offsetWidth + this.gapTag;
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

    this.setWithTag(widthItemPlush)

    if(TDSHelperArray.hasListValue(this.item?.Tags)) {
      this.countHiddenTag = (this.item.Tags!.length - this.displayTag) || 0;
    }

    this.cdRef.detectChanges();
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
