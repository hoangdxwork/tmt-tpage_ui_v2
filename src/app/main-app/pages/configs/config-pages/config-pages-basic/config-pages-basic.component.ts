import { TDSMessageService } from 'tmt-tang-ui';
import { CRMTeamService } from 'src/app/main-app/services/crm-team.service';
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { CRMTeamDTO } from 'src/app/main-app/dto/team/team.dto';
import { Message } from 'src/app/lib/consts/message.const';
import { AutoReplyConfigDTO } from 'src/app/main-app/dto/configs/page-config.dto';

@Component({
  selector: 'app-config-pages-basic',
  templateUrl: './config-pages-basic.component.html',
  styleUrls: ['./config-pages-basic.component.scss']
})
export class ConfigPagesBasicComponent implements OnInit {

    isOpenTagFeedbackCommentAuto:boolean = true
    isOpenTagFeedbackAllowMultiple:boolean = true
    isOpenTagFeedbackAllComment:boolean = true
    isOpenTagFeedbackCommentContainsPhone:boolean = true
    isOpenTagFeedbackCommentContainsEmail:boolean = true
    isOpenTagFeedbackkMessage:boolean = true

    isOpenTagHiddenCommentAuto:boolean = true
    isOpenTagHiddenkAllComment:boolean = true
    isOpenTagHiddenCommentContainsPhone:boolean = true
    isOpenTagHiddenCommentContainsEmail:boolean = true

  isOpenTagMenuTurnOnInteract:boolean = true;

  isOpenTagturnOnQuestionQuick: boolean = true;

  isOpenTagturnOnListGreeting: boolean = true;

  indClickInteract = -1
  indClickQuestion = -1
  listOfDataInteract=[
    {id:1, name:'Tương tác 1', statusSwitch: true},
    {id:2, name:'Tương tác 2', statusSwitch: true}
  ]
  listOfDataQuestion=[
    {id:1, text:'Cảm ơn bạn đã liên hệ, bạn có đang cần nhân viên tư vấn không?'},
    {id:2, text:'Cảm ơn bạn đã liên hệ, bạn có đang cần nhân viên tư vấn không?'},
    {id:3, text:'Cảm ơn bạn đã liên hệ, bạn có đang cần nhân viên tư vấn không?'},
  ]


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
    private formBuilder: FormBuilder,
    private crmTeamService: CRMTeamService,
    private message: TDSMessageService,
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

  // change switch tabs Phẩn hồi bình luận
  changefeedbackMessage(){
    this.isOpenTagFeedbackkMessage = !this.isOpenTagFeedbackkMessage
  }
  ChangeTagFeedbackCommentAuto(){
    this.isOpenTagFeedbackCommentAuto = !this.isOpenTagFeedbackCommentAuto
  }
  ChangeTagFeedbackAllowMultiple(){
    this.isOpenTagFeedbackAllowMultiple = !this.isOpenTagFeedbackAllowMultiple
  }
  ChangeTagTagFeedbackAllComment(){
    this.isOpenTagFeedbackAllComment = !this.isOpenTagFeedbackAllComment
  }

  // change switch tabs Ẩn bình luận
  changeTagHiddenCommentAuto(){
    this.isOpenTagHiddenCommentAuto = !this.isOpenTagHiddenCommentAuto
  }

  // change switch tabs Menu tương tác
  changeTagMenuTurnOnInteract(){
    this.isOpenTagMenuTurnOnInteract = !this.isOpenTagMenuTurnOnInteract
  }
  addDataInteract(){
    var interact = {id: this.listOfDataInteract.length+1, name: `Tương tác ${this.listOfDataInteract.length+1}`, statusSwitch: true}
    this.listOfDataInteract.push(interact)
  }
  clickEditInteract(id: number){
    this.indClickInteract = id
  }

  clickCloseInteract(){
    this.indClickInteract = -1
  }

  showUpdateInteract(id: number){

  }

  // change switch tabs Các câu hỏi nhanh

  clickEditQuestion(id: number){
    this.indClickQuestion = id
  }
  clickCloseQuestion(){
    this.indClickQuestion = -1
  }
  addDataQuestion(){
    var question = {id: this.listOfDataQuestion.length+1, text:'Cảm ơn bạn đã liên hệ, bạn có đang cần nhân viên tư vấn không?'}
    this.listOfDataQuestion.push(question)
  }

  changeTagturnOnQuestionQuick(){
    this.isOpenTagturnOnQuestionQuick = !this.isOpenTagturnOnQuestionQuick
  }

  // change switch tabs :Lời chào
  changeTagturnOnListGreeting(){
    this.isOpenTagturnOnListGreeting = !this.isOpenTagturnOnListGreeting
  }
}
