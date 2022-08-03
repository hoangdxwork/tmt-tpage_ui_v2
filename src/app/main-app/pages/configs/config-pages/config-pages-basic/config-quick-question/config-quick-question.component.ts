import { Component, EventEmitter, Input, OnInit, Output, SimpleChanges, OnChanges, OnDestroy } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { Message } from 'src/app/lib/consts/message.const';
import { QuickQuestionDTO } from 'src/app/main-app/dto/configs/page-config.dto';
import { CRMTeamDTO } from 'src/app/main-app/dto/team/team.dto';
import { CRMTeamService } from 'src/app/main-app/services/crm-team.service';
import { FacebookService } from 'src/app/main-app/services/facebook.service';
import { TDSMessageService } from 'tds-ui/message';
import { TDSHelperArray, TDSHelperString } from 'tds-ui/shared/utility';

@Component({
  selector: 'config-quick-question',
  templateUrl: './config-quick-question.component.html'
})
export class ConfigQuickQuestionComponent implements OnInit, OnChanges, OnDestroy {

  @Input() eventOnSave: boolean = false;
  @Output() onSaveSuccess = new EventEmitter();

  private destroy$ = new Subject<void>();

  currentTeam!: CRMTeamDTO | null;
  isSelect: boolean = false;
  isLoading: boolean = false;

  lstData: QuickQuestionDTO[] = [];
  lstQuickQuestion: QuickQuestionDTO[] = [];

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
      this.lstData = res.quick_answers;
      this.lstQuickQuestion = this.lstData.map(x => ({...x}));

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
    let item: QuickQuestionDTO = {
      question: "Câu hỏi?",
      answer: "Câu trả lời",
      payload: "Payload",
      isActive: true,
      tabSelected: false
    };

    this.lstQuickQuestion.push(item);
    this.lstData.push(item);
  }

  onSave(pageId: string) {
    this.isLoading = true;
    let check = this.checkValue();

    if(check != null) {
      this.facebookService.updateQuickQuestion(pageId, check).subscribe(res => {
        this.lstData = res.quick_answers;
        this.lstQuickQuestion = this.lstData.map(x => ({...x}));

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

  onOpenTab(item: QuickQuestionDTO, index: number) {
    item.tabSelected = !item.tabSelected ? true : false;
    this.lstData[index].tabSelected = item.tabSelected;
  }

  onCloseTab(item: QuickQuestionDTO, index: number) {
    item.tabSelected = !item.tabSelected ? true : false;
    this.lstData[index].tabSelected = item.tabSelected;
    this.lstQuickQuestion[index] = ({...this.lstData[index]});
  }

  onRemoveInteract(index: number) {
    this.lstQuickQuestion.splice(index, 1);
    this.lstData.splice(index, 1);
  }

  onConfirmInteract(item: QuickQuestionDTO, index: number) {
    this.lstData[index] = ({...item});
    this.message.info(Message.Config.PageConfig.Saved);
  }

  checkValue(): QuickQuestionDTO[] | null{
    let data = this.lstData.map(x => ({...x}));

    let result = 1;

    for (let index = 0; index < data.length; index++) {
      if(!TDSHelperString.hasValueString(data[index].question) ||
        !TDSHelperString.hasValueString(data[index].answer) ||
        !TDSHelperString.hasValueString(data[index].answer))
      {
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
