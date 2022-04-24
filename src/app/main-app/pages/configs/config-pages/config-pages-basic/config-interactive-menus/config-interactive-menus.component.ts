import { Component, OnInit, Input, SimpleChanges, EventEmitter, Output, OnChanges, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { Message } from 'src/app/lib/consts/message.const';
import { ProfileMessageDTO } from 'src/app/main-app/dto/configs/page-config.dto';
import { CRMTeamDTO } from 'src/app/main-app/dto/team/team.dto';
import { CRMTeamService } from 'src/app/main-app/services/crm-team.service';
import { FacebookService } from 'src/app/main-app/services/facebook.service';
import { TDSMessageService, TDSSafeAny, TDSHelperArray } from 'tmt-tang-ui';

@Component({
  selector: 'config-interactive-menus',
  templateUrl: './config-interactive-menus.component.html'
})
export class ConfigInteractiveMenusComponent implements OnInit, OnChanges, OnDestroy {

  @Input() eventOnSave: boolean = false;
  @Output() onSaveSuccess = new EventEmitter();

  formConfigInteractiveMenus!: FormGroup;

  currentTab: number = 0;
  currentTeam!: CRMTeamDTO | null;
  isLoading: boolean = false;

  private destroy$ = new Subject();

  isSelect: boolean = false;

  lstData: ProfileMessageDTO[] = [];
  lstProfileMessages: ProfileMessageDTO[] = [];

  lstType = {
    post_back: "postback",
    web_url: "web_url"
  }

  constructor(
    private formBuilder: FormBuilder,
    private crmTeamService: CRMTeamService,
    private message: TDSMessageService,
    private facebookService: FacebookService
  ) { }

  ngOnChanges(changes: SimpleChanges): void {
    if(changes?.eventOnSave?.currentValue) {
      let currentPageId = this.currentTeam?.Facebook_PageId;

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

      if(res && res.Facebook_PageId) {
        let pageId = res.Facebook_PageId;
        this.updateAutoReplyConfig(pageId);
      }

    });
  }

  updateAutoReplyConfig(pageId: string) {
    this.isLoading = true;
    this.isSelect = false;
    this.facebookService.getChannelConfig(pageId).subscribe(res => {
      this.lstData = res.profile_messages;
      this.lstProfileMessages = this.lstData.map(x => ({...x}));

      if(TDSHelperArray.hasListValue(this.lstData)) {
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

  add() {
    let item: ProfileMessageDTO = {
      type: this.lstType.web_url,
      title: 'Chưa đặt tên',
      payload: null,
      url: null,
      isActive: true
    };

    this.lstProfileMessages.push(item);
    this.lstData.push(item);
  }

  onSave(pageId: string) {
    this.isLoading = true;
    let check = this.checkValue();

    if(check != null) {
      this.facebookService.updateProfileMessage(pageId, check).subscribe(res => {
        this.lstData = res.profile_messages;
        this.lstProfileMessages = this.lstData.map(x => ({...x}));

        this.message.success(Message.UpdatedSuccess);
        this.isLoading = false;
        this.onSaveSuccess.emit(true)
      }, error => {
        this.isLoading = false;
        this.onSaveSuccess.emit(false);
        if(error?.Message) this.message.error(error?.Message);
        else this.message.error(Message.ErrorOccurred);
      });
    }
    else {
      this.isLoading = false;
      this.onSaveSuccess.emit(false);
    }

  }

  onRemoveInteract(index: number) {
    this.lstProfileMessages.splice(index, 1);
    this.lstData.splice(index, 1);
  }

  onConfirmInteract(item: ProfileMessageDTO, index: number) {
    this.lstData[index] = ({...item});
    this.message.info(Message.Config.PageConfig.Saved);
  }

  onOpenTab(item: ProfileMessageDTO, index: number) {debugger;
    item.tabSelected = !item.tabSelected ? true : false;
    this.lstData[index].tabSelected = item.tabSelected;
  }

  onCloseTab(item: ProfileMessageDTO, index: number) {
    item.tabSelected = !item.tabSelected ? true : false;
    this.lstData[index].tabSelected = item.tabSelected;
    this.lstProfileMessages[index] = ({...this.lstData[index]});
  }

  checkValue(): ProfileMessageDTO[] | null{
    let data = this.lstData.map(x => ({...x}));

    let result = 1;

    for (let index = 0; index < data.length; index++) {
      data[index].url = data[index].type == this.lstType.post_back ? null : data[index].url;
      if (!data[index].url && data[index].type == this.lstType.web_url) {
        this.message.error(Message.Config.PageConfig.InfoEmpty);
        result = 0;
        break;
      }

      data[index].payload = data[index].type == this.lstType.web_url ? null : data[index].payload;
      if (!data[index].payload && data[index].type == this.lstType.post_back) {
        this.message.error(Message.Config.PageConfig.InfoEmpty);
        result = 0;
        break;
      }
    }

    return result ? data : null;
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

}
