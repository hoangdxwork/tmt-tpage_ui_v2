import { CRMTagDTO } from './../../../../dto/crm-tag/odata-crmtag.dto';
import { startOfMonth, endOfMonth, startOfYesterday, endOfYesterday, subDays } from 'date-fns';
import { ApplicationUserService } from './../../../../services/application-user.service';
import { CRMMatchingService } from './../../../../services/crm-matching.service';
import { CRMTagService } from './../../../../services/crm-tag.service';
import { FormGroup, FormBuilder } from '@angular/forms';
import { Component, OnInit, Input, Output, EventEmitter, SimpleChanges, OnChanges } from '@angular/core';
import { CRMTeamDTO } from 'src/app/main-app/dto/team/team.dto';
import { TDSHelperArray, TDSHelperObject, TDSSafeAny, TDSHelperString } from 'tds-ui/shared/utility';
import { TDSI18nService, vi_VN } from 'tds-ui/i18n';

@Component({
  selector: 'conversation-all-filter',
  templateUrl: './conversation-all-filter.component.html',
})
export class ConversationAllFilterComponent implements OnInit, OnChanges {

  _form !: FormGroup;

  @Input() team!: CRMTeamDTO;
  @Input() totalCount!: number;
  @Output() onFilter: EventEmitter<any> = new EventEmitter();

  visibleDrawerFillter: boolean = false;
  rangeDate!: Date;
  keyTags: any = {};
  tags: CRMTagDTO[] = [];
  users: TDSSafeAny[] = [];
  total: number = 0;
  daterange: Date[] = [];
  toggle_Key: boolean = true;
  filtered: boolean = false;
  keyFilterTag!: string;
  lstOfTag: CRMTagDTO[] = [];

  leftControl = {
    'Hôm nay': [new Date(), new Date()],
    'Hôm qua': [startOfYesterday(), endOfYesterday()],
    '7 ngày trước': [subDays(new Date(), 7), new Date()],
    '30 ngày trước': [subDays(new Date(), 30), new Date()],
    'Tháng này': [startOfMonth( new Date()), endOfMonth(new Date())],
  };

  constructor(private fb: FormBuilder,
    private crmTagService: CRMTagService,
    private crmMatchingService: CRMMatchingService,
    private applicationUserService: ApplicationUserService,
    private i18n: TDSI18nService) {
      this.createForm();
  }

  ngOnChanges(simpleChange: SimpleChanges) {
    if (simpleChange.totalCount) {
      this.total = simpleChange.totalCount.currentValue || 0;
    }
    if (simpleChange.team) {
      this.resetFilter();
    }
    if (simpleChange.totalCount && simpleChange.totalCount.currentValue < 0 && TDSHelperObject.hasValue(this.prepareValues())) {
      this.resetFilter();
    }
  }

  ngOnInit(): void {
    this.i18n.setLocale(vi_VN);
    this.applicationUserService.dataSource$.subscribe((res) => {
      if (this.crmMatchingService.queryObj.user_ids && TDSHelperArray.hasListValue(res)) {
        res.forEach((element: TDSSafeAny) => {

          let value = this.crmMatchingService.queryObj.user_ids
            .split(",")
            .find((x: TDSSafeAny) => x === element.Id);

          if (value) {
            element.selected = true;
          }
        });
      }
      this.users = res.sort((one:any, two:any) => (one.Name.length < two.Name.length ? -1 : 1));
    });

    this.crmTagService.dataSource$.subscribe((res: CRMTagDTO[]) => {
      if (this.crmMatchingService.queryObj.tag_ids && TDSHelperArray.hasListValue(res)) {
        res.forEach((element: TDSSafeAny) => {

          let value = this.crmMatchingService.queryObj.tag_ids
            .split(",")
            .find((x: TDSSafeAny) => x === element.Id);

          if (value) {
            this.keyTags[element.Id] = true;
          }
        });
      }
      if(TDSHelperArray.hasListValue(res)){
        this.tags = res.sort((one:any, two:any) => (one.Name.length < two.Name.length ? -1 : 1));
        this.lstOfTag = res.sort((one:any, two:any) => (one.Name.length < two.Name.length ? -1 : 1));
      }
    });
  }

  createForm() {
    this._form = this.fb.group({
      hasOrder: [false],
      hasAddress: [false],
      hasPhone: [false],
      hasUnread: [false],
      notAddress: [false],
      notPhone: [false]
    });
  }

  openDrawerFillter() {
    this.visibleDrawerFillter = true;
  }

  close(): void {
    this.visibleDrawerFillter = false;
  }

  onChange(result: Date[]): void {
    this.daterange = result;
  }

  onSelectTag(item: TDSSafeAny) {
    this.keyTags[item.Id] = !this.keyTags[item.Id];
  }

  selectUser(item: TDSSafeAny) {
    item.selected = !item.selected;
  }

  resetFilter() {
    this.daterange = [];
    this.keyTags = {};
    this.users.forEach((x) => {
      delete x.selected;
    });

    this._form.reset();
    this.toggle_Key = !this.toggle_Key;
    this.filtered = false;
    this.visibleDrawerFillter = false;
  }

  public clearFilter(): void {
    this.resetFilter();
    this.onFilter.emit({});
  }

  searchTag() {
    let data = this.tags;
    let key = this.keyFilterTag;
    if (TDSHelperString.hasValueString(key)) {
      key = TDSHelperString.stripSpecialChars(key.trim());
    }
    data = data.filter((x) =>
      (x.Name && TDSHelperString.stripSpecialChars(x.Name.toLowerCase()).indexOf(TDSHelperString.stripSpecialChars(key.toLowerCase())) !== -1))
    this.lstOfTag = data
    console.log(data)
  }

  prepareValues(): any {
    const formModel = this._form.value;
    const model: any = {
      hasPhone: formModel.hasPhone as boolean,
      hasAddress: formModel.hasAddress as boolean,
      hasOrder: formModel.hasOrder as boolean,
      hasUnread: formModel.hasUnread as boolean,
      notAddress: formModel.notAddress as boolean,
      notPhone: formModel.notPhone as boolean,
    };

    return model;
  }

  onSubmit(): void {
    let tagIds: TDSSafeAny[] = [];
    Object.keys(this.keyTags).forEach((element) => {
      if (this.keyTags[element]) {
        tagIds.push(element);
      }
    });

    let userIds: TDSSafeAny[] = [];
    this.users.forEach((x) => {
      if (x.selected) {
        userIds.push(x.Id);
      }
    });

    let model = {
      from_date: this.daterange[0] ? this.daterange[0].toISOString() : null,
      to_date: this.daterange[1] ? this.daterange[1].toISOString() : null,
      tag_ids: tagIds,
      user_ids: userIds,
    };

    let checkModel = this.prepareValues();
    model = Object.assign(model, checkModel);

    this.onFilter.emit(model);
    this.toggle_Key = !this.toggle_Key;
    this.visibleDrawerFillter = false;
    this.filtered = true;
  }
}
