import { TDSMessageService } from 'tds-ui/message';
import { ChatomniConversationService } from '@app/services/chatomni-service/chatomni-conversation.service';
import { CRMTagDTO } from './../../../../dto/crm-tag/odata-crmtag.dto';
import { startOfMonth, endOfMonth, startOfYesterday, endOfYesterday, subDays } from 'date-fns';
import { ApplicationUserService } from './../../../../services/application-user.service';
import { CRMTagService } from './../../../../services/crm-tag.service';
import { Component, OnInit, Input, Output, EventEmitter, SimpleChanges, OnChanges, ChangeDetectorRef } from '@angular/core';
import { TDSHelperArray, TDSSafeAny, TDSHelperString, TDSHelperObject } from 'tds-ui/shared/utility';
import { TDSI18nService, vi_VN } from 'tds-ui/i18n';
import { QueryFilterConversationDto } from '@app/dto/conversation-all/chatomni/chatomni-conversation';
import { CRMTeamService } from '@app/services/crm-team.service';
import { Observable, takeUntil } from 'rxjs';
import { TDSDestroyService } from 'tds-ui/core/services';
import { ApplicationUserDTO } from '@app/dto/user/application-user.dto';

@Component({
  selector: 'conversation-all-filter',
  templateUrl: './conversation-all-filter.component.html',
  providers: [ TDSDestroyService ]
})

export class ConversationAllFilterComponent implements OnInit, OnChanges {

  @Input() queryObj!: QueryFilterConversationDto;
  @Input() totalConversations: number = 0;
  @Output() onSubmitFilter: EventEmitter<any> = new EventEmitter();

  visibleDrawerFillter: boolean = false;
  dateTimes!: any[];

  lstUser!: ApplicationUserDTO[];
  lstUserSearch!: ApplicationUserDTO[];

  lstOfTag: CRMTagDTO[] = [];
  lstOfTagSearch: CRMTagDTO[] = [];

  keyFilterTag: string = '';
  keyFilterUser: string = '';
  isFilter!: boolean;

  dateRanges = {
    'Hôm nay': [new Date(), new Date()],
    'Hôm qua': [startOfYesterday(), endOfYesterday()],
    '7 ngày trước': [subDays(new Date(), 7), new Date()],
    '30 ngày trước': [subDays(new Date(), 30), new Date()],
    'Tháng này': [startOfMonth( new Date()), endOfMonth(new Date())],
  } as any;

  constructor(private crmTeamService: CRMTeamService,
    private crmTagService: CRMTagService,
    private applicationUserService: ApplicationUserService,
    private destroy$: TDSDestroyService,
    private i18n: TDSI18nService,
    private chatomniConversationService: ChatomniConversationService,
    private message: TDSMessageService) {
      this.i18n.setLocale(vi_VN);
  }

  ngOnInit(): void {
    this.loadUserActive();
    this.removeQueryObjConversation();

    this.crmTagService.dataActive$.pipe(takeUntil(this.destroy$)).subscribe({
      next: (tags: CRMTagDTO[]) => {
          this.lstOfTag = [...tags];
          this.lstOfTag = this.lstOfTag.sort((a, b) => (a.Name.length) - (b.Name.length));
          this.lstOfTagSearch = this.lstOfTag;
      }
    })
  }

  loadUserActive() {
    this.applicationUserService.setUserActive();
    this.applicationUserService.getUserActive().pipe(takeUntil(this.destroy$)).subscribe({
      next: (res: ApplicationUserDTO[]) => {
          this.lstUser = [...res];;
          this.lstUser = this.lstUser.sort((a, b) => (a.Name.length) - (b.Name.length));
          this.lstUserSearch = this.lstUser;
      }
    })
  }

  ngOnChanges(changes: SimpleChanges) {
    if(changes["totalConversations"] && !changes["totalConversations"].firstChange) {
        this.totalConversations = changes["totalConversations"].currentValue as number;
    }

    if(changes["queryObj"] && !changes["queryObj"].firstChange) {
      this.queryObj = {...changes["queryObj"].currentValue};
      if(Object.keys(this.queryObj).length > 0){
        if(this.queryObj.sort && this.queryObj.sort.length > 0 && Object.keys(this.queryObj).length == 1) {
          this.isFilter = false;
        } else {
          this.isFilter = true;
        }
      } else {
        this.isFilter = false;
      }
      this.setQueryObjConversation(this.queryObj);
    }
  }

  openDrawerFillter() {
    this.queryObj = {} as any;
    this.visibleDrawerFillter = true;

    let saveQueryObj = this.getQueryObjConversation()
    if(saveQueryObj) {
      this.queryObj = {...saveQueryObj};

      if(saveQueryObj.start && saveQueryObj.end){
        this.dateTimes[0] = saveQueryObj.start || null;
        this.dateTimes[1] = saveQueryObj.end || null;
      } else {
        this.dateTimes = [];
      }

      let a = saveQueryObj['user_ids']
      if(saveQueryObj['user_ids']) {
       
        this.queryObj['user_ids'] == saveQueryObj['user_ids'];
      }

    }
  }

  closeDrawerFillter(): void {
    this.visibleDrawerFillter = false;
  }

  onChangeDate(value: Date[]): void {
    this.dateTimes = value;
    if(this.dateTimes) {
        this.queryObj['start'] = (this.dateTimes[0])?.toISOString();
        this.queryObj['end'] = this.dateTimes[1]?.toISOString();
    }
  }

  onSelectTag(item: CRMTagDTO) {
    let ids: any = [];
    if(this.queryObj['tag_ids'] && this.queryObj['tag_ids'].length > 0) {
        ids = this.queryObj['tag_ids'];
    }

    let exits = ids?.find((x: any) => x == item.Id);
    if(exits) {
        ids = ids.filter((x: any)  => x != item.Id);
    } else {
        ids.push(item.Id);
    }

    this.queryObj['tag_ids'] = [...ids];
  }

  selectUser(item: ApplicationUserDTO) {
    let ids: any = [];
    if(this.queryObj['user_ids'] && this.queryObj['user_ids'].length > 0) {
        ids = this.queryObj['user_ids'];
    }

    let exits = ids?.find((x: any) => x == item.Id);
    if(exits) {
        ids = ids.filter((x: any)  => x != item.Id);
    } else {
        ids.push(item.Id);
    }

    this.queryObj['user_ids'] = [...ids];
  }

  clearFilter() {
    this.isFilter = false;
    this.keyFilterUser = '';
    this.keyFilterTag = '';
    this.totalConversations = 0;
    this.queryObj = {} as any;
    this.removeQueryObjConversation();

    this.onSubmitFilter.emit(this.queryObj);
    this.closeDrawerFillter()
  }

  onSearchTags(event: any) {
    let value = TDSHelperString.stripSpecialChars(this.keyFilterTag.trim());
    this.lstOfTag = this.lstOfTagSearch.filter(x => (x.Name && TDSHelperString.stripSpecialChars(x.Name.toLowerCase()).indexOf(TDSHelperString.stripSpecialChars(value.toLowerCase())) !== -1));
  }

  onSearchUser(event: any) {
    let value = TDSHelperString.stripSpecialChars(this.keyFilterUser.trim());
    this.lstUser = this.lstUserSearch.filter(x => (x.Name && TDSHelperString.stripSpecialChars(x.Name.toLowerCase()).indexOf(TDSHelperString.stripSpecialChars(value.toLowerCase())) !== -1));
  }

  onSubmit(): void {
    if(!TDSHelperObject.hasValue(this.queryObj)){
        this.message.error("Vui lòng chọn điều kiện lọc!");
        return
    } else if(Object.keys(this.queryObj).length == 0) {
        this.message.error("Vui lòng chọn điều kiện lọc!");
        return
    }

    this.isFilter = true;
    this.totalConversations = 0;

    this.onSubmitFilter.emit(this.queryObj);
    this.closeDrawerFillter();
  }

  onChangeHasPhone(event: boolean) {
    if(event == true) {
        this.queryObj['has_phone'] = event;
        this.queryObj['not_phone'] = false;
    } else {
        delete this.queryObj['has_phone'];
    }
  }

  onChangeNotPhone(event: boolean) {
    if(event == true) {
        this.queryObj['not_phone'] = event;
        this.queryObj['has_phone'] = false;
    } else {
        delete this.queryObj['not_phone'];
    }
  }

  onChangeHasAddress(event: boolean) {
    if(event == true) {
        this.queryObj['has_address'] = event;
        this.queryObj['not_address'] = false;
    } else {
        delete this.queryObj['has_address'];
    }
  }

  onChangeNotAddress(event: boolean) {
    if(event == true) {
        this.queryObj['not_address'] = event;
        this.queryObj['has_address'] = false;
    } else {
        delete this.queryObj['not_address'];
    }
  }

  onChangeHasUnread(event: boolean) {
    if(event == true) {
        this.queryObj['has_unread'] = event;
    } else {
        delete this.queryObj['has_unread'];
    }
  }

  setQueryObjConversation(queryObj: QueryFilterConversationDto): any {
    const _keyCache = this.chatomniConversationService._keyQueryObj_conversation_all;
    localStorage.setItem(_keyCache, JSON.stringify(queryObj));
  }

  getQueryObjConversation(): any {
    const _keyCache = this.chatomniConversationService._keyQueryObj_conversation_all;
    let item = localStorage.getItem(_keyCache) as any;

    if(item) {
        return JSON.parse(item);
    } else {
        return null;
    }
  }

  removeQueryObjConversation() {
    const _keyCache = this.chatomniConversationService._keyQueryObj_conversation_all;
    localStorage.removeItem(_keyCache);
  }

}
