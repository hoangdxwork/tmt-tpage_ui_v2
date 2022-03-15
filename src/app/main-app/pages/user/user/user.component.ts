import { NgForm } from '@angular/forms';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.scss']
})
export class UserComponent implements OnInit {

  isInfo = true
  isPass = false
  isChangeInfo = false
  typeChoose = 'user';
  form! : NgForm

  constructor() { }

  ngOnInit(): void {
  }

  changeType(type: string){
    this.typeChoose = type;
  }
  outputChooseItem(item: boolean){
    this.isInfo= item
    this.isPass = !this.isInfo
  }
  changeInfo(){
    this.isChangeInfo = true;
  }
  cancelChange(){
    this.isChangeInfo = false;
  }
  outputFormUser(form : NgForm){
    this.form = form
  }
  onSumitInfoUser(){
    console.log(this.form)
  }
}
