import { Component, EventEmitter, Input, OnChanges, OnDestroy, OnInit, Output, SimpleChanges } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { Message } from 'src/app/lib/consts/message.const';
import { GreetingDTO } from 'src/app/main-app/dto/configs/page-config.dto';
import { CRMTeamDTO } from 'src/app/main-app/dto/team/team.dto';
import { CRMTeamService } from 'src/app/main-app/services/crm-team.service';
import { FacebookService } from 'src/app/main-app/services/facebook.service';
import { TDSMessageService } from 'tds-ui/message';
import { TDSHelperArray, TDSSafeAny } from 'tds-ui/shared/utility';

@Component({
  selector: 'config-greeting',
  templateUrl: './config-greeting.component.html'
})
export class ConfigGreetingComponent implements OnInit, OnChanges, OnDestroy  {

  @Input() eventOnSave: boolean = false;
  @Output() onSaveSuccess = new EventEmitter();

  private destroy$ = new Subject<void>();

  currentTeam!: CRMTeamDTO | null;
  isSelect: boolean = false;
  isLoading: boolean = false;

  getStarted: string = "";
  lstGreeting: GreetingDTO[] = [];

  suggests: any = [
    { value: '{{user_first_name}}', text: "Tên" },
    { value: '{{user_last_name}}', text: "Họ" },
    { value: '{{user_full_name}}', text: "Họ & tên" }
  ]

  constructor(
    private formBuilder: FormBuilder,
    private crmTeamService: CRMTeamService,
    private message: TDSMessageService,
    private facebookService: FacebookService
  ) { }

  ngOnChanges(changes: SimpleChanges): void {
    if(changes?.eventOnSave?.currentValue) {
      let currentPageId = this.currentTeam?.ChannelId;

      if(!currentPageId) {
        this.message.error(Message.PageNotExist);
        return;
      }

      this.onSave(currentPageId);
    }
  }

  ngOnInit(): void {
    this.loadConfigs();
  }

  loadConfigs() {
    this.crmTeamService.onChangeTeam().pipe(takeUntil(this.destroy$)).subscribe(res => {
      this.currentTeam = res;

      if(res && res.Facebook_PageId || res?.ChannelId) {
        let pageId = res.Facebook_PageId || res?.ChannelId;
        this.updateQuickAnswerConfig(pageId);
      }

    });
  }

  updateQuickAnswerConfig(pageId: string) {
    this.isLoading = true;
    this.isSelect = false;
    this.facebookService.getChannelConfig(pageId).subscribe(res => {
      this.initGreeting(res.greeting);
      this.getStarted = res.get_started || '';

      if(TDSHelperArray.hasListValue(this.lstGreeting)) {
        this.isSelect = true;
      }

      this.isLoading = false;
    }, error => {
      this.isLoading = false;
      this.onSaveSuccess.emit(false);
      if(error?.error?.message) this.message.error(error?.error?.message);
      else this.message.error(Message.ErrorOccurred);
    });
  }

  initGreeting(greetings: GreetingDTO[]) {
    if(TDSHelperArray.hasListValue(greetings)){
      this.lstGreeting = greetings;
    }
    else {
      let add: GreetingDTO = {
        locale: "default",
        text: "Nhập giới thiệu",
        isActive: true,
      };
      this.lstGreeting.length = 0;
      this.lstGreeting.push(add);
    }
  }

  addSuggest(item: TDSSafeAny, index: number) {
    if(this.lstGreeting && this.lstGreeting[index]) {
      this.lstGreeting[index].text += item.value;
    }
  }

  onSave(pageId: string) {
    this.isLoading = true;
    let check = this.checkValue();

    if(check != null) {
      this.facebookService.updateGreeting(pageId, this.getStarted, check).subscribe(res => {
        this.initGreeting(res.greeting);
        this.getStarted = res.get_started;

        this.message.success(Message.UpdatedSuccess);
        this.isLoading = false;
        this.onSaveSuccess.emit(true)
      }, error => {
        this.isLoading = false;
        this.onSaveSuccess.emit(false);
        if(error?.Message) this.message.error(error?.Message);
        else if(error?.error?.message) this.message.error(error?.error?.message);
        else this.message.error(Message.ErrorOccurred);
      });
    }
    else {
      this.isLoading = false;
      this.onSaveSuccess.emit(false);
    }
  }

  checkValue(): GreetingDTO[] | null{
    let data = this.lstGreeting.map(x => {
      let item = {
        locale: "default",
        text: x.text
      }
      return item;
    });

    return data;
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

}
