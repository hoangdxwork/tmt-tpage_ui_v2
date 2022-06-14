import { ConfigDataFacade } from './../../../../services/facades/config-data.facade';
import { CRMTeamService } from 'src/app/main-app/services/crm-team.service';
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { CRMTeamDTO } from 'src/app/main-app/dto/team/team.dto';
import { Message } from 'src/app/lib/consts/message.const';
import { TDSMessageService } from 'tds-ui/message';

@Component({
  selector: 'app-config-pages-basic',
  templateUrl: './config-pages-basic.component.html'
})
export class ConfigPagesBasicComponent implements OnInit {

  formConfigAutoReply!: FormGroup;

  currentTab: number = 0;
  currentTeam!: CRMTeamDTO | null;
  isLoading: boolean = false;

  onSaveAutoReply: boolean = false;
  onSaveAutoHideComment: boolean = false;
  onSaveInteractiveMenus: boolean = false;
  onSaveQuickQuestion: boolean = false;
  onSaveGreeting: boolean = false;

  constructor(
    private message: TDSMessageService,
    private configDataService: ConfigDataFacade
  ) { }

  ngOnInit(): void {
  }

  selectedIndexChange(event: number) {
    this.currentTab = event;
  }

  onSave() {
    switch(this.currentTab) {
      case 0:
        this.onSaveAutoReply = true;
        break;
      case 1:
        this.onSaveAutoHideComment = true;
        break;
      case 2:
        this.onSaveInteractiveMenus = true;
        break;
      case 3:
        this.onSaveQuickQuestion = true;
        break;
      case 4:
        this.onSaveGreeting = true;
        break;
      default:
        this.message.error(Message.ErrorOccurred);
        break;
    }
  }

  onSaveAutoReplySuccess(event: boolean) {
    this.onSaveAutoReply = false;
  }
  onSaveAutoHideCommentSuccess(event: boolean) {
    this.onSaveAutoHideComment = false;
  }
  onSaveInteractiveMenusSuccess(event: boolean) {
    this.onSaveInteractiveMenus = false;
  }
  onSaveQuickQuestionSuccess(event: boolean) {
    this.onSaveQuickQuestion = false;
  }
  onSaveGreetingSuccess(event: boolean) {
    this.onSaveGreeting = false;
  }

}
