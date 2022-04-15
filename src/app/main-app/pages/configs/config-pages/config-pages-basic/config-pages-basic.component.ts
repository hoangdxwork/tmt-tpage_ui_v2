import { Component, OnInit } from '@angular/core';

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
  constructor() { }

  ngOnInit(): void {
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
