import { ApplicationUserService } from './../../../../services/application-user.service';
import { TDSHelperArray, TDSSafeAny } from 'tmt-tang-ui';
import { CRMMatchingService } from './../../../../services/crm-matching.service';
import { CRMTagService } from './../../../../services/crm-tag.service';
import { FormGroup, FormControl, FormBuilder } from '@angular/forms';
import { Component, OnInit, Input, Output, EventEmitter, SimpleChanges, OnChanges } from '@angular/core';
import { CRMTeamDTO } from 'src/app/main-app/dto/team/team.dto';

@Component({
  selector: 'conversation-all-filter',
  templateUrl: './conversation-all-filter.component.html',
  styleUrls: ['./conversation-all-filter.component.scss']
})
export class ConversationAllFilterComponent implements OnInit, OnChanges {

  _form !: FormGroup;

  @Input() team!: CRMTeamDTO;
  @Input() totalCount!: number;
  @Output() onFilter: EventEmitter<any> = new EventEmitter();

  visibleDrawerFillter: boolean = false;
  rangeDate!: Date;
  keyTags: any = {};
  tags: TDSSafeAny[] = [];
  users: TDSSafeAny[] = [];
  total: number = 0;
  daterange: Date[] = [];
  toggle_Key: boolean = true;
  filtered: boolean = false;

  constructor(private fb: FormBuilder,
    private crmTagService: CRMTagService,
    private crmMatchingService: CRMMatchingService,
    private applicationUserService: ApplicationUserService) {
      this.createForm();
  }

  ngOnChanges(simpleChange: SimpleChanges) {
    if (simpleChange.totalCount) {
      this.total = simpleChange.totalCount.currentValue || 0;
    }
    if (simpleChange.data) {
      this.resetFilter();
    }
  }

  ngOnInit(): void {
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

      this.users = res;
    });

    this.crmTagService.dataSource$.subscribe((res) => {
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
      this.tags = res;
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
