import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnChanges, OnInit, Optional, Output, Self, SimpleChanges, TemplateRef, ViewContainerRef, Host, OnDestroy } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { TDSHelperObject, TDSHelperString, TDSMessageService, TDSModalService } from 'tmt-tang-ui';
import { ActiveMatchingItem } from '../../dto/conversation-all/conversation-all.dto';
import { CRMTeamDTO } from '../../dto/team/team.dto';
import { CRMTeamService } from '../../services/crm-team.service';
import { ActivityDataFacade } from '../../services/facades/activity-data.facade';
import { finalize, takeUntil } from 'rxjs/operators';
import { MakeActivityItem, MakeActivityMessagesDTO } from '../../dto/conversation/make-activity.dto';
import { ApplicationUserService } from '../../services/application-user.service';

@Component({
  selector: 'tds-conversations',
  templateUrl: './tds-conversations.component.html',
  styleUrls: ['./tds-conversations.component.sass'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})

export class TDSConversationsComponent implements OnInit, OnChanges, OnDestroy {

  @Input() tdsHeader?: string | TemplateRef<void>;
  @Input() data!: ActiveMatchingItem;
  @Input() type!: string;
  @Input() team!: CRMTeamDTO;
  @Output() onLoadMiniChat = new EventEmitter();

  private destroy$ = new Subject();
  isLoadMessage: boolean = false;
  inputValue?: string;
  dataSource$!: Observable<MakeActivityMessagesDTO>;
  partner: any;
  lstUser!: any[];

  constructor(private modalService: TDSModalService,
      private crmTeamService: CRMTeamService,
      private message: TDSMessageService,
      private applicationUserService: ApplicationUserService,
      private activityDataFacade: ActivityDataFacade,
      private viewContainerRef: ViewContainerRef) {
  }

  ngOnInit() {
    if(this.data?.id && this.team && TDSHelperString.hasValueString(this.type)){
        this.loadMessages(this.data);
    }
    this.loadUser();
  }

  //TODO: data.id = data.psid
  loadMessages(data: ActiveMatchingItem): any {
    this.isLoadMessage = true;
    this.dataSource$ = this.activityDataFacade.makeActivity(this.team?.Facebook_PageId, data.psid, this.type)
      .pipe(takeUntil(this.destroy$))
      .pipe(finalize(() => {this.isLoadMessage = false }));

    // this.activityDataFacade.refreshData(this.team.Facebook_PageId, data.psid, this.type)
    //   .pipe(takeUntil(this.destroy$)).pipe(finalize(() => {this.isLoadMessage = false }))
    //   .subscribe(() => {
    //       this.dataSource$ = this.activityDataFacade.makeActivity(this.team.Facebook_PageId, data.psid, this.type);
    //   }, error => {
    //     this.message.error('Load message đã xảy ra lỗi!');
    //   })
  }

  loadUser() {
    this.applicationUserService.dataActive$.pipe(takeUntil(this.destroy$))
      .subscribe((res: any) => {
          this.lstUser = res;
      }, error => {
        this.message.error('Load user đã xảy ra lỗi');
      })
  }

  onClickDropdown(e: MouseEvent) {
    e.stopPropagation();
  }

  showImageStore(): void {
  }

  loadEmojiMart(event: any) {
  }

  ngOnChanges(changes: SimpleChanges) {
    if(changes["data"] && !changes["data"].firstChange) {
        this.data = changes["data"].currentValue;
        this.loadMessages(this.data);
    }
  }

  getExtrasChildren(data: any, item: any) {
      return (data?.extras?.children[item?.id] as any) || {};
  }

  getExtrasPosts(data: any, item: MakeActivityItem) {
      return (data?.extras?.posts[item?.object_id] as any) || {};
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

}
